import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getImage, getLocalImage} from "../../../services/utilities-service";
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    NgStyle,
    NgForOf,
    NgIf
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
  standalone: true
})
export class Card {
  @Input() game!: any


  protected readonly getLocalImage = getLocalImage;
  protected readonly getImage = getImage;
}
