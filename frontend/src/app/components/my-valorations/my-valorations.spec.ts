import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyValorations } from './my-valorations';

describe('MyValorations', () => {
  let component: MyValorations;
  let fixture: ComponentFixture<MyValorations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyValorations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyValorations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
