import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  tokenUrl: any;
  constructor(private authService: AuthServiceService, private httpClient: HttpClient) { }

  ngOnInit() {
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

  getToken(url) {
    console.log('token url', url);
    this.authService.getAcessToken(url).subscribe((data: any) => {
       console.log('token data', data);
    });
  }

}
