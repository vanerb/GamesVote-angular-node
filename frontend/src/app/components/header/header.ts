import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {HeaderItem} from '../../interfaces/header';
import {cleanUrlImage, getLocalImage, sleep} from '../../services/utilities-service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';
import {firstValueFrom} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {User} from '../../interfaces/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButton,
    NgStyle
  ],
  styleUrl: './header.css'
})
export class Header implements OnInit {
  type: string | false | null = null;
  previewCoverImage!: string;

  user!: User

  isLogged: boolean = false;

  isOpen: boolean = false
  drawerMode: 'side' | 'over' = 'side';

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {

  }

  async ngOnInit() {


    this.isLogged = this.authService.isLoggedIn()
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.drawerMode = 'over';
          this.isOpen = false; // se cierra al cambiar a móvil
        } else {
          this.drawerMode = 'side';
        }
      });



    if(this.authService.getToken()){
      this.user = await firstValueFrom(this.authService.getUserByToken()) || null
      this.previewCoverImage = 'http://localhost:3000/' + cleanUrlImage(this.user.Images[0].url)
    }
    else{

    }




  }


  gotTo(url: string) {

    this.router.navigate([url])
  }

  open() {
    this.isOpen = !this.isOpen
  }

  async closeSession() {
    await this.authService.logout()
    window.location.reload();
    this.isOpen = false
  }

  onDrawerClosed() {
    this.isOpen = false;
  }

  protected readonly getLocalImage = getLocalImage;
}
