import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {environment} from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthServiceService {
  hasAdminRole = false;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenAvailableOrExpired());
  private admintUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenHasAdminRole());

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService
  ) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isAdminUser() {
    return this.admintUser.asObservable();
  }

  public tokenHasAdminRole(): boolean {
    const hasGroups = this.decodeJwtToken();
    if (hasGroups !== null) {
      const availableGroups = hasGroups['cognito:groups'];
      if (availableGroups !== undefined) {
        console.log('grps data in auth', availableGroups);
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
    return !!localStorage.getItem('access_token') && !this.jwtHelper.isTokenExpired(localStorage.getItem('id_token'));
  }

  isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(localStorage.getItem('id_token'));
  }

  login() {
      this.loggedIn.next(this.tokenAvailableOrExpired());
      this.router.navigate(['/home']);
  }

  getTokenExpirationDate(): Date {
    const decoded = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));
    if (decoded === null) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getToken(): string {
    return localStorage.getItem('id_token');
  }

  setToken(token: string): void {
    localStorage.setItem('id_token', token);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    this.loggedIn.next(this.tokenAvailableOrExpired());
    this.router.navigate(['/login']);
  }

  unAuthorizedPage(data: boolean) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    this.loggedIn.next(this.tokenAvailableOrExpired());
    if (data) {
      this.router.navigate(['/pagenotfound', {admin: data}]);
    } else {
      this.router.navigate(['/pagenotfound']);
    }
  }

 isAuthenticated(): boolean {
    const token = localStorage.getItem('id_token');
    return !this.jwtHelper.isTokenExpired(token);     // Check whether the token is expired and return true or false
  }

  decodeJwtToken() {
    return this.jwtHelper.decodeToken(localStorage.getItem('id_token'));
  }

  getTokenUrl() {
    const reqHeader = new HttpHeaders({ 'Accept': 'application/json', 'x-api-key': environment.apiKey });
    return this.http.get(environment.getUrl, { headers: reqHeader });
  }

  getAcessToken(url: string) {
    const generateAuthUrl = url + '?client_id=' + environment.clientId + '&redirect_uri=' + environment.redirectUrl + environment.responseType;
    this.spinner.hide();
    window.location.href = generateAuthUrl;
  }

}
