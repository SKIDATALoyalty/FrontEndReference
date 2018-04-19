import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {environment} from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthServiceService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenAvailableOrExpired());
  private isTokExpired: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isTokenExpired());

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public tokenAvailableOrExpired(): boolean {
    return !!sessionStorage.getItem('access_token') && !this.jwtHelper.isTokenExpired();
  }

  isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired();
  }

  login() {
      this.loggedIn.next(this.tokenAvailableOrExpired());
      this.router.navigate(['/home']);
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('token_type');
    sessionStorage.removeItem('expires_in');
    this.loggedIn.next(this.tokenAvailableOrExpired());
    this.router.navigate(['/login']);
  }

  decodeJwtToken() {
    return this.jwtHelper.decodeToken(sessionStorage.getItem('id_token'));
  }

  getTokenUrl() {
    const reqHeader = new HttpHeaders({ 'Accept': 'application/json', 'x-api-key': environment.apiKey });
    return this.http.get(environment.getUrl, { headers: reqHeader });
  }

  getAcessToken(url: string) {
    const generateAuthUrl = url + '?client_id=' + environment.clientId + '&redirect_uri=' + environment.redirectUrl;
    window.location.href = generateAuthUrl;
  }

}
