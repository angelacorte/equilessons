import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseManagementComponent } from './horse-management.component';

describe('HorseManagementComponent', () => {
  let component: HorseManagementComponent;
  let fixture: ComponentFixture<HorseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorseManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
