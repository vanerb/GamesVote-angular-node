import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Container } from '../general/container/container';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Container, TextFieldModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  standalone: true,
})
export class Contact {
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      cognames: ['', [Validators.required]],
      message: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  sendEmail(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('MAIL ENVIADO');
    console.log(this.form.value);
  }
}
