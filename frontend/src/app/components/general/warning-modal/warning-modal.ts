import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {ModalProps} from '../../../interfaces/modal';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [
    MatButton,
    NgIf
  ],
  templateUrl: './warning-modal.html',
  styleUrl: './warning-modal.css'
})
export class WarningModal {

  props: ModalProps = {
    title: '',
    message: '',
    type: 'info'
  };

  confirm!: (result?: any) => void;

  close!: () => void;

}