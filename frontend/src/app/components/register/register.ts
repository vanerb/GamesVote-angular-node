import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {Container} from '../general/container/container';
import {NgIf} from '@angular/common';
import {Images} from '../../interfaces/images';
import {getLocalImage} from "../../services/utilities-service";
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ModalService} from '../../services/modal-service';
import {WarningModal} from '../general/warning-modal/warning-modal';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Container,
    NgIf,
    MatFormField,
    MatInput,
    MatInputModule,
    MatButton
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {

  form!: FormGroup

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;
  previewCoverImage!: string;

  constructor(private readonly authService: AuthService, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef, private readonly modalService: ModalService) {
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

  async onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover = [input.files[0]]; // reemplaza la anterior
      if (this.existingCoverImage) {
        this.deletedCoverImage = true; // marcar portada existente como borrada
        this.existingCoverImage = null;
      }
    }

    // Generar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewCoverImage = reader.result as string; // base64
    };
    reader.readAsDataURL(this.selectedImagesCover[0]);
    this.cd.detectChanges()
  }


  register() {
    if (this.form.valid) {
      if (this.form.get('password')?.value !== '' && this.form.get('repeatPassword')?.value !== '') {
        if (this.form.get('password')?.value === this.form.get('repeatPassword')?.value) {

          const formData = new FormData();

          formData.append('name', this.form.get('name')?.value);
          formData.append('cognames', this.form.get('subname')?.value); // <- coincide con backend
          formData.append('tlf', this.form.get('phone')?.value); // <- coincide con backend
          formData.append('email', this.form.get('email')?.value);
          formData.append('type', 'user');
          formData.append('password', this.form.get('password')?.value);

          // El backend espera el campo "profileImage"
          if (this.selectedImagesCover.length > 0) {
            formData.append('profileImage', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
          }


          this.authService.register(formData).subscribe({
            next: async () => {
              await this.authService.logout();
            },
            error: (err) => {
              this.modalService.open(WarningModal, {
                  width: '60vh',
                },
                {
                  props: {
                    title: 'Error',
                    message: 'An unexpected error occurred while creating the account. The error is ' + err.error.error,
                    type: 'info'
                  }
                }).then(async (item: FormData) => {
              })
                .catch(() => {
                  this.modalService.close()
                });
            }
          });


        } else {
          this.modalService.open(WarningModal, {
              width: '60vh',
            },
            {
              props: {
                title: 'Error',
                message: 'The passwords do not match, please check.',
                type: 'info'
              }
            }).then(async (item: FormData) => {
          })
            .catch(() => {
              this.modalService.close()
            });
        }
      } else {
        this.modalService.open(WarningModal, {
            width: '60vh',
          },
          {
            props: {
              title: 'Error',
              message: 'Password fields cannot be left empty.',
              type: 'info'
            }
          }).then(async (item: FormData) => {
        })
          .catch(() => {
            this.modalService.close()
          });
      }
    } else {
      this.modalService.open(WarningModal, {
          width: '60vh',
        },
        {
          props: {
            title: 'Error',
            message: 'You need to complete all the fields.',
            type: 'info'
          }
        }).then(async (item: FormData) => {
      })
        .catch(() => {
          this.modalService.close()
        });
    }

  }

  protected readonly getLocalImage = getLocalImage;
}
