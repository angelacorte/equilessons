import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyHorseComponent } from './dialog-modify-horse.component';

describe('DialogModifyHorseComponent', () => {
  let component: DialogModifyHorseComponent;
  let fixture: ComponentFixture<DialogModifyHorseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModifyHorseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyHorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
