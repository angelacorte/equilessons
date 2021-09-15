import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {AppRoutingModule} from "./app-routing.module";

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ClubRegistrationComponent } from './club-registration/club-registration.component';
import { HorseRegistrationComponent } from './horse-registration/horse-registration.component';

import {CommonModule, registerLocaleData} from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {FullCalendarModule} from "@fullcalendar/angular";
import { NewLessonComponent } from './new-lesson/new-lesson.component';
import { NewArenaComponent } from './new-arena/new-arena.component';
import {MatTableModule} from "@angular/material/table";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlider, MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SchedulerModule} from "angular-calendar-scheduler";
import {CalendarComponent} from "./calendar/calendar.component";
import * as moment from 'moment';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import localeIt from '@angular/common/locales/it';
import { ClubLoginComponent } from './club-login/club-login.component';
import {A11yModule} from "@angular/cdk/a11y";
registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    HomeComponent,
    ProfileComponent,
    ClubRegistrationComponent,
    HorseRegistrationComponent,
    CalendarComponent,
    NewLessonComponent,
    NewArenaComponent,
    ClubLoginComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        NgbModalModule,
        CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
        SchedulerModule.forRoot({locale: localeIt.toLocaleString(), headerDateFormat: 'daysRange'}),
        FullCalendarModule,
        MatTableModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        A11yModule
    ],
  providers: [
    authInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'it'}],
  bootstrap: [AppComponent]
})
export class AppModule { }


