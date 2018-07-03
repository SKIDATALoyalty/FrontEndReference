import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {AuthServiceService} from '../auth-service.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isAdmin: false;
  constructor( private authService: AuthServiceService,  private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.route.params.subscribe( params => {
        // console.log(params);
        if (params['admin']) {
          this.isAdmin = params['admin'];
        }
      });
  }

}
