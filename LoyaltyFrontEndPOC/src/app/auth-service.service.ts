import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthServiceService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenAvailable());

  constructor(
    private router: Router
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

}
