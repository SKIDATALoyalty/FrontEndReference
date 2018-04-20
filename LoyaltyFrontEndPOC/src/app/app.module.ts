import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { MenubarComponent } from './menubar/menubar.component';
import { ProductComponent } from './product/product.component';
import { PointActivityComponent } from './point-activity/point-activity.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FaqComponent } from './faq/faq.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { RoleGuardService } from './services/role-guard.service';
import { LoginRedirectGuard } from './login-redirect.guard';
import { AuthServiceService } from './auth-service.service';
import { TokenInterceptor } from './services/token.interceptor';
import {PointsService} from './point-activity/points.service';

import './rxjs-operators';
import { ProfileComponent } from './profile/profile.component';

export function tokenGetter() {
  return sessionStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    MenubarComponent,
    ProductComponent,
    PointActivityComponent,
    LeaderboardComponent,
    PageNotFoundComponent,
    FaqComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        skipWhenExpired: true
      }
    }),
    NgbModule.forRoot(),
    AppRoutingModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthServiceService,
    PointsService,
    AuthGuardGuard,
    LoginRedirectGuard,
    RoleGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
