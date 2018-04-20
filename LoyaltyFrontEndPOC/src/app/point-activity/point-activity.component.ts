import { Component, OnInit, OnDestroy } from '@angular/core';
import {PointsService} from './points.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-point-activity',
  templateUrl: './point-activity.component.html',
  styleUrls: ['./point-activity.component.css']
})
export class PointActivityComponent implements OnInit, OnDestroy {
  page = 1;
  pointCategories: any ;
  constructor(private pointService: PointsService,
              private spinner: NgxSpinnerService,
              private http: HttpClient) { }

  ngOnInit() {
    this.spinner.show();
    const pointTypes = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    const reqHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('id_token'), 'x-api-key': environment.apiKey });
    this.http.get(pointTypes, { headers: reqHeader }).subscribe(
      data => {
        this.spinner.hide();
        console.log(data);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      } // error path
  );

    // this.spinner.show();
    // this.pointService.getPointTypes().subscribe((data: any) => {
    //   this.spinner.hide();
    //   // setTimeout(() => {
    //   //   this.spinner.hide();
    //   // }, 200);
    //   // this.pointCategories = data;
    //   // console.log('point types', this.pointCategories);
    // });
    // this.pointService.getPointTypes().subscribe((data: any) => {
    //   setTimeout(() => {
    //     this.spinner.hide();
    //   }, 200);
    //   this.pointCategories = data;
    //   console.log('point types', this.pointCategories);
    // });
  }

  ngOnDestroy() {
    this.spinner.hide();
  }

}
