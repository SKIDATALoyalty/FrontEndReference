import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MembervalueService {

  constructor(private http: HttpClient) { }

  getMemberBenefitsAPi(url) {
    return this.http.get(url);
  }

  getLoadedValueAPi(url) {
    return this.http.get(url);
  }

  getLoadedValueHistoryAPi(url) {
    return this.http.get(url);
  }
}
