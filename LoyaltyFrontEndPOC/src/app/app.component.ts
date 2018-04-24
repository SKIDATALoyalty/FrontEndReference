import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { Router } from '@angular/router';
import {AuthServiceService} from './auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthServiceService,
              private router: Router,
              private jwtHelper: JwtHelperService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    // console.log('islogged in app component', this.isLoggedIn$);
  }
}
