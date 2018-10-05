import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderCheckoutService {

  constructor(private http: HttpClient) { }

  public get<T>(path: string, queryParameters: string[]): Observable<T> {
    return this.http.get<T>(path);
  }

  public post<T>(path: string, queryParameters: string[], body: any): Observable<T> {
      return this.http.post<T>(path, body);
  }

  public put<T>(path: string, queryParameters: string[], body: any): Observable<T> {
    return this.http.put<T>(path, body);
  }

  public delete<T>(path: string, queryParameters: string[]): Observable<T> {
    return this.http.delete<T>(path);
  }

}
