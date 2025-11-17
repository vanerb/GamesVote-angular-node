import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {getImage} from '../../../services/utilities-service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-carrousel-images',
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './carrousel-images.html',
  styleUrl: './carrousel-images.css',
  standalone: true
})
export class CarrouselImages implements OnInit{
  @Input() images: any[] = [];

  currentIndex = 0;
  visibleSlides = 3;


  constructor(private breakpointObserver: BreakpointObserver) {
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.images.length - this.visibleSlides) {
      this.currentIndex++;
    }
  }


  protected readonly getImage = getImage;

  ngOnInit(): void {

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.visibleSlides = 1
        } else {
          this.visibleSlides = 3
        }
      });
  }
}
