import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TranslateService } from '@ngx-translate/core';

@Injectable()
export class LocalizationService {
  translatedKeyValue: any;
  constructor(private http: HttpClient, public translate: TranslateService) { }

  getLocalizationListAPi(url) {
    return this.http.get(url);
  }

  updateUserPreferences(url, data) {
    return this.http.post(url, data);
  }

  updateUserProfile(url, data) {
    return this.http.put(url, data);
  }

  getUserDefaultLanguage(url) {
    return this.http.get(url);
  }

  getTranslatedValue(key): string {
    this.translate.get(key).subscribe(value => {
      this.translatedKeyValue = value;
    },
    error => {
    this.translatedKeyValue = key;
    });
    return this.translatedKeyValue;
  }

}
