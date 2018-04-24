import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfileAPi(url) {
    return this.http.get(url);
  }

}
