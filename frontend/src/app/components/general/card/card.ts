import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {getImage, getLocalImage} from '../../../services/utilities-service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {

  @Input()
  game!: any;


  protected readonly getLocalImage = getLocalImage;

  protected readonly getImage = getImage;

}