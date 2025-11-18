import {Component, OnInit} from '@angular/core';
import {Container} from '../general/container/container';
import {ActivatedRoute} from '@angular/router';
import {Game, GamesServices} from '../../services/games-services';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CarrouselImages} from '../general/carrousel-images/carrousel-images';
import {CarrouselVideos} from '../general/carrousel-videos/carrousel-videos';
import {ValorationsService} from '../../services/valorations-service';
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {
  cleanUrlImage,
  getGenreIcon,
  getImage, getLocalImage,
  getMediaValue,
  getPlatformIcon, sleep,
  transformDate
} from '../../services/utilities-service';
import {CreateValoration, UpdateValoration, Valoration} from '../../interfaces/valoration';
import {firstValueFrom} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {ModalService} from '../../services/modal-service';
import {Loader} from '../general/loader/loader';

@Component({
  selector: 'app-details',
  imports: [
    Container,
    NgForOf,
    CarrouselImages,
    CarrouselVideos,
    NgClass,
    FormsModule,
    NgStyle,
    NgIf,
    MatButton,
    MatFormField,
    MatInput,
    MatInputModule
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
  standalone: true

})
export class Details implements OnInit {

  id: string = ""
  game!: Game
  user: any | null = null
  createValoration: CreateValoration = {
    value: 0,
    description: "",
    gameId: null
  }

  updateValoration: UpdateValoration = {
    id: null,
    description: "",
    value: 0,
    gameId: null
  }

  valorations: Valoration[] = []

  valorationsWitouthMyValoration: Valoration[] = []

  myValorations: Valoration[] = []

  editMode: boolean = false

  mediaValue: number = 0

  confirmDeleteId: string | null = null

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly gamesService: GamesServices, private sanitizer: DomSanitizer, private readonly valorationsService: ValorationsService, private readonly authService: AuthService, private modalService: ModalService) {
  }


  async ngOnInit() {

    this.id = this.activatedRoute.snapshot.params['id'];

    this.modalService.open(Loader, {}, {text: 'Loading...'});

    this.searchGameById(parseInt(this.id))

    await this.searchUser()

    console.log("USER", this.user)


    this.searchMyValorationsByGameId()

    this.getAllValorationsByGameId()


    this.mediaValue = getMediaValue(this.valorations)
    this.editMode = false


    console.log("AAAAAAAA", this.valorationsWitouthMyValoration)

    await sleep(1000)

    this.modalService.close()


  }

  async searchUser() {
    try {
      this.user = await firstValueFrom(this.authService.getUserByToken()) || null
    }
    catch (e){
      this.user = null
      console.log(e)
    }
    finally {

    }

  }

  searchGameById(id: number): void {
    this.gamesService.getGameById(id).subscribe({
      next: async (game: Game[]) => {

        this.game = game[0]
      },
      error: error => {
        console.log(error)
      }
    })
  }

  changeEditMode(id: string, gameId: string) {
    this.editMode = true;
    this.searchValorationByIdAndByGameId(id, gameId)


  }

  updateMyValoration() {
    let formData = new FormData();
    formData.append('description', this.updateValoration.description)
    formData.append('value', this.updateValoration.value.toString())

    this.valorationsService.update(this.updateValoration.id, formData).subscribe({
      next: async () => {
        this.cancelEditMode()
        this.searchMyValorationsByGameId()

        this.getAllValorationsByGameId()
      },
      error: error => {
        console.log(error)
      }
    })
  }

  deleteReview(id: string) {
    this.valorationsService.delete(id).subscribe({
      next: async () => {
        this.confirmDeleteId = null
        this.searchMyValorationsByGameId()
        this.getAllValorationsByGameId()
        await this.searchUser()


      },
      error: error => {
        console.log(error)
      }
    })


  }

  cancelEditMode() {
    this.editMode = false
  }


  getAllValorationsByGameId() {
    this.valorationsService.getAllByGameId(this.id).subscribe({
      next: async (valorations: Valoration[]) => {
        this.valorations = valorations
        if(this.user !== null){
          this.valorationsWitouthMyValoration = valorations.filter(el => el.userId !== this.user.id)
        }
        else{
          this.valorationsWitouthMyValoration = valorations
        }

      },
      error: error => {
        console.log(error)
      }
    })

    console.log("AAAAAAAA", this.valorationsWitouthMyValoration)
  }

  searchMyValorationsByGameId() {
    this.valorationsService.getMyValorationsByGameId(this.id).subscribe({
      next: async (valorations: any[]) => {
        this.myValorations = valorations
      },
      error: error => {
        console.log(error)
      }
    })
  }

  searchValorationByIdAndByGameId(id: string, gameId: string): void {
    this.valorationsService.getValorationByIdAndByGameId(id, gameId).subscribe({
      next: async (valoration: Valoration) => {
        this.updateValoration = {
          id: valoration.id,
          description: valoration.description,
          value: parseInt(valoration.value),
          gameId: valoration.gameId
        }

      },
      error: error => {
        console.log(error)
      }
    })
  }


  setNote(note: number, type: 'update' | 'create') {
    if (type === 'update') {
      this.updateValoration.value = note
    } else if (type === 'create') {
      this.createValoration.value = note
    }
  }


  createMyValoration() {

    const formData = new FormData();

    formData.append('description', this.createValoration.description);
    formData.append('value', this.createValoration.value.toString());
    formData.append('gameId', this.id);

    this.valorationsService.create(formData).subscribe({
      next: async (data: any) => {

        this.getAllValorationsByGameId()
        this.searchMyValorationsByGameId()


        this.createValoration = {
          description: "",
          gameId: null,
          value: 0
        }
      },
      error: error => {
        console.log(error)
      }
    })
    console.log(this.createValoration);

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
