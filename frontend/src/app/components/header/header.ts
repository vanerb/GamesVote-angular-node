import {Component, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {getLocalImage} from '../../services/utilities-service';
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

  type = signal<string | false | null>(null);

  previewCoverImage = signal<string>('');

  user = signal<User | null>(null);

  isLogged = signal<boolean>(false);

  isOpen = signal<boolean>(false);

  drawerMode = signal<'side' | 'over'>('side');


  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver
  ) {
  }


  async ngOnInit(): Promise<void> {

    this.isLogged.set(
      this.authService.isLoggedIn()
    );


    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {

        if (result.matches) {

          this.drawerMode.set('over');

          this.isOpen.set(false);

        } else {

          this.drawerMode.set('side');

        }

      });


    const token = this.authService.getToken();

    if (!token) {
      return;
    }


    try {

      const user = await firstValueFrom(
        this.authService.getUserByToken()
      );

      if (!user) {
        return;
      }

      this.user.set(user);


      if (user.Images?.length > 0) {

        this.previewCoverImage.set(
          'http://localhost:3000/' +
          user.Images[0].url
            .replace(/^\/+/, '')
        );

      }

    } catch (error) {

      console.error(
        'Error al obtener el usuario:',
        error
      );

    }

  }


  gotTo(url: string): void {

    this.router.navigate([url]);

  }


  open(): void {

    this.isOpen.update(
      value => !value
    );

  }


  async closeSession(): Promise<void> {

    await this.authService.logout();

    this.isOpen.set(false);

    window.location.reload();

  }


  onDrawerClosed(): void {

    this.isOpen.set(false);

  }


  protected readonly getLocalImage = getLocalImage;

}