import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthServiceService } from '../auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class RoleGuardService implements CanActivate {
  hasAdminRole = false;

  constructor(private authService: AuthServiceService, private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAdminUser
      .take(1)
      .map((isAdminUser: boolean) => {
        if (!isAdminUser) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      });
  }
}
