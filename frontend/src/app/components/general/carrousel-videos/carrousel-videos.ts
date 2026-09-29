import {Component, Input, OnInit, signal} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Videos} from '../../../interfaces/games';

@Component({
  selector: 'app-carrousel-videos',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './carrousel-videos.html',
  styleUrl: './carrousel-videos.css'
})
export class CarrouselVideos implements OnInit {

  @Input()
  videos: Videos[] = [];

  currentIndex = signal<number>(0);

  visibleSlides = signal<number>(2);


  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly breakpointObserver: BreakpointObserver
  ) {
  }


  prevSlide(): void {

    if (this.currentIndex() > 0) {

      this.currentIndex.update(
        value => value - 1
      );

    }

  }


  nextSlide(): void {

    const maxIndex = Math.max(
      0,
      this.videos.length - this.visibleSlides()
    );


    if (this.currentIndex() < maxIndex) {

      this.currentIndex.update(
        value => value + 1
      );

    }

  }


  ngOnInit(): void {

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {

        if (result.matches) {

          this.visibleSlides.set(1);

        } else {

          this.visibleSlides.set(3);

        }


        // Evita que el índice actual quede fuera de rango
        const maxIndex = Math.max(
          0,
          this.videos.length - this.visibleSlides()
        );


        if (this.currentIndex() > maxIndex) {

          this.currentIndex.set(maxIndex);

        }

      });

  }


  getSafeUrl(videoId: string): SafeResourceUrl {

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );

  }

}