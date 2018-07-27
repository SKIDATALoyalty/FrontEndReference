import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MembervalueService {

  constructor(private http: HttpClient) { }

  getMemberBenefitsAPi(url) {
    return this.http.get(url);
  }

  getValueAPi(url) {
    return this.http.get(url);
  }

  getValueHistoryAPi(url) {
    return this.http.get(url);
  }
}
