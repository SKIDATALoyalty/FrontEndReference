import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataType } from './dataType';
import { LoaderService } from './../services/loader.service';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { environment } from '../../environments/environment';

import { AuthServiceService } from '../auth-service.service';
import { LocalizationService } from '../services/localization.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileToUpload: File = null;
  profileInfo: any;
  profileMsg: any;
  profileImageMsg: any;
  avatarUrl: any = 'https://placehold.it/235x235';
  profile: any[] = [];
  listData: any;
  profileForm: FormGroup;
  userID: any;
  portalID: any;
  dataTypes: DataType;
  public responseData1: any;
  public responseData2: any;

  constructor(private profileService: ProfileService,
    private loaderService: LoaderService,
    private authService: AuthServiceService,
    private http: HttpClient,
    private localizationService: LocalizationService) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.getProfileInformation();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.profileImageMsg = '';
  }

  uploadFileToActivity() {
    this.userID = Number(this.authService.decodeJwtToken()['uid']);
    this.portalID = Number(this.authService.decodeJwtToken()['pid']);
    // const imageUploadApiUrl = environment.apidocs + 'v1/API/ProfileImage/Upload/' + this.authService.decodeJwtToken()['uid'];
    const imageUploadApiUrl = `${environment.apiBase}/user/${this.portalID}/v1/avatar?userid=${this.userID}`; // user/56/v1/user/62
    if (this.fileToUpload !== null) {
      this.loaderService.display(true);
      this.profileService.postFile(this.fileToUpload, imageUploadApiUrl).subscribe(data => {
        this.getProfileInformation();
      }, error => {
        console.log(error);
        this.loaderService.display(false);
      });
    } else {
      this.profileImageMsg = this.localizationService.getTranslatedValue('ProfilePage.uploadmsg');
    }
  }


  public requestDataFromMultipleSources(): Observable<any[]> {
    this.userID = Number(this.authService.decodeJwtToken()['uid']);
    this.portalID = Number(this.authService.decodeJwtToken()['pid']);

    const portalProfileData = `${environment.apiBase}/user/${this.portalID}/v1/profileproperty?level=0`;
    const userProfileUrl = `${environment.apiBase}/user/${this.portalID}/v1/user/${this.userID}`; // user/56/v1/user/62
    let response1 = this.http.get(userProfileUrl);
    let response2 = this.http.get(portalProfileData);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }

  getProfileInformation() {
    this.profile = [];

    this.requestDataFromMultipleSources().subscribe(responseList => {
      this.responseData1 = responseList[0]['userProfileProperties'];
      this.responseData2 = responseList[1];
      // console.log('user profile', responseList[0]);
      //console.log('portal profile', this.responseData2);

      const result = this.responseData1.map((a) => {
        const obj2 = this.responseData2.find((b) => a.profilePropertyId === b.profilePropertyId);
        if (obj2) {
          Object.assign(a, obj2);
        }
        return a;
      });
      // console.log(result);

      // console.log('profileInfo data merge--', result);
      for (const value of result) {
        if (value['userProfilePropertyId'] !== 0) {

          const temp: string = value['label'];
          const tempName = temp.replace(/\s+/g, '');

          if (value['dataType'] === DataType.String && value['name'] !== 'Photo' && value['name'] !== 'PreferredLocale') {
            this.profile.push({
              label: tempName,
              name: value['name'],
              id: value['profilePropertyId'],
              userProfilePropertyId: value['userProfilePropertyId'],
              val: value['value'],
              type: 'text',
              options: [],
              validation: {
                required: value['required']
              }
            });
          } else if (value['dataType'] === DataType.List && value['name'] !== 'Photo' && value['name'] !== 'PreferredLocale') {
            const listURL = environment.apidocs + 'v1/API/List/GetList?listName=' + tempName;
            this.profileService.getListDataAPi(listURL).subscribe(res => {
              // this.listData = res['Data'];
              this.profile.push({
                label: tempName,
                name: value['name'],
                id: value['profilePropertyId'],
                userProfilePropertyId: value['userProfilePropertyId'],
                val: value['value'],
                type: 'select',
                options: res['Data'],
                validation: {
                  required: value['required']
                }
              });
            },
              error => {
                this.listData = [];
                console.log('error in list api', error);
              });
          } else if (value['dataType'] === DataType.MultiSelect && value['name'] !== 'Photo' && value['name'] !== 'PreferredLocale') {
            const listURL = environment.apidocs + 'v1/API/List/GetList?listName=' + tempName;
            this.profileService.getListDataAPi(listURL).subscribe(res => {
              // this.listData = res['Data'];
              this.profile.push({
                label: tempName,
                name: value['name'],
                id: value['profilePropertyId'],
                userProfilePropertyId: value['userProfilePropertyId'],
                val: value['value'],
                type: 'radio',
                options: res['Data'],
                validation: {
                  required: value['required']
                }
              });
            },
              error => {
                this.listData = [];
                console.log('error in list api', error);
              });
          } else if (value['dataType'] === DataType.Boolean && value['name'] !== 'Photo' && value['name'] !== 'PreferredLocale') {
            this.profile.push({
              label: tempName,
              name: value['name'],
              id: value['profilePropertyId'],
              userProfilePropertyId: value['userProfilePropertyId'],
              val: value['value'],
              type: 'checkbox',
              options: [],
              validation: {
                required: value['required']
              }
            });
          } else if (value['dataType'] === DataType.Date && value['name'] !== 'Photo' && value['name'] !== 'PreferredLocale') {
            this.profile.push({
              label: tempName,
              name: value['name'],
              id: value['profilePropertyId'],
              userProfilePropertyId: value['userProfilePropertyId'],
              val: value['value'],
              type: 'date',
              options: [],
              validation: {
                required: value['required']
              }
            });
          } else if (value['name'] === 'Photo') {
            this.avatarUrl = this.validURL(value['value']) ? value['value'] + '?v=' + Date.now() : 'http://placehold.it/235x235';
            this.profileService.setImageUrl(this.avatarUrl);
          } else if (value['name'] === 'PreferredLocale') {
            // locale info
          }
        }
      }
      // console.log('profileInfo data after parse--', this.profile);

      // setup the profileForm
      setTimeout(() => {
        const formGroup = {};
        for (const prop of this.profile) {
          formGroup[prop['label']] = new FormControl(prop['val'] || '', this.mapValidators(prop['validation']));
        }
        this.profileForm = new FormGroup(formGroup);
        // console.log('profilform', this.profileForm);
      }, 500);
      this.loaderService.display(false);
    });
  }

  private validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }
    return formValidators;
  }

  getListData(name): any[] {
    const listURL = environment.apidocs + 'v1/API/List/GetList?listName=' + name;
    this.profileService.getListDataAPi(listURL).subscribe(data => {
      this.listData = data['Data'];
      // console.log('success in list api', data);
    },
      error => {
        this.listData = [];
        console.log('error in list api', error);
      });
    // console.log('data list api',  this.listData);
    return this.listData;
  }

  getDirtyValues(cg) {
    let dirtyValues = {};  // initialize empty object
    Object.keys(cg.controls).forEach((c) => {

      let currentControl = cg.get(c);

      if (currentControl.dirty) {
        if (currentControl.controls) {//check for nested controlGroups
          dirtyValues[c] = this.getDirtyValues(currentControl);  //recursion for nested controlGroups
        } else {
          dirtyValues[c] = currentControl.value;  //simple control
        }
      }

    });
    return dirtyValues;
  }

  onSubmit(form) {
    const dirtyForm = this.getDirtyValues(form);
    this.userID = Number(this.authService.decodeJwtToken()['uid']);
    this.portalID = Number(this.authService.decodeJwtToken()['pid']);
    const userProfileUpdateApiUrl = `${environment.apiBase}/user/${this.portalID}/v1/userprofileproperty`; // user/56/v1/userprofileproperty
    const ProfileProperties = [];

    // console.log('profile form', form);
    for (const [key, value] of Object.entries(dirtyForm)) {

      for (const iterator of this.responseData1) {
        if (iterator.label === key && key !== 'Photo' && key !== 'PreferredLocale' && iterator.userProfilePropertyId !== 0) {
          const tempObj = {
            'userProfilePropertyId': iterator.userProfilePropertyId,
            'userId': this.userID,
            'profilePropertyId': iterator.profilePropertyId,
            'value': value,
            'profilePropertyName': iterator.profilePropertyName,
            'profilePropertyLabel': iterator.profilePropertyLabel,
            'ordinal': iterator.ordinal
          };
          ProfileProperties.push(tempObj);
          break;
        }
      }

    }
    // console.log('ProfileProperties', ProfileProperties);
    this.localizationService.updateUserProfile(userProfileUpdateApiUrl, ProfileProperties).subscribe(data => {
      // console.log('profile updated successfully', data);
      this.profileMsg = 'Profile information updated successfully';
      setTimeout(() => {
        this.profileMsg = '';
      }, 3000);
    },
      error => {
        this.loaderService.display(false);
        console.log('error inprofile update', error);
      });
  }

}
