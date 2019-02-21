import { LoaderService } from './../services/loader.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthServiceService} from '../auth-service.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ProfileService} from '../profile/profile.service';
import {environment} from '../../environments/environment';
import {TranslateService } from '@ngx-translate/core';
import {LocalizationService} from '../services/localization.service';
import {OrderCheckoutService} from '../order-checkout/order-checkout.service';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  closeResult: string;
  settingsForm: FormGroup;
  settingsSuccessMsg: string;
  profileInfo: any;
  avatarUrl: any = 'https://placehold.it/30x30';
  languageList: any[] = [];
  languageSelected = undefined;
  public navbarCollapsed = true;
  tempLangCode: string;
  orderlength = 0;
  public pointsRemaining: any = 0;
  public pointsSpent: any = 0;
  // public observable: Observable<boolean>;
  // private observer: Observer<boolean>;

  constructor(private authService: AuthServiceService,
    private orderCheckoutService: OrderCheckoutService,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private localizationService: LocalizationService) {
      // this.observable = new Observable<boolean>((observer: any) => this.observer = observer).share();
    }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    const authToken = localStorage.getItem('access_token');
    this.settingsForm = new FormGroup({
      settings: new FormGroup({
        redirectUrl: new FormControl('', Validators.required),
        apiKey: new FormControl('', Validators.required),
        clientId: new FormControl('', Validators.required),
        portalId: new FormControl('', Validators.required),
        apiUrl: new FormControl('', Validators.required)
      })
    });

    this.authService.isLoggedIn.subscribe(status => {
      // console.log('logged in status', status);
      if (status) {
        this.loaderService.display(true);
        const profileInfoApiUrl = environment.apidocs + 'v1/API/user';
        this.profileService.getProfileAPi(profileInfoApiUrl).subscribe(
          data => {
            this.loaderService.display(false);
            this.profileInfo = data;
            // console.log('data---', data);
            this.pointsRemaining = data['CurrentPoints']['PointsRemaining'];
            this.pointsSpent = data['CurrentPoints']['PointsSpent'];

            this.avatarUrl = data['Avatar'] + '?v=' + Date.now();
            this.profileService.setImageUrl(this.avatarUrl);
            this.profileService.imageUrl.subscribe(currentData => this.avatarUrl = currentData);
          },
          error => {
            this.loaderService.display(false);
            console.log(error);
          });

          const defaultLangUrl = environment.apidocs + 'v2/API/Localization/UseLocalization';
          this.localizationService.getUserDefaultLanguage(defaultLangUrl).subscribe(data => {
            // console.log('lang default', data);
            if (data !== '') {
              this.languageSelected = data;
            } else {
              this.languageSelected = navigator.language;
            }
          },
          error => {
            this.loaderService.display(false);
            console.log('error in default lang API', error);
          });

        const langApiUrl = environment.apidocs + 'v2/API/Localization/RequestLocales';
        this.localizationService.getLocalizationListAPi(langApiUrl).subscribe(data => {
          let tempObj = {
            'value': undefined,
            'name': 'Select Language'
          };
          this.languageList.push(tempObj);
          for (const [key, value] of Object.entries(data)) {
            // console.log(value);
            tempObj = {
              'value': value,
              'name': key
            };
            this.languageList.push(tempObj);
          }
          // console.log('lang list', this.languageList);
        },
        error => {
          this.loaderService.display(false);
          console.log('lang list', error);
        });

        const params = [];
        const userID =  this.authService.decodeJwtToken()['uid'];
        const currentorderurl = environment.apidocs + 'v2/API/Orders/' + userID + '/Current';
        this.orderCheckoutService.get<any>(currentorderurl, params).subscribe(res => {
          for (let i = 0; i < res.Items.length; i++) {
            this.orderlength += res.Items[i].Quantity;
          }
        },
        error => {
          console.log('error in get current order', error);
        });
      }
    });

  }

  loyaltylogout() {
    this.navbarCollapsed = true;
    this.authService.logout();
  }

  openSettings(content) {
    this.navbarCollapsed = true;
    this.settingsForm = new FormGroup({
      settings: new FormGroup({
        redirectUrl: new FormControl(localStorage.getItem('redirect_url'), Validators.required),
        apiKey: new FormControl(localStorage.getItem('api_key'), Validators.required),
        clientId: new FormControl(localStorage.getItem('client_id'), Validators.required),
        portalId: new FormControl(localStorage.getItem('portal_id'), Validators.required),
        apiUrl: new FormControl(localStorage.getItem('api_url'), Validators.required),
        portalApiDocsUrl: new FormControl(localStorage.getItem('portal_api_docs_url'), Validators.required)
      })
    });

    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmitSaveLocal() {
    this.settingsSuccessMsg = '';
    //  console.log('settings info', this.settingsForm.value.settings);
    localStorage.setItem('redirect_url', this.settingsForm.value.settings.redirectUrl);
    localStorage.setItem('api_key', this.settingsForm.value.settings.apiKey);
    localStorage.setItem('client_id', this.settingsForm.value.settings.clientId);
    localStorage.setItem('portal_id', this.settingsForm.value.settings.portalId);
    localStorage.setItem('api_url', this.settingsForm.value.settings.apiUrl);
    localStorage.setItem('portal_api_docs_url', this.settingsForm.value.settings.portalApiDocsUrl);
    this.settingsSuccessMsg = 'Settings Successfully Saved';
    setTimeout(() => {
      this.settingsSuccessMsg = '';
    }, 3000);
  }

  useLanguage(event) {
    // console.log(event.target.value);
    this.tempLangCode = event.target.value;
    this.translate.use(this.tempLangCode);
    const langApiUrl = environment.apidocs + 'v2/API/UserProfile/UpdateProfileProperty';  // 'v1/API/user/' + this.authService.decodeJwtToken()['uid'] + '/properties';
    const propObj = {
      'UserID': Number(this.authService.decodeJwtToken()['uid']),
      'PropertyName': 'PreferredLocale',
      'PropertyValue': this.tempLangCode
    };

    this.localizationService.updateUserPreferences(langApiUrl, propObj).subscribe(data => {
      console.log('language preferences updated successfully', data);
      this.languageSelected = this.tempLangCode;
      window.location.reload();
    },
    error => {
      this.loaderService.display(false);
      console.log('error in language preferences', error);
    });
  }

}
