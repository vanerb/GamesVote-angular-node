import {Component, Input, OnInit, signal} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {getImage} from '../../../services/utilities-service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ScreenShots} from '../../../interfaces/games';

@Component({
  selector: 'app-carrousel-images',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './carrousel-images.html',
  styleUrl: './carrousel-images.css'
})
export class CarrouselImages implements OnInit {

  @Input()
  images: ScreenShots[] = [];

  currentIndex = signal<number>(0);

  visibleSlides = signal<number>(3);


  constructor(
    private readonly breakpointObserver: BreakpointObserver
  ) {
  }


  prevSlide(): void {

    if (this.currentIndex() > 0) {

      this.currentIndex.update(
        value => value - 1
      );

    }

  }


  nextSlide(): void {

    const maxIndex = Math.max(
      0,
      this.images.length - this.visibleSlides()
    );


    if (this.currentIndex() < maxIndex) {

      this.currentIndex.update(
        value => value + 1
      );

    }

  }


  ngOnInit(): void {

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {

        if (result.matches) {

          this.visibleSlides.set(1);

        } else {

          this.visibleSlides.set(3);

        }


        // Evita que el índice quede fuera de rango
        // al cambiar entre móvil y escritorio.
        const maxIndex = Math.max(
          0,
          this.images.length - this.visibleSlides()
        );


        if (this.currentIndex() > maxIndex) {

          this.currentIndex.set(maxIndex);

        }

      });

  }


  protected readonly getImage = getImage;

}