import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Container} from '../general/container/container';
import {AuthService} from '../../services/auth-service';
import {Images} from '../../interfaces/images';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {cleanUrlImage, getImage} from '../../services/utilities-service';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    Container,
    NgIf,
    RouterLink,
    MatFormField,
    MatInput,
    MatInputModule,
    MatButton
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true
})
export class Profile implements OnInit{
  formProfile!: FormGroup
  formPassword!: FormGroup

  user!: any

  selectedImagesCover: File[] = [];
  existingCoverImage: Images | null = null;
  deletedCoverImage: boolean = false;
  previewCoverImage!: string;

  constructor(private readonly authService: AuthService, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef) {
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
    this.user = await firstValueFrom(this.authService.getUserByToken())

    this.formProfile.get('name')?.setValue(this.user.name)
    this.formProfile.get('cognames')?.setValue(this.user.cognames)
    this.formProfile.get('tlf')?.setValue(this.user.tlf)


    this.previewCoverImage = 'http://localhost:3000/'+ cleanUrlImage(this.user.Images[0].url)
  }


  async onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover = [input.files[0]];
      if (this.existingCoverImage) {
        this.deletedCoverImage = true;
        this.existingCoverImage = null;
      }
    }


    const reader = new FileReader();
    reader.onload = () => {
      this.previewCoverImage = reader.result as string;
    };
    reader.readAsDataURL(this.selectedImagesCover[0]);
    this.cd.detectChanges()
  }


  updatePassword() {
    if (this.formPassword.get('password')?.value !== '' && this.formPassword.get('repeatPassword')?.value !== '') {
      if (this.formPassword.get('password')?.value === this.formPassword.get('repeatPassword')?.value) {

        const formData = new FormData();

        formData.append('password', this.formProfile.get('name')?.value);

        this.authService.update(formData).subscribe({
          next: async () => {

          },
          error: (err) => {
            console.error('Error en registro:', err);
          }
        });
      }
    }
  }

  updateProfile() {


    const formData = new FormData();

    formData.append('name', this.formProfile.get('name')?.value);
    formData.append('cognames', this.formProfile.get('cognames')?.value); // <- coincide con backend
    formData.append('tlf', this.formProfile.get('tlf')?.value); // <- coincide con backend


    if (this.selectedImagesCover.length > 0) {
      formData.append('profileImage', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
    }


    this.authService.update(formData).subscribe({
      next: async () => {

      },
      error: (err) => {
        console.error('Error en registro:', err);
      }
    });

  }
}
