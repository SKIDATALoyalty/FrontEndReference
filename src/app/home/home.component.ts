import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthServiceService) { }

  ngOnInit() {
    // console.log(this.authService.isTokenExpired()); // true or false
    // console.log(this.authService.decodeJwtToken()); // token
    if (this.authService.isTokExpired(localStorage.getItem('tokenExpiration'))) {
      // token not expired
    } else {
      // token expired
      this.authService.logout();
    }
  }

}
