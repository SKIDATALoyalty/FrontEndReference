import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { Router } from '@angular/router';
import {AuthServiceService} from './auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from 'rxjs/Subscription';

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

  constructor(private authService: AuthServiceService,
              private router: Router,
              private jwtHelper: JwtHelperService,
              private spinner: NgxSpinnerService,
              private changeRef: ChangeDetectorRef) { }

  public startCounter() {
    if (this._timerSubscription) {
        this._timerSubscription.unsubscribe();
    }

    this._counter = 0;
    this._timer = Observable.timer(1000, 1000);
    this._timerSubscription = this._timer.subscribe(n => {
        this._counter++;
        // console.log('timer log',  this._counter);
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
      // console.log('logged in status', status);
      // console.log('jwt token', this.authService.decodeJwtToken());
      if (status) {
        this.startCounter();
        this.authService.startTimer();
        // const exp = parseInt(localStorage.getItem('expires_in'), 10);
        // const time_to_login = Date.now() + exp; // one hour
        // localStorage.setItem('timer', JSON.stringify(time_to_login));
        // // console.log('time_to_login', time_to_login);
        // const timer = JSON.parse(localStorage.getItem('timer'));
        // if (timer && (Date.now() > timer)) {
        //   this.authService.logout();
        // }

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
