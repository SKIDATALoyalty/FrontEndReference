import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

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
import { LoginRedirectGuard } from './login-redirect.guard';
import { AuthServiceService } from './auth-service.service';
import './rxjs-operators';

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
    FaqComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AuthServiceService,
    AuthGuardGuard,
    LoginRedirectGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
