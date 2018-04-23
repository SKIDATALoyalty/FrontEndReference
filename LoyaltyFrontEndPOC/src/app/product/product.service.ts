import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductAPi(url) {
    return this.http.get(url);
  }

}
