import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubRegistrationComponent } from './club-registration.component';

describe('ClubRegistrationComponent', () => {
  let component: ClubRegistrationComponent;
  let fixture: ComponentFixture<ClubRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
