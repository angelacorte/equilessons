import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNotLoggedComponent } from './navbar-not-logged.component';

describe('NavbarNotLoggedComponent', () => {
  let component: NavbarNotLoggedComponent;
  let fixture: ComponentFixture<NavbarNotLoggedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarNotLoggedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarNotLoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
