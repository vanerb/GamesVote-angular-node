import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselImages } from './carrousel-images';

describe('CarrouselImages', () => {
  let component: CarrouselImages;
  let fixture: ComponentFixture<CarrouselImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrouselImages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
