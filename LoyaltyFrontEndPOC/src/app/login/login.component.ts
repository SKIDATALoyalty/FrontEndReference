import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ActivatedRoute, Router, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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
              private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService) {

   }

  ngOnInit() {
    if ( window.location.href.indexOf('access_token') > -1) {
      this.spinner.show();

      this.tokens = this.getUrlParams(window.location.href);
      localStorage.setItem('access_token', this.tokens['access_token']);
      localStorage.setItem('token_type', this.tokens['amp;response_type']);
      localStorage.setItem('expires_in', this.tokens['amp;expires_in']);
      this.spinner.hide();
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
      //         this.spinner.hide();
      //       }, 1000);
      //       this.authService.unAuthorizedPage(this.hasAdminRole);
      //     } else {
      //       setTimeout(() => {
      //         this.spinner.hide();
      //       }, 1000);
      //       this.authService.login();
      //     }
      // } else {
      //   setTimeout(() => {
      //     this.spinner.hide();
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
  //   this.spinner.show();
  //   this.authService.getTokenUrl().subscribe((data: any) => {
  //     this.tokenUrl = data;
  //     this.getToken(this.tokenUrl);
  //   },
  //   error => {
  //     console.log('error', error);
  //     this.spinner.hide();
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
    this.spinner.show();
    this.authService.getAcessToken();
  }
}
