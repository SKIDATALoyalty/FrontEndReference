import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http: HttpClient) { }

  getApi(url) {
    return this.http.get(url);
  }

  public post<T>(path: string, queryParameters: string[], body: any): Observable<T> {
    return this.http.post<T>(path, body);
  }

}
