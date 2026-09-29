import {
  Component,
  ComponentRef,
  effect,
  signal,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {

  @ViewChild('modalContent', {
    read: ViewContainerRef,
    static: false
  })
  modalContent?: ViewContainerRef;

  show = signal(false);

  styles = signal<{ [key: string]: string }>({});

  private componentRef?: ComponentRef<any>;

  private pendingComponent?: Type<any>;

  private pendingData: Record<string, any> = {};

  private resolveOpen?: (value: any) => void;

  private rejectOpen?: () => void;

  constructor() {

    effect(() => {

      if (!this.show()) {
        return;
      }

      const component = this.pendingComponent;

      if (!component) {
        return;
      }

      const container = this.modalContent;

      if (!container) {
        return;
      }

      this.createDynamicComponent(
        container,
        component,
        this.pendingData
      );

    });

  }

  open<T>(
    component: Type<T>,
    styles: { [key: string]: string } = {},
    data: Partial<T> = {}
  ): Promise<any> {

    this.styles.set(styles);

    this.pendingComponent = component;

    this.pendingData = {
      ...data
    };

    this.show.set(true);

    return new Promise((resolve, reject) => {

      this.resolveOpen = resolve;
      this.rejectOpen = reject;

    });

  }

  private createDynamicComponent<T>(
    container: ViewContainerRef,
    component: Type<T>,
    data: Partial<T>
  ): void {

    container.clear();

    this.componentRef =
      container.createComponent(component);

    Object.assign(
      this.componentRef.instance,
      data
    );

    (this.componentRef.instance as any).close = () => {

      this.close();

      this.rejectOpen?.();

    };

    (this.componentRef.instance as any).confirm = (
      result?: any
    ) => {

      this.close();

      this.resolveOpen?.(result);

    };

    this.pendingComponent = undefined;

    this.pendingData = {};

  }

  close(): void {

    this.modalContent?.clear();

    this.componentRef = undefined;

    this.pendingComponent = undefined;

    this.pendingData = {};

    this.show.set(false);

    this.resolveOpen = undefined;
    this.rejectOpen = undefined;

  }

}