import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  tokenUrl: any;
  accessToken: any;
  constructor(private authService: AuthServiceService,
              private httpClient: HttpClient,
              private activeRoute: ActivatedRoute,
              private router: Router) {

   }

  ngOnInit() {
    console.log(this.authService.isTokenExpired()); // true or false
    console.log(this.authService.decodeJwtToken()); // token
    if ( window.location.href.indexOf('access_token') > -1) {
      this.accessToken = this.getParameterByName('access_token');
      sessionStorage.setItem('access_token', this.getParameterByName('access_token'));
      sessionStorage.setItem('id_token', this.getParameterByName('id_token'));
      sessionStorage.setItem('token_type', this.getParameterByName('token_type'));
      sessionStorage.setItem('expires_in', this.getParameterByName('expires_in'));
      this.authService.login();
    }
  }

  authenticateLoyaltyUser() {
    this.authService.login();
  }

  newLoyaltyAuth() {
    console.log('new method called');
    this.authService.getTokenUrl().subscribe((data: any) => {
      this.tokenUrl = data;
      this.getToken(this.tokenUrl);
    });
  }

  // url param value extractor
  getParameterByName(name) {
    const vars = [];
    let hash: any = '';
    const hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[name];
  }

  getToken(url) {
    console.log('token url', url);
    this.authService.getAcessToken(url);
  }

}
