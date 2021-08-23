import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {HomeComponent} from "./home/home.component";
import {ProfileComponent} from "./profile/profile.component";
import { ClubRegistrationComponent } from './club-registration/club-registration.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path:`login`, component: LoginComponent},
  {path: `signup`, component: SignupComponent}, //es: profile/:id -> profile details
  {path: 'profile', component: ProfileComponent},
  {path: 'newClub', component: ClubRegistrationComponent},
  {path: `**`, component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
