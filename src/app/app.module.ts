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
import { AddCoachComponent } from './add-coach/add-coach.component';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { DialogUserViewComponent } from './dialog-user-view/dialog-user-view.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {MatPaginatorModule} from "@angular/material/paginator";
import { DialogLessonViewComponent } from './dialog-lesson-view/dialog-lesson-view.component';
import { DialogHorseViewComponent } from './dialog-horse-view/dialog-horse-view.component';
import { DialogModifyLessonViewComponent } from './dialog-modify-lesson-view/dialog-modify-lesson-view.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { HorseManagementComponent } from './horse-management/horse-management.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { PersonalInfosComponent } from './personal-infos/personal-infos.component';
import { LessonHistoryComponent } from './lesson-history/lesson-history.component';
import {MatTooltipModule} from "@angular/material/tooltip";
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
    ClubLoginComponent,
    AddCoachComponent,
    NotAllowedComponent,
    ShowUsersComponent,
    DialogUserViewComponent,
    DialogLessonViewComponent,
    DialogHorseViewComponent,
    DialogModifyLessonViewComponent,
    HorseManagementComponent,
    PersonalInfosComponent,
    LessonHistoryComponent
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
        A11yModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        MatRadioModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTabsModule,
        MatProgressBarModule,
        MatTooltipModule
    ],
  providers: [
    MatDatepickerModule,
    authInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'it'}],
  bootstrap: [AppComponent]
})
export class AppModule { }


