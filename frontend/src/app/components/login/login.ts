import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {LoginForm, Token} from '../../interfaces/auth';
import {Container} from '../general/container/container';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {WarningModal} from '../general/warning-modal/warning-modal';
import {ModalService} from '../../services/modal-service';

@Component({
  selector: 'app-login',
  imports: [Container, ReactiveFormsModule, RouterLink, MatFormField, MatInput, MatInputModule, MatButton, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  form: FormGroup
  isError: boolean = false;
  constructor(private readonly authService: AuthService, private fb: FormBuilder, private readonly router: Router, private readonly modalService: ModalService) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  login() {
    const login: LoginForm = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    }

    this.authService.login(login).subscribe({
      next: async (token: Token) => {
        this.authService.setToken(token.access_token);
        this.authService.setType(token.type)
        await this.router.navigate(['/']);
        window.location.reload()
        this.isError = false
      },
      error: (err) => {
        this.modalService.open(WarningModal, {
            width: '60vh',
          },
          {
            props: {
              title: 'Error',
              message: 'The username or password is incorrect',
              type: 'info'
            }
          }).then(async (item: FormData) => {
        })
          .catch(() => {
            this.modalService.close()
          });
      },
    });

  }

}
