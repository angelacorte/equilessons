import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseRegistrationComponent } from './horse-registration.component';

describe('HorseRegistrationComponent', () => {
  let component: HorseRegistrationComponent;
  let fixture: ComponentFixture<HorseRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorseRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorseRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
