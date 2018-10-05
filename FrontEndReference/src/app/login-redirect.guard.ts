import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthServiceService} from './auth-service.service';
import { map, take } from 'rxjs/operators';

@Injectable()
export class LoginRedirectGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn
    .pipe(take(1), map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      }));
  }
}
