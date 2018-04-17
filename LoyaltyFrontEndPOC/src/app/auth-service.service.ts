import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {environment} from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';

@Injectable()
export class AuthServiceService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenAvailable());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  private tokenAvailable(): boolean {
    return !!sessionStorage.getItem('loyaltyAuthToken');
  }

  login() {
      sessionStorage.setItem('loyaltyAuthToken', 'setauthtokenhere');
      this.loggedIn.next(this.tokenAvailable());
      this.router.navigate(['/home']);
  }

  logout() {
    sessionStorage.removeItem('loyaltyAuthToken');
    this.loggedIn.next(this.tokenAvailable());
    this.router.navigate(['/login']);
  }

  getTokenUrl() {
    const reqHeader = new HttpHeaders({ 'Accept': 'application/json', 'x-api-key': environment.apiKey });
    return this.http.get(environment.getUrl, { headers: reqHeader });
  }

  getAcessToken(url: string) {
    // const reqHeader = new HttpHeaders({ 'Accept': 'application/json', 'x-api-key': environment.apiKey });
    // const generateUrl = url + '?client_id=' + environment.apiKey + '&redirect_uri=' + 'http://localhost/lorient' + '&response_type=token';
    const generateUrl = url + '?client_id=' + environment.apiKey + '&redirect_uri=' + environment.redirectUrl + '&response_type=token';
    return this.http.get(generateUrl);
  }

}
