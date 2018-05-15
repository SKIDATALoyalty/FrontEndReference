import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class LocalizationService {

  constructor(private http: HttpClient) { }

  getLocalizationListAPi(url) {
    return this.http.get(url);
  }

 updateLocalePreferences(url, data) {
    return this.http.post(url, data);
  }

  getUserDefaultLanguage(url) {
    return this.http.get(url);
  }

}
