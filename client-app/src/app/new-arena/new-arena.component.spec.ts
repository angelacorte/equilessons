import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArenaComponent } from './new-arena.component';

describe('NewArenaComponent', () => {
  let component: NewArenaComponent;
  let fixture: ComponentFixture<NewArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewArenaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
