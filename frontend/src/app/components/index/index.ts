import { Component, OnInit, signal } from '@angular/core';
import { GamesServices } from '../../services/games-services';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Container } from '../general/container/container';
import { getImage, getLocalImage, sleep } from '../../services/utilities-service';
import { ValorationsService } from '../../services/valorations-service';
import { ModalService } from '../../services/modal-service';
import { Loader } from '../general/loader/loader';
import { Filters } from '../filters/filters';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Card } from '../general/card/card';
import { Games } from '../../interfaces/games';

@Component({
  selector: 'app-index',
  imports: [
    NgForOf,
    FormsModule,
    Container,
    NgIf,
    Filters,
    MatSidenavModule,
    MatButtonModule,
    NgStyle,
    Card,
    NgClass,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
  standalone: true,
  styles: [
    `
      ::ng-deep .my-small-btn.mat-mdc-raised-button {
        min-width: 40px !important;
        height: 40px !important;
        padding: 0 !important;
      }

      ::ng-deep .my-small-btn .mdc-button__label {
        padding: 0 !important;
        margin: 0 !important;
      }

      ::ng-deep .my-small-btn .mat-mdc-button-touch-target {
        height: 40px !important;
        width: 40px !important;
      }
    `,
  ],
})
export class Index implements OnInit {
  games = signal<Games[]>([]);

  search = signal<string>('');
  page = signal<number>(1);
  limit = 27;

  isOpen = signal<boolean>(false);
  drawerMode = signal<'side' | 'over'>('side');
  isPhone = signal<boolean>(false);

  constructor(
    private readonly gamesService: GamesServices,
    private readonly router: Router,
    private readonly valorationService: ValorationsService,
    private readonly modalService: ModalService,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  async ngOnInit() {
    await this.searchFunc({}, true);

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (result.matches) {
        this.drawerMode.set('over');
        this.isOpen.set(false);
        this.isPhone.set(true);
      } else {
        this.drawerMode.set('side');
        this.isOpen.set(true);
        this.isPhone.set(false);
      }
    });
  }

  openDrawer(): void {
    this.isOpen.update((value) => !value);
  }

  async paginator(type: string): Promise<void> {
    if (type === 'next') {
      this.page.update((value) => value + 1);

      await this.searchFunc();
    } else if (type === 'prev') {
      if (this.page() > 1) {
        this.page.update((value) => value - 1);

        await this.searchFunc();
      }
    }
  }

  async searchFunc(
    filters: {
      genres?: number[];
      platforms?: number[];
      minRating?: number;
      maxRating?: number;
      sortBy?: string;
      sortOrder?: string;
      year?: number;
      search?: string;
    } = {},
    isReset: boolean = false,
  ): Promise<void> {
    if (isReset) {
      this.page.set(1);
    }

    try {
      this.modalService.open(
        Loader,
        {},
        {
          text: 'Loading...',
        },
      );

      const searchTerm = this.isPhone() ? filters.search || '' : this.search();

      this.gamesService.searchGames(searchTerm, filters, this.page(), this.limit).subscribe({
        next: (games: Games[]) => {
          this.games.set(games);
        },

        error: (err) => {
          console.error(err);
          this.games.set([]);
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      await sleep(2000);

      this.modalService.close();
    }
  }

  onDrawerClosed(): void {
    this.isOpen.set(false);
  }

  details(id: number): void {
    this.router.navigate(['details', id]);
  }

  protected readonly getImage = getImage;
  protected readonly getLocalImage = getLocalImage;
}
