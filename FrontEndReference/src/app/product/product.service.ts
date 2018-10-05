import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  getAPi(url) {
    return this.http.get(url);
  }

  public post<T>(path: string, queryParameters: string[], body: any): Observable<T> {
    return this.http.post<T>(path, body);
  }

}
