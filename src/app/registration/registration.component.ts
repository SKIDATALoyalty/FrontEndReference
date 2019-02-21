import { environment } from './../../environments/environment';
import { RegistrationResponse } from './models/RegistrationResponse';
import { RegistrationService } from './registration.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  loginUrlBase: string = environment.apiUrl + environment.portalId;
  loginClientId: string = environment.clientId;
  loginCallback: string = environment.redirectUrl;
  responseType: string = environment.responseType;

  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  errorMessage: string;

  constructor(private registrationService: RegistrationService) { }

  ngOnInit() {
  }

  getLoginUrl() {
    let url: string = this.loginUrlBase;

    url += '?' + 'client_id=' + this.loginClientId;
    url += '&' + 'redirect_uri=' + this.loginCallback;
    url += '&' + this.responseType;

    return url;
  }

  registerUser() {
    this.registrationService.registerUser(this.userName, this.email, this.firstName, this.lastName)
      .subscribe(
        (response: RegistrationResponse) => {
          const oAuthRegistrationUrl = this.getLoginUrl() + '&registration_token=' + response.registrationToken;

          window.location.href = oAuthRegistrationUrl;
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error['message'];
        }
      );
  }

}
