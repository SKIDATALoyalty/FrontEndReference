import { Component, OnInit } from '@angular/core';
import {ProfileService} from './profile.service';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import {AuthServiceService} from '../auth-service.service';
import {LocalizationService} from '../services/localization.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
              private spinner: NgxSpinnerService,
              private authService: AuthServiceService,
              private localizationService: LocalizationService) { }

  ngOnInit() {
   this.getProfileInformation();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.profileImageMsg = '';
    // console.log('image this.fileToUpload --', this.fileToUpload);
  }

  uploadFileToActivity() {
    const imageUploadApiUrl = environment.apidocs + 'v1/API/ProfileImage/Upload/' + this.authService.decodeJwtToken()['custom:UserId'];
    if (this.fileToUpload !== null) {
      this.spinner.show();
      this.profileService.postFile(this.fileToUpload, imageUploadApiUrl).subscribe(data => {
        // do something, if upload success
        // console.log('image data--', data);
        // this.spinner.hide();
        this.getProfileInformation();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
    } else {
      this.profileImageMsg =  this.localizationService.getTranslatedValue('ProfilePage.uploadmsg');
    }
  }

  getProfileInformation() {
    this.profile = [];
    this.spinner.show();
    const profileInfoApiUrl = environment.apidocs + 'v1/API/user';
    this.profileService.getProfileAPi(profileInfoApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.profileInfo = data;
        this.avatarUrl = data['Avatar'] + '?v=' + Date.now() || 'http://placehold.it/235x235';
        // console.log('profileInfo data--', data);
        for (const value of data['ProfileProperties']) {
          const temp: string = value['PropertyName'];
          const tempName = temp.replace(/\s+/g, '');

          if (value['DataType'] === 'DataType:Text') {
            this.profile.push({
              label: tempName,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'text',
              validation: {
                required: value['PropertyValue']
              }
            });
          } else if (value['DataType'] === 'DataType:Country' || value['DataType'] === 'DataType:List') {
            this.profile.push({
              label: tempName,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'select',
              options:  [], // this.getListData(tempName),
              validation: {
                required: value['PropertyValue']
              }
            });
          } else if (value['DataType'] === 'DataType:Radio') {
            this.profile.push({
              label: tempName,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'radio',
              options: [], // this.getListData(tempName),
              validation: {
                required: value['PropertyValue']
              }
            });
          } else if (value['DataType'] === 'DataType:Checkbox') {
            this.profile.push({
              label: tempName,
              id: value['PropertyDefinitionId'],
              val: value['PropertyValue'],
              type: 'checkbox',
              validation: {
                required: value['PropertyValue']
              }
            });
          }
        }
        // console.log('profileInfo data after parse--', this.profile);

        // setup the profileForm
        const formGroup = {};
        for (const prop of this.profile) {
          // console.log('this.profile[prop[val]]', prop['val']);
          formGroup[prop['label']] = new FormControl(prop['val'] || '', this.mapValidators(prop['validation']));
        }
        // console.log('formGroup', formGroup);
        this.profileForm = new FormGroup(formGroup);
      },
      error => {
        this.spinner.hide();
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
    const userProfileUpdateApiUrl = environment.apidocs + 'v1/API/user/' + this.authService.decodeJwtToken()['custom:UserId'] + '/properties';
    const propObj = {
      'UserID': Number(this.authService.decodeJwtToken()['custom:UserId']),
      'PortalID': Number(this.authService.decodeJwtToken()['custom:PortalId']),
      'ProfileProperties': []
    };

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
      this.spinner.hide();
      console.log('error inprofile update', error);
    });
  }

}
