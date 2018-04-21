import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class SimpleContentService {

  constructor(private http: HttpClient) { }

  getSimpleContentAPi(url) {
    return this.http.get(url);
  }

}
