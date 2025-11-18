import {Component, OnInit} from '@angular/core';
import {GamesServices} from '../../services/games-services';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Container} from '../general/container/container';
import {getImage, getLocalImage, sleep} from '../../services/utilities-service';
import {firstValueFrom} from 'rxjs';
import {ValorationsService} from '../../services/valorations-service';
import {ModalService} from '../../services/modal-service';
import {Loader} from '../general/loader/loader';
import {Filters} from '../filters/filters';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Card} from '../general/card/card';

@Component({
  selector: 'app-index',
  imports: [
    NgForOf,
    FormsModule,
    Container,
    NgIf,
    Filters,
    MatFormField,
    MatInput,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    NgStyle,
    Card,
    NgClass
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
  standalone: true,
  styles: [`
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
  `]
})
export class Index implements OnInit {
  games: any[] = [];
  search = '';
  page = 1;
  limit = 27;

  isOpen: boolean = false
  drawerMode: 'side' | 'over' = 'side';
  isPhone: boolean = false;

  constructor(private gamesService: GamesServices, private readonly router: Router, private readonly valorationService: ValorationsService, private readonly modalService: ModalService, private breakpointObserver: BreakpointObserver) {
  }

  async ngOnInit() {
    await this.searchFunc({},true)
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.drawerMode = 'over';  // Móvil: drawer encima
          this.isOpen = false;        // Cerrado por defecto en móvil
          this.isPhone = true;
        } else {
          this.drawerMode = 'side';  // Escritorio: drawer al costado
          this.isOpen = true;         // Abierto por defecto en escritorio
          this.isPhone = false;
        }
      });

  }

  openDrawer(){
    this.isOpen = !this.isOpen;
  }


  async paginator(type: string) {
    if (type === 'next') {
      this.page = this.page + 1
      await this.searchFunc()
    } else if (type === 'prev') {
      if (this.page > 1) {
        this.page = this.page - 1
        await this.searchFunc()
      }

    }
  }


  async searchFunc(filters:{
    genres?: number[];
    platforms?: number[];
    minRating?: number;
    maxRating?: number;
    sortBy?: string,
    sortOrder?: string,
    year?: number;
    search?: string
  } = {}, isReset: boolean = false) {
    if (isReset) {
      this.page = 1
    }

    try {
      this.modalService.open(Loader, {}, {text: 'Loading...'});
      if(this.isPhone){
        this.gamesService.searchGames(filters.search || '', filters, this.page, this.limit).subscribe({
          next: (games) => this.games = games,
          error: (err) => console.error(err)
        });
      }
      else{
        this.gamesService.searchGames(this.search, filters, this.page, this.limit).subscribe({
          next: (games) => this.games = games,
          error: (err) => console.error(err)
        });
      }

    }
    catch (e){
      console.log(e)
    }
    finally {
      await sleep(2000)
      this.modalService.close()
    }




  }

  onDrawerClosed() {
    this.isOpen = false;
  }


  details(id: string) {
    this.router.navigate(['details', id]);
  }


  protected readonly getImage = getImage;
  protected readonly getLocalImage = getLocalImage;
}
