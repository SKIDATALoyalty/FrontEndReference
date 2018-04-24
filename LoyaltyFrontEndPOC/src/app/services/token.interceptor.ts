import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {AuthServiceService} from '../auth-service.service';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthServiceService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('id_token');

    if (authToken === null) {
      request = request.clone({
        setHeaders: {
          // This is where you can use your various tokens
          'Accept': 'application/json',
          'x-api-key': environment.apiKey
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          // This is where you can use your various tokens
          'Accept': 'application/json',
           Authorization: authToken,
          'x-api-key': environment.apiKey
        }
      });
    }

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        // console.log('res details:', event);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          console.log('403 error details:', err);
        } else if (err.status === 401) {
          console.log('401 error details:', err);
          this.authService.logout();
        } else if (err.status === 419) {
          console.log('419 error details:', err);
          this.authService.logout();
        }
      }
    });
  }
}
