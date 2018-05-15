import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { Router } from '@angular/router';
import {AuthServiceService} from './auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from 'rxjs/Subscription';
import {TranslateService } from '@ngx-translate/core';
import {LocalizationService} from './services/localization.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  private _timerSubscription: Subscription;
  public _counter = 0;
  private _timer: Observable<number>;
  private _idleTimerSubscription: Subscription;
  copyRight = new Date().getFullYear();
  userDefaultlang: any;

  constructor(private authService: AuthServiceService,
              private router: Router,
              private jwtHelper: JwtHelperService,
              private spinner: NgxSpinnerService,
              private changeRef: ChangeDetectorRef,
              public translate: TranslateService,
              private localizationService: LocalizationService) {
                const defaultLang = navigator.language;
                translate.setDefaultLang(defaultLang);
              }

  public startCounter() {
    if (this._timerSubscription) {
        this._timerSubscription.unsubscribe();
    }

    this._counter = 0;
    this._timer = Observable.timer(1000, 1000);
    this._timerSubscription = this._timer.subscribe(n => {
        this._counter++;
        if (this.authService.getToken() !== null) {
          const time_to_login =  parseInt(localStorage.getItem('expires_in'), 10) - 1 ;
          localStorage.setItem('expires_in', JSON.stringify(time_to_login));
          this.changeRef.markForCheck();
        }
    });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.isLoggedIn.subscribe(status => {
      if (status) {
        this.startCounter();
        this.authService.startTimer();

        this._idleTimerSubscription = this.authService.timeoutExpired.subscribe(
          res => {
            console.log('timer res', res);
            this.stopTimer();
            this.changeRef.markForCheck();
          },
          error => {
            console.log('timer error', error);
            this.stopTimer();
            this.changeRef.markForCheck();
          });

          const defaultLangUrl = environment.apidocs + 'v2/API/Localization/UseLocalization';
          this.localizationService.getUserDefaultLanguage(defaultLangUrl).subscribe(data => {
            // console.log('lang default in app component', data);
            this.userDefaultlang = data;
            if (this.userDefaultlang !== '') {
              this.translate.setDefaultLang(this.userDefaultlang);
            } else {
              this.translate.setDefaultLang(navigator.language);
            }
          },
          error => {
            console.log('error in default lang API', error);
          });

      } else {
        this.spinner.hide();
      }
    });
  }

  public stopTimer() {
    this._timerSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this._idleTimerSubscription.unsubscribe();
    this.spinner.hide();
  }
}
