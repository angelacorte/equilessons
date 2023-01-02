import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubLoginComponent } from './club-login.component';

describe('ClubLoginComponent', () => {
  let component: ClubLoginComponent;
  let fixture: ComponentFixture<ClubLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
