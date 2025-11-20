import {Component, OnInit} from '@angular/core';
import {GamesServices} from '../../services/games-services';
import {Router} from '@angular/router';
import {ValorationsService} from '../../services/valorations-service';
import {ModalService} from '../../services/modal-service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgClass, NgForOf} from '@angular/common';
import {Card} from '../general/card/card';
import {FormsModule} from '@angular/forms';
import {Container} from '../general/container/container';
import {Valoration} from '../../interfaces/valoration';

@Component({
  selector: 'app-my-valorations',
  imports: [
    NgForOf,
    NgClass,
    Card,
    FormsModule,
    Container
  ],
  templateUrl: './my-valorations.html',
  styleUrl: './my-valorations.css',
  standalone: true
})
export class MyValorations implements OnInit{
  gamesRated: Valoration[] = [];


  constructor(private gamesService: GamesServices, private readonly router: Router, private readonly valorationService: ValorationsService, private readonly modalService: ModalService, private breakpointObserver: BreakpointObserver) {
  }

  async ngOnInit() {
    await this.searchFunc()


  }





  async searchFunc() {


    this.valorationService.getMyValorationsByUserId().subscribe({
      next: (gamesRated: Valoration[]) => this.gamesRated = gamesRated,
      error: (err) => console.error(err)
    });




  }




  details(id?: number) {
    this.router.navigate(['details', id]);
  }

}
