import { Component, OnInit } from '@angular/core';
import {ProfileService} from './profile.service';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import {AuthServiceService} from '../auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileToUpload: File = null;
  profileInfo: any;
  avatarUrl: any = 'https://placehold.it/235x235';

  constructor(private profileService: ProfileService,
              private spinner: NgxSpinnerService,
              private authService: AuthServiceService) { }

  ngOnInit() {
   this.getProfileInformation();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('image this.fileToUpload --', this.fileToUpload);
  }

  uploadFileToActivity() {
    this.spinner.show();
    const imageUploadApiUrl = environment.apidocs + 'v1/API/ProfileImage/Upload/' + this.authService.decodeJwtToken()['custom:UserId'];
    this.profileService.postFile(this.fileToUpload, imageUploadApiUrl).subscribe(data => {
        // do something, if upload success
        console.log('image data--', data);
        // this.spinner.hide();
        this.getProfileInformation();
      }, error => {
        console.log(error);
      });
  }

  getProfileInformation() {
    this.spinner.show();
    const profileInfoApiUrl = environment.apidocs + 'v1/API/user';
    this.profileService.getProfileAPi(profileInfoApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.profileInfo = data;
        this.avatarUrl = data['Avatar'] || 'http://placehold.it/235x235';
        console.log('profileInfo data--', data);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

}
