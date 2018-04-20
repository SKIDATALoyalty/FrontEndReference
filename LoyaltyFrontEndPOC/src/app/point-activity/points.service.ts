import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class PointsService {

  constructor(private http: HttpClient) { }

  getPointTypes() {
    const pointTypes = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    return this.http.get(pointTypes);
  }

}
