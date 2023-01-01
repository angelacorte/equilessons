import { ComponentFixture, TestBed } from '@angular/core/testing';
import {DialogUserViewComponent} from "./dialog-user-view.component";


describe('DialogUserViewComponent', () => {
  let component: DialogUserViewComponent;
  let fixture: ComponentFixture<DialogUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUserViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
