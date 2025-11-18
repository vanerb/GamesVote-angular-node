import { Component } from '@angular/core';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Container} from '../general/container/container';

@Component({
  selector: 'app-contact',
  imports: [MatFormField, MatInput, MatInputModule, MatButton, ReactiveFormsModule, Container],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  standalone: true
})
export class Contact {
  form!: FormGroup


  constructor( private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      cognames: ['', [Validators.required]],
      message: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }


  sendEmail(){
    console.log("MAIL ENVIADO")
  }
}
