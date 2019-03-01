
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { LoaderService } from './loader.service';
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
import {environment} from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthServiceService,
    private loaderService: LoaderService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('access_token');

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
          Authorization: `Bearer ${authToken}`,
          'x-api-key': environment.apiKey
        }
      });
    }

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        // console.log('res details:', event);
      }
    }, (err: any) => {
      this.loaderService.display(false);
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          console.log('403 error details:', err);
        } else if (err.status === 401) {
          console.log('401 error details:', err);
          this.authService.logout();
        } else if (err.status === 419) {
          console.log('419 error details:', err);
          this.authService.logout();
        } else if (err.status === 500) {
          console.log('500 error details:', err);
        } else {
          console.log('unknown error details:', err);
        }
      }
    }), catchError(this.handleError));
  }

  private handleError(error: Response) {
    console.log('Error', error);
    return observableThrowError(error);
  }
}
