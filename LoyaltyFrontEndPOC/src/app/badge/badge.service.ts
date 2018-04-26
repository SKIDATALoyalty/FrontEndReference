import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class BadgeService {

  constructor(private http: HttpClient) { }

  getBadgeAPi(url) {
    return this.http.get(url);
  }

}
