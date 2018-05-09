import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfileAPi(url) {
    return this.http.get(url);
  }

  postFile(fileToUpload: File, imageUrl: string) {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    return this.http.post(imageUrl, formData);
  }

}
