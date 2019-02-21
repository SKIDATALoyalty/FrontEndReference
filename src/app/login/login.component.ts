import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import { LoaderService } from './../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  tokenUrl: any;
  tokens: any;
  hasAdminRole = false;
  loginMsg: any;
  constructor(private authService: AuthServiceService,
              private loaderService: LoaderService) {

   }

  ngOnInit() {
    if ( window.location.href.indexOf('access_token') > -1) {
      this.loaderService.display(true);

      this.tokens = this.getUrlParams(window.location.href);
      localStorage.setItem('access_token', this.tokens['access_token']);

      const jwtHelper = new JwtHelperService();

      const expirationDate = jwtHelper.getTokenExpirationDate(this.tokens['access_token']);

      // 10 mins less than expiration.
      const expirationDateEpoch = expirationDate.valueOf() - 600000;
      localStorage.setItem('token_type', this.tokens['response_type']);
      localStorage.setItem('expires_in', this.tokens['expires_in']);
      localStorage.setItem('tokenExpiration', expirationDateEpoch.toString());
      this.loaderService.display(false);
      this.authService.login();

      // admin role condition check
      // const hasGroups = this.authService.decodeJwtToken();
      // const availableGroups = hasGroups['cognito:groups'];

      // if (availableGroups !== undefined && availableGroups.length > 0) {
      //     for (const value of availableGroups) {
      //       if (value === 'SuperUser' || value === 'Admin') {
      //         this.hasAdminRole = true;
      //       }
      //     }
      //     if ( this.hasAdminRole ) {
      //       setTimeout(() => {
      //         this.loaderService.display(false);
      //       }, 1000);
      //       this.authService.unAuthorizedPage(this.hasAdminRole);
      //     } else {
      //       setTimeout(() => {
      //         this.loaderService.display(false);
      //       }, 1000);
      //       this.authService.login();
      //     }
      // } else {
      //   setTimeout(() => {
      //    this.loaderService.display(false);
      //   }, 1000);
      //   this.authService.login();
      // }
    }

  }

  authenticateLoyaltyUser() {
    // this.authService.login();
    this.loginMsg = 'Login is not implemented. Please use Loyalty OAuth Login';
  }

  // loyaltyOAuth() {
  //   this.loaderService.display(true);
  //   this.authService.getTokenUrl().subscribe((data: any) => {
  //     this.tokenUrl = data;
  //     this.getToken(this.tokenUrl);
  //   },
  //   error => {
  //     console.log('error', error);
  //     this.loaderService.display(false);
  //   });
  // }

  // url param value extractor
  getUrlParams(url) {
    const params = {};
    (url + '?').split('?')[1].split('&').forEach(function (pair: any) {
      pair = (pair + '=').split('=').map(decodeURIComponent);
      if (pair[0].length) {
        params[pair[0]] = pair[1];
      }
    });
    return params;
  }

  getParameterByName(name) {
    const vars = [];
    let hash: any = '';
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[name];
  }

  getToken() {
    this.loaderService.display(true);
    this.authService.getAcessToken();
  }
}
