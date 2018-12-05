import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Ng2OdometerModule } from 'ng2-odometer';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { LoaderService } from './services/loader.service';
import { LoginRedirectGuard } from './login-redirect.guard';
import { AuthServiceService } from './auth-service.service';
import { TokenInterceptor } from './services/token.interceptor';
import {PointsService} from './point-activity/points.service';
import {SimpleContentService} from './faq/simple-content.service';
import {ProductService} from './product/product.service';
import {ProfileService} from './profile/profile.service';
import {BadgeService} from './badge/badge.service';
import {LeaderboardService} from './leaderboard/leaderboard.service';
import {LocalizationService} from './services/localization.service';
import { MembervalueService } from './member-value/membervalue.service';
import { OrderCheckoutService } from './order-checkout/order-checkout.service';
import { AppUtilityService } from './shared/app-utility.service';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import './rxjs-operators';
import { ProfileComponent } from './profile/profile.component';
import { BadgeComponent } from './badge/badge.component';
import { BenefitsComponent } from './member-value/benefits/benefits.component';
import { MemberValueComponent } from './member-value/member-value.component';
import { LoadedValueComponent } from './member-value/loaded-value/loaded-value.component';
import { StoredValueComponent } from './member-value/stored-value/stored-value.component';
import { OrderCheckoutComponent } from './order-checkout/order-checkout.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CountdownTimerComponent } from './shared/countdown-timer.component';
import { EventsComponent } from './events/events.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

// required for AOT compilation
// library - 'https://github.com/ngx-translate'
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/resources_' , '.json');
  // return new TranslateHttpLoader(http);
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
    BadgeComponent,
    BenefitsComponent,
    MemberValueComponent,
    LoadedValueComponent,
    StoredValueComponent,
    OrderCheckoutComponent,
    CountdownTimerComponent,
    EventsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [],
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
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    Ng2OdometerModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
    LocalizationService,
    MembervalueService,
    OrderCheckoutService,
    LoaderService,
    AppUtilityService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
