import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable} from 'rxjs/Observable';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ProfileService {

  private data = new BehaviorSubject('');
  imageUrl = this.data.asObservable();

  constructor(private http: HttpClient) { }

  getProfileAPi(url) {
    return this.http.get(url);
  }

  postFile(fileToUpload: File, imageUrl: string) {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    return this.http.post(imageUrl, formData);
  }

  getListDataAPi(url) {
    return this.http.get(url);
  }

  setImageUrl(link: any) {
    this.data.next(link);
  }

}
