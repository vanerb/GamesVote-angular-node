import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselVideos } from './carrousel-videos';

describe('CarrouselVideos', () => {
  let component: CarrouselVideos;
  let fixture: ComponentFixture<CarrouselVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrouselVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
