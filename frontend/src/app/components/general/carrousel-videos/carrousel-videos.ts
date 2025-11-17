import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-carrousel-videos',
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './carrousel-videos.html',
  styleUrl: './carrousel-videos.css',
  standalone: true
})
export class CarrouselVideos implements OnInit{

  @Input() videos: any[] = [];
  currentIndex = 0;
  visibleSlides = 2; // Número de videos visibles a la vez

  constructor(private sanitizer: DomSanitizer,private breakpointObserver: BreakpointObserver) {}

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.videos.length - this.visibleSlides) {
      this.currentIndex++;
    }
  }

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

  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
}
