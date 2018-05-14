import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Ng2OdometerModule } from 'ng2-odometer';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

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
import {SimpleContentService} from './faq/simple-content.service';
import {ProductService} from './product/product.service';
import {ProfileService} from './profile/profile.service';
import {BadgeService} from './badge/badge.service';
import {LeaderboardService} from './leaderboard/leaderboard.service';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap';

import './rxjs-operators';
import { ProfileComponent } from './profile/profile.component';
import { BadgeComponent } from './badge/badge.component';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}

// AoT requires an exported function for factories 'https://github.com/ngx-translate'
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
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
    ProfileComponent,
    BadgeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        skipWhenExpired: true
      }
    }),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    Ng2OdometerModule.forRoot()
  ],
  providers: [
    AuthServiceService,
    PointsService,
    SimpleContentService,
    ProductService,
    ProfileService,
    BadgeService,
    AuthGuardGuard,
    LoginRedirectGuard,
    RoleGuardService,
    LeaderboardService,
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
