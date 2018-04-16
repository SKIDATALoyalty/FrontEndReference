import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {RegistrationComponent} from './registration/registration.component';
import {ProductComponent} from './product/product.component';
import {PointActivityComponent} from './point-activity/point-activity.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {FaqComponent} from './faq/faq.component';
import {AuthGuardGuard} from '../app/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuardGuard] },
  { path: 'points', component: PointActivityComponent, canActivate: [AuthGuardGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuardGuard] },
  { path: 'pagenotfound', component: PageNotFoundComponent, canActivate: [AuthGuardGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuardGuard]},
  { path: 'pagenotfound', component: PageNotFoundComponent },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
