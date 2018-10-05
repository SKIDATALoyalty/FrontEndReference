import { LoaderService } from './../services/loader.service';
import { Component, OnInit } from '@angular/core';
import {ProfileService} from './profile.service';
import {environment} from '../../environments/environment';

import {AuthServiceService} from '../auth-service.service';
import {LocalizationService} from '../services/localization.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


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

  constructor(private profileService: ProfileService,
              private loaderService: LoaderService,
              private authService: AuthServiceService,
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
    const imageUploadApiUrl = environment.apidocs + 'v1/API/ProfileImage/Upload/' + this.authService.decodeJwtToken()['uid'];
    if (this.fileToUpload !== null) {
      this.loaderService.display(true);
      this.profileService.postFile(this.fileToUpload, imageUploadApiUrl).subscribe(data => {
        this.getProfileInformation();
      }, error => {
        console.log(error);
        this.loaderService.display(false);
      });
    } else {
      this.profileImageMsg =  this.localizationService.getTranslatedValue('ProfilePage.uploadmsg');
    }
  }

  getProfileInformation() {
    this.profile = [];
    const profileInfoApiUrl = environment.apidocs + 'v1/API/user';
    this.profileService.getProfileAPi(profileInfoApiUrl).subscribe(
      data => {
        this.profileInfo = data;
        this.avatarUrl = data['Avatar'] + '?v=' + Date.now() || 'http://placehold.it/235x235';
        this.profileService.setImageUrl(this.avatarUrl);
        // console.log('profileInfo data--', data);
        for (const value of data['ProfileProperties']) {
          const temp: string = value['PropertyName'];
          const tempName = temp.replace(/\s+/g, '');

          if (value['DataType'] === 'DataType:Text') {
            this.profile.push({
              label: tempName,
              name: temp,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'text',
              validation: {
                required: value['Required']
              }
            });
          } else if (value['DataType'] === 'DataType:Country' || value['DataType'] === 'DataType:List') {
            const listURL = environment.apidocs + 'v1/API/List/GetList?listName=' + tempName;
            this.profileService.getListDataAPi(listURL).subscribe(res => {
              // this.listData = res['Data'];
              this.profile.push({
                label: tempName,
                name: temp,
                id: value['PropertyDefinitionId'],
                val: value['PropertyValue'],
                type: 'select',
                options:  res['Data'],
                validation: {
                  required: value['Required']
                }
              });
            },
            error => {
              this.listData = [];
              console.log('error in list api', error);
            });
          } else if (value['DataType'] === 'DataType:Radio') {
            const listURL = environment.apidocs + 'v1/API/List/GetList?listName=' + tempName;
            this.profileService.getListDataAPi(listURL).subscribe(res => {
              // this.listData = res['Data'];
              this.profile.push({
                label: tempName,
                name: temp,
                id: value['PropertyDefinitionId'],
                val: value['PropertyValue'],
                type: 'radio',
                options:  res['Data'],
                validation: {
                  required: value['Required']
                }
              });
            },
            error => {
              this.listData = [];
              console.log('error in list api', error);
            });
          } else if (value['DataType'] === 'DataType:Checkbox' || value['DataType'] === 'DataType:Checkbox ') {
            this.profile.push({
              label: tempName,
              name: temp,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'checkbox',
              validation: {
                required: value['Required']
              }
            });
          } else if (value['DataType'] === 'DataType:Date') {
            this.profile.push({
              label: tempName,
              name: temp,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'date',
              validation: {
                required: value['Required']
              }
            });
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
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
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

  onSubmit(form) {
    const userProfileUpdateApiUrl = environment.apidocs + 'v1/API/user/' + this.authService.decodeJwtToken()['uid'] + '/properties';
    const propObj = {
      'UserID': Number(this.authService.decodeJwtToken()['uid']),
      'PortalID': Number(this.authService.decodeJwtToken()['pid']),
      'ProfileProperties': []
    };
    // console.log('profile form', form);
    for (const [key, value] of Object.entries(form)) {
      const tempObj = {
        'PropertyName': key,
        'PropertyValue': value
      };
      propObj.ProfileProperties.push(tempObj);
    }
    // console.log('profile update obj', propObj);
    this.localizationService.updateUserPreferences(userProfileUpdateApiUrl, propObj).subscribe(data => {
      // console.log('profile updated successfully', data);
      this.profileMsg =  'Profile information updated successfully';
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
