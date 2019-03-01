import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject} from 'rxjs';

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
    const fileName = 'file'; // uncomment if you are using new loyalty 4.0 api's to upload avatar
   // const fileName = 'image'; //uncomment if you are using old apidocs to upload avatar
    formData.append(fileName, fileToUpload, fileToUpload.name);
    return this.http.post(imageUrl, formData);
  }

  getListDataAPi(url) {
    return this.http.get(url);
  }

  setImageUrl(link: any) {
    this.data.next(link);
  }

}
