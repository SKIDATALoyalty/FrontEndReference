import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class PointsService {

  constructor(private http: HttpClient) { }

  getPointActivityAPi(url) {
    return this.http.get(url);
  }

}
