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
    const authToken = sessionStorage.getItem('id_token');

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
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          console.log('handle error here');
        }
      }
    });
  }
}
