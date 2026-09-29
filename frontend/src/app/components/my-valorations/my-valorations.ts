import { Component, OnInit, signal } from '@angular/core';
import { GamesServices } from '../../services/games-services';
import { Router } from '@angular/router';
import { ValorationsService } from '../../services/valorations-service';
import { ModalService } from '../../services/modal-service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from '../general/card/card';
import { FormsModule } from '@angular/forms';
import { Container } from '../general/container/container';
import { Valoration } from '../../interfaces/valoration';
import { Loader } from '../general/loader/loader';
import { sleep } from '../../services/utilities-service';

@Component({
  selector: 'app-my-valorations',
  imports: [NgForOf, NgIf, NgClass, RouterLink, Card, FormsModule, Container],
  templateUrl: './my-valorations.html',
  styleUrl: './my-valorations.css',
  standalone: true,
})
export class MyValorations implements OnInit {
  gamesRated = signal<Valoration[]>([]);

  constructor(
    private gamesService: GamesServices,
    private readonly router: Router,
    private readonly valorationService: ValorationsService,
    private readonly modalService: ModalService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  async ngOnInit() {
    await this.searchFunc();
  }

  async searchFunc() {
    try {
      this.modalService.open(
        Loader,
        {},
        {
          text: 'Loading...',
        },
      );

      this.valorationService.getMyValorationsByUserId().subscribe({
        next: (gamesRated: Valoration[]) => {
          this.gamesRated.set(gamesRated);
        },

        error: (err) => {
          console.error(err);
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      await sleep(1000);

      this.modalService.close();
    }
  }

  details(id?: number) {
    this.router.navigate(['details', id]);
  }
}
