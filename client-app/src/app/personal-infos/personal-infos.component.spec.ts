import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfosComponent } from './personal-infos.component';

describe('PersonalInfosComponent', () => {
  let component: PersonalInfosComponent;
  let fixture: ComponentFixture<PersonalInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInfosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
