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

  form!:FormGroup

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;
  previewCoverImage!: string;

  constructor(private  readonly  authService: AuthService, private router: Router,private fb: FormBuilder, private  cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['',[Validators.required]],
      repeatPassword: ['',[Validators.required]],
      type: ['', [Validators.required]],
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

        // Estos campos no existen en el backend actual, así que los quitamos
        // if (this.existingCoverImage) {
        //   formData.append('existing_profile_photo', this.existingCoverImage.id.toString());
        // }
        // if (this.deletedCoverImage) {
        //   formData.append('deleted_profile_photo', '1');
        // }

        this.authService.register(formData).subscribe({
          next: async () => {
            await this.authService.logout();
          },
          error: (err) => {
            console.error('Error en registro:', err);
          }
        });
      }
    }
  }

    protected readonly getLocalImage = getLocalImage;
}
