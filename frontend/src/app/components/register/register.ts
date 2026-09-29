import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { Container } from '../general/container/container';
import { NgIf } from '@angular/common';
import { Images } from '../../interfaces/images';
import { getLocalImage } from '../../services/utilities-service';
import { ModalService } from '../../services/modal-service';
import { WarningModal } from '../general/warning-modal/warning-modal';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Container, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  form!: FormGroup;

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage = false;

  previewCoverImage = signal<string>('');

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private readonly modalService: ModalService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
      profile_photo: [null],
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.selectedImagesCover = [file];

    if (this.existingCoverImage) {
      this.deletedCoverImage = true;
      this.existingCoverImage = null;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.previewCoverImage.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  register(): void {
    if (!this.form.valid) {
      this.openWarning('Error', 'You need to complete all the fields.');

      return;
    }

    const password = this.form.get('password')?.value;
    const repeatPassword = this.form.get('repeatPassword')?.value;

    if (!password || !repeatPassword) {
      this.openWarning('Error', 'Password fields cannot be left empty.');

      return;
    }

    if (password !== repeatPassword) {
      this.openWarning('Error', 'The passwords do not match, please check.');

      return;
    }

    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);

    formData.append('cognames', this.form.get('subname')?.value);

    formData.append('tlf', this.form.get('phone')?.value);

    formData.append('email', this.form.get('email')?.value);

    formData.append('type', 'user');

    formData.append('password', password);

    if (this.selectedImagesCover.length > 0) {
      const image = this.selectedImagesCover[0];

      formData.append('profileImage', image, image.name);
    }

    this.authService.register(formData).subscribe({
      next: async () => {
        await this.authService.logout();
      },

      error: (err) => {
        console.error('Error al crear la cuenta:', err);

        const errorMessage =
          err?.error?.error ?? 'An unexpected error occurred while creating the account.';

        this.openWarning(
          'Error',
          'An unexpected error occurred while creating the account. The error is ' + errorMessage,
        );
      },
    });
  }

  private openWarning(title: string, message: string): void {
    this.modalService
      .open(
        WarningModal,
        {
          width: '60vh',
        },
        {
          props: {
            title,
            message,
            type: 'info',
          },
        },
      )
      .catch(() => {
        this.modalService.close();
      });
  }

  protected readonly getLocalImage = getLocalImage;
}
