import {Component, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Container} from '../general/container/container';
import {AuthService} from '../../services/auth-service';
import {Images} from '../../interfaces/images';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {cleanUrlImage} from '../../services/utilities-service';
import {WarningModal} from '../general/warning-modal/warning-modal';
import {ModalService} from '../../services/modal-service';
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    Container,
    NgIf,
    RouterLink,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true
})
export class Profile implements OnInit {

  formProfile!: FormGroup;
  formPassword!: FormGroup;

  user = signal<User | null>(null);

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage = false;

  previewCoverImage = signal<string>('');

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private readonly modalService: ModalService
  ) {

    this.formProfile = this.fb.group({
      name: ['', [Validators.required]],
      cognames: ['', [Validators.required]],
      tlf: ['', [Validators.required]],
      profileImage: [null],
    });

    this.formPassword = this.fb.group({
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    try {

      const user = await firstValueFrom(
        this.authService.getUserByToken()
      );

      if (!user) {
        return;
      }

      this.user.set(user);

      this.formProfile.patchValue({
        name: user.name,
        cognames: user.cognames,
        tlf: user.tlf
      });

      if (user.Images?.length > 0) {
        this.previewCoverImage.set(
          'http://localhost:3000/' +
          cleanUrlImage(user.Images[0].url)
        );
      }

    } catch (e) {
      console.log(e);
    }
  }


  async onImageChange(event: Event) {

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

      this.previewCoverImage.set(
        reader.result as string
      );

    };

    reader.readAsDataURL(file);
  }


  updatePassword() {

    const password = this.formPassword.get('password')?.value;
    const repeatPassword = this.formPassword.get('repeatPassword')?.value;

    if (password === '' || repeatPassword === '') {

      this.modalService.open(
        WarningModal,
        {
          width: '60vh',
        },
        {
          props: {
            title: 'Error',
            message: 'Password fields cannot be left empty.',
            type: 'info'
          }
        }
      ).catch(() => {
        this.modalService.close();
      });

      return;
    }

    if (password !== repeatPassword) {

      this.modalService.open(
        WarningModal,
        {
          width: '60vh',
        },
        {
          props: {
            title: 'Error',
            message: 'The passwords do not match, please check.',
            type: 'info'
          }
        }
      ).catch(() => {
        this.modalService.close();
      });

      return;
    }

    const formData = new FormData();

    formData.append('password', password);

    this.authService.update(formData).subscribe({
      next: async () => {
        // Actualización correcta
      },
      error: (err) => {
        console.error('Error en actualización de contraseña:', err);
      }
    });
  }


  updateProfile() {

    if (!this.formProfile.valid) {

      this.modalService.open(
        WarningModal,
        {
          width: '60vh',
        },
        {
          props: {
            title: 'Error',
            message: 'You need to complete all the fields.',
            type: 'info'
          }
        }
      ).catch(() => {
        this.modalService.close();
      });

      return;
    }

    const formData = new FormData();

    formData.append(
      'name',
      this.formProfile.get('name')?.value
    );

    formData.append(
      'cognames',
      this.formProfile.get('cognames')?.value
    );

    formData.append(
      'tlf',
      this.formProfile.get('tlf')?.value
    );

    if (this.selectedImagesCover.length > 0) {

      formData.append(
        'profileImage',
        this.selectedImagesCover[0],
        this.selectedImagesCover[0].name
      );
    }

    this.authService.update(formData).subscribe({
      next: async () => {

        // Si el backend devuelve el usuario actualizado,
        // puedes actualizar el signal aquí.
        const updatedUser = await firstValueFrom(
          this.authService.getUserByToken()
        );

        if (updatedUser) {
          this.user.set(updatedUser);
        }

      },
      error: (err) => {
        console.error('Error en actualización de perfil:', err);
      }
    });
  }
}