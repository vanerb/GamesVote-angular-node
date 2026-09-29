import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {LoginForm, Token} from '../../interfaces/auth';
import {Container} from '../general/container/container';
import {WarningModal} from '../general/warning-modal/warning-modal';
import {ModalService} from '../../services/modal-service';

@Component({
  selector: 'app-login',
  imports: [
    Container,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {

  form: FormGroup;

  isError = signal<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly modalService: ModalService
  ) {

    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }


  login(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.openWarning(
        'Error',
        'You need to complete all the fields.'
      );

      return;
    }

    const login: LoginForm = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    this.authService.login(login).subscribe({

      next: async (token: Token) => {

        this.authService.setToken(token.access_token);
        this.authService.setType(token.type);

        this.isError.set(false);

        await this.router.navigate(['/']);

        window.location.reload();
      },

      error: (err) => {

        console.error(
          'Error al iniciar sesión:',
          err
        );

        this.isError.set(true);

        this.openWarning(
          'Error',
          'The username or password is incorrect'
        );
      }

    });
  }


  private openWarning(
    title: string,
    message: string
  ): void {

    this.modalService.open(
      WarningModal,
      {
        width: '60vh',
      },
      {
        props: {
          title,
          message,
          type: 'info'
        }
      }
    ).catch(() => {
      this.modalService.close();
    });

  }

}