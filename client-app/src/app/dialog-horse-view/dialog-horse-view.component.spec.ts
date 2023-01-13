import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHorseViewComponent } from './dialog-horse-view.component';

describe('DialogHorseViewComponent', () => {
  let component: DialogHorseViewComponent;
  let fixture: ComponentFixture<DialogHorseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHorseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHorseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
