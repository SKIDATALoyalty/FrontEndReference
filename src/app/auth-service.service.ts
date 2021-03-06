
import { timer as observableTimer, BehaviorSubject, Observable, Subscription, Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthServiceService {
  hasAdminRole = false;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenAvailableOrExpired());
  private admintUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenHasAdminRole());

  private _timeoutSeconds = 10;
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  public timeoutExpired: Subject<number> = new Subject<number>();

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private loaderService: LoaderService
  ) {
    this.timeoutExpired.subscribe(n => {
      console.log('timeoutExpired subject next.. ' + n.toString());
    });
  }

  public startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this._timeoutSeconds = parseInt(localStorage.getItem('expires_in'), 10);
    this.timer = observableTimer(this._timeoutSeconds * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  private timerComplete(n: number) {
    console.log('timer complete log', n);
    if (n === 0) {
      this.stopTimer();
      this.logout();
    }
  }

  public stopTimer() {
    this.timerSubscription.unsubscribe();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isAdminUser() {
    return this.admintUser.asObservable();
  }

  public tokenHasAdminRole(): boolean {
    const hasGroups = this.decodeJwtToken();
    if (hasGroups !== null) {
      const availableGroups = hasGroups['rol'];
      if (availableGroups !== undefined) {
        // console.log('grps data in auth', availableGroups);
        for (const value of availableGroups) {
          if (value === 'SuperUser' || value === 'Admin') {
            this.hasAdminRole = true;
            break;
          }
        }
        if (this.hasAdminRole) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public tokenAvailableOrExpired(): boolean {
    return !!localStorage.getItem('access_token'); // && !this.jwtHelper.isTokenExpired(localStorage.getItem('access_token'));
  }

  isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(localStorage.getItem('access_token'));
  }

  login() {
    this.loggedIn.next(this.tokenAvailableOrExpired());
    this.router.navigate(['/home']);
  }

  getTokenExpirationDate(): Date {
    const decoded = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    if (decoded === null) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getToken(): string {
    return localStorage.getItem('access_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('timer');
    localStorage.removeItem('tokenExpiration');
    this.loggedIn.next(this.tokenAvailableOrExpired());
    const logoutUrl = environment.apiUrl.replace('login', 'logout');
    const generateAuthUrl = logoutUrl + environment.portalId + '?client_id=' + environment.clientId + '&redirect_uri=' + environment.redirectUrl;
    window.location.href = generateAuthUrl;
  }

  unAuthorizedPage(data: boolean) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('timer');
    this.loggedIn.next(this.tokenAvailableOrExpired());
    if (data) {
      this.router.navigate(['/pagenotfound', { admin: data }]);
    } else {
      this.router.navigate(['/pagenotfound']);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);     // Check whether the token is expired and return true or false
  }

  decodeJwtToken() {
    return this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
  }

  isTokExpired(source) {
    const tmpDateConv = Number(source);
    const today = new Date();
    const src: Date = new Date(tmpDateConv);
    return src > today; // true or false
  }

  getAcessToken() {
    const generateAuthUrl = environment.apiUrl + environment.portalId + '?client_id=' + environment.clientId + '&redirect_uri=' + environment.redirectUrl + environment.responseType;
    this.loaderService.display(false);
    window.location.href = generateAuthUrl;
  }

}
