import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {HomeComponent} from "./home/home.component";
import {ProfileComponent} from "./profile/profile.component";
import { ClubRegistrationComponent } from './club-registration/club-registration.component';
import {HorseRegistrationComponent} from "./horse-registration/horse-registration.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {NewArenaComponent} from "./new-arena/new-arena.component";
import {NewLessonComponent} from "./new-lesson/new-lesson.component";
import {ClubLoginComponent} from "./club-login/club-login.component";
import {AddCoachComponent} from "./add-coach/add-coach.component";
import {NotAllowedComponent} from "./not-allowed/not-allowed.component";
import {ShowUsersComponent} from "./show-users/show-users.component";
import {HorseManagementComponent} from "./horse-management/horse-management.component";
import {LessonHistoryComponent} from "./lesson-history/lesson-history.component";
import {PersonalInfosComponent} from "./personal-infos/personal-infos.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch:'full'},
  {path: 'logged', component: AppComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}, //es: profile/:id -> profile details
  {path: 'profile', component: ProfileComponent},
  {path: 'newClub', component: ClubRegistrationComponent},
  {path: 'horseRegistration', component: HorseRegistrationComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'newArena', component: NewArenaComponent},
  {path: 'newLesson', component: NewLessonComponent},
  {path: 'clubLogin', component: ClubLoginComponent},
  {path: 'addCoach', component: AddCoachComponent},
  {path: 'notAllowed', component: NotAllowedComponent},
  {path: 'showUsers', component:ShowUsersComponent},
  {path: 'showHorses', component:HorseManagementComponent},
  {path: 'lessonHistory', component:LessonHistoryComponent},
  {path: 'personalInfos', component:PersonalInfosComponent},
  {path: 'notifications', component:NotificationsComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
