import { Component, OnInit, computed, signal } from '@angular/core';

import { Container } from '../general/container/container';
import { ActivatedRoute } from '@angular/router';
import { GamesServices } from '../../services/games-services';

import { NgClass, NgForOf, NgIf } from '@angular/common';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CarrouselImages } from '../general/carrousel-images/carrousel-images';
import { CarrouselVideos } from '../general/carrousel-videos/carrousel-videos';

import { ValorationsService } from '../../services/valorations-service';
import { AuthService } from '../../services/auth-service';

import { FormsModule } from '@angular/forms';

import {
  cleanUrlImage,
  getGenreIcon,
  getImage,
  getLocalImage,
  getMediaValue,
  getPlatformIcon,
  transformDate,
} from '../../services/utilities-service';

import { CreateValoration, UpdateValoration, Valoration } from '../../interfaces/valoration';

import { firstValueFrom } from 'rxjs';

import { TextFieldModule } from '@angular/cdk/text-field';

import { ModalService } from '../../services/modal-service';
import { Loader } from '../general/loader/loader';

import { User } from '../../interfaces/user';
import { Games } from '../../interfaces/games';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    Container,
    NgForOf,
    CarrouselImages,
    CarrouselVideos,
    NgClass,
    FormsModule,
    NgIf,
    TextFieldModule,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
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
export class Details implements OnInit {
  id = signal<string>('');

  game = signal<Games | null>(null);

  user = signal<User | null>(null);

  createValoration = signal<CreateValoration>({
    value: 0,
    description: '',
    gameId: null,
  });

  updateValoration = signal<UpdateValoration>({
    id: null,
    description: '',
    value: 0,
    gameId: null,
  });

  valorations = signal<Valoration[]>([]);

  myValorations = signal<Valoration[]>([]);

  editMode = signal<boolean>(false);

  confirmDeleteId = signal<string | null>(null);

  page = signal<number>(1);

  limit = 10;

  /**
   * Todas las valoraciones excepto la del usuario actual.
   */
  valorationsWitouthMyValoration = computed(() => {
    const allValorations = this.valorations();

    const currentUser = this.user();

    if (!currentUser) {
      return allValorations;
    }

    return allValorations.filter((valoration) => valoration.userId !== currentUser.id);
  });

  /**
   * Valoraciones de la página actual.
   */
  paginatedValorations = computed(() => {
    const valorations = this.valorationsWitouthMyValoration();

    const start = (this.page() - 1) * this.limit;

    const end = start + this.limit;

    return valorations.slice(start, end);
  });

  /**
   * Número total de páginas.
   */
  totalPages = computed(() => {
    return Math.ceil(this.valorationsWitouthMyValoration().length / this.limit);
  });

  /**
   * Media de las valoraciones.
   */
  mediaValue = computed(() => {
    return getMediaValue(this.valorations());
  });

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly gamesService: GamesServices,
    private readonly sanitizer: DomSanitizer,
    private readonly valorationsService: ValorationsService,
    private readonly authService: AuthService,
    private readonly modalService: ModalService,
  ) {}

  async ngOnInit(): Promise<void> {
    const routeId = this.activatedRoute.snapshot.params['id'];

    this.id.set(routeId);

    this.modalService.open(
      Loader,
      {},
      {
        text: 'Loading...',
      },
    );

    await this.searchUser();

    this.searchGameById(parseInt(this.id()));

    if (this.user()) {
      this.searchMyValorationsByGameId();
    }

    this.getAllValorationsByGameId();

    this.editMode.set(false);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.page.set(1);

    this.modalService.close();
  }

  async searchUser(): Promise<void> {
    if (!this.authService.getToken()) {
      this.user.set(null);

      return;
    }

    try {
      const user = await firstValueFrom(this.authService.getUserByToken());

      this.user.set(user || null);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);

      this.user.set(null);
    }
  }

  userImage(type: 'me' | 'others', val?: Valoration): string | null {
    let img: string | undefined;

    if (type === 'me') {
      img = this.user()?.Images?.[0]?.url;
    } else if (val) {
      img = val.User?.Images?.[0]?.url;
    }

    return img ? 'http://localhost:3000/' + cleanUrlImage(img) : null;
  }

  searchGameById(id: number): void {
    this.gamesService.getGameById(id).subscribe({
      next: (games: Games[]) => {
        this.game.set(games[0] ?? null);
      },

      error: (error) => {
        console.error('Error al obtener el juego:', error);

        this.game.set(null);
      },
    });
  }

  changeEditMode(id: string, gameId: string): void {
    this.editMode.set(true);

    this.searchValorationByIdAndByGameId(id, gameId);
  }

  updateMyValoration(): void {
    const currentValoration = this.updateValoration();

    if (!currentValoration.id) {
      return;
    }

    const formData = new FormData();

    formData.append('description', currentValoration.description);

    formData.append('value', currentValoration.value.toString());

    this.valorationsService.update(currentValoration.id, formData).subscribe({
      next: () => {
        this.cancelEditMode();

        this.searchMyValorationsByGameId();

        this.getAllValorationsByGameId();
      },

      error: (error) => {
        console.error('Error al actualizar la valoración:', error);
      },
    });
  }

  deleteReview(id: string): void {
    this.valorationsService.delete(id).subscribe({
      next: async () => {
        this.confirmDeleteId.set(null);

        this.searchMyValorationsByGameId();

        this.getAllValorationsByGameId();

        await this.searchUser();
      },

      error: (error) => {
        console.error('Error al eliminar la valoración:', error);
      },
    });
  }

  cancelEditMode(): void {
    this.editMode.set(false);
  }

  getAllValorationsByGameId(): void {
    this.valorationsService.getAllByGameId(this.id()).subscribe({
      next: (valorations: Valoration[]) => {
        this.valorations.set(valorations);

        const totalPages = Math.ceil(this.valorationsWitouthMyValoration().length / this.limit);

        if (totalPages > 0 && this.page() > totalPages) {
          this.page.set(totalPages);
        }

        if (totalPages === 0) {
          this.page.set(1);
        }
      },

      error: (error) => {
        console.error('Error al obtener las valoraciones:', error);

        this.valorations.set([]);
      },
    });
  }

  searchMyValorationsByGameId(): void {
    this.valorationsService.getMyValorationsByGameId(this.id()).subscribe({
      next: (valorations: Valoration[]) => {
        this.myValorations.set(valorations);
      },

      error: (error) => {
        console.error('Error al obtener mis valoraciones:', error);

        this.myValorations.set([]);
      },
    });
  }

  searchValorationByIdAndByGameId(id: string, gameId: string): void {
    this.valorationsService.getValorationByIdAndByGameId(id, gameId).subscribe({
      next: (valoration: Valoration) => {
        this.updateValoration.set({
          id: valoration.id,

          description: valoration.description,

          value: parseInt(valoration.value),

          gameId: valoration.gameId,
        });
      },

      error: (error) => {
        console.error('Error al obtener la valoración:', error);
      },
    });
  }

  setNote(note: number, type: 'update' | 'create'): void {
    if (type === 'update') {
      this.updateValoration.update((valoration) => ({
        ...valoration,
        value: note,
      }));
    } else {
      this.createValoration.update((valoration) => ({
        ...valoration,
        value: note,
      }));
    }
  }

  updateCreateDescription(description: string): void {
    this.createValoration.update((valoration) => ({
      ...valoration,
      description,
    }));
  }

  updateUpdateDescription(description: string): void {
    this.updateValoration.update((valoration) => ({
      ...valoration,
      description,
    }));
  }

  createMyValoration(): void {
    const currentValoration = this.createValoration();

    const formData = new FormData();

    formData.append('description', currentValoration.description);

    formData.append('value', currentValoration.value.toString());

    formData.append('gameId', this.id());

    this.valorationsService.create(formData).subscribe({
      next: () => {
        this.getAllValorationsByGameId();

        this.searchMyValorationsByGameId();

        this.createValoration.set({
          description: '',

          gameId: null,

          value: 0,
        });
      },

      error: (error) => {
        console.error('Error al crear la valoración:', error);
      },
    });
  }

  paginator(type: 'next' | 'prev'): void {
    if (type === 'next') {
      const totalPages = this.totalPages();

      if (this.page() < totalPages) {
        this.page.update((value) => value + 1);
      }
    } else {
      if (this.page() > 1) {
        this.page.update((value) => value - 1);
      }
    }
  }

  protected readonly transformDate = transformDate;

  protected readonly cleanUrlImage = cleanUrlImage;

  protected readonly getImage = getImage;

  protected readonly getPlatformIcon = getPlatformIcon;

  protected readonly getGenreIcon = getGenreIcon;

  protected readonly getMediaValue = getMediaValue;

  protected readonly parseInt = parseInt;

  protected readonly getLocalImage = getLocalImage;
}
