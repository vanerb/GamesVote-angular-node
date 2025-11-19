import {Component, Input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-warning-modal',
  imports: [
    MatButton,
    NgIf
  ],
  templateUrl: './warning-modal.html',
  styleUrl: './warning-modal.css',
  standalone: true
})
export class WarningModal {

  props: {
    title: string,
    message: string,
    type: string,
  } = {
    title: '',
    message: '',
    type: 'info'
  }

  confirm!: (result?: any) => void;
  close!: () => void;

}
