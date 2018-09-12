import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {PointsService} from './points.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-point-activity',
  templateUrl: './point-activity.component.html',
  styleUrls: ['./point-activity.component.css']
})
export class PointActivityComponent implements OnInit, OnDestroy {
  defaultCategory = 1;
  pointCategories: any ;
  pointActivities: any ;
  singlePointInfo: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private pointService: PointsService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.spinner.show();
    const pointTypes = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    this.pointService.getPointActivityAPi(pointTypes).subscribe(
      data => {
        this.pointCategories = data;
        this.spinner.hide();
        this.getPointActivities();
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  getSinglePointActivities(id: number, name: string) {
    // console.log('category id', id);
    if (name === 'All Categories') {
      const pointTypes = environment.apidocs + 'v1/API/pointActivities';
      this.pointService.getPointActivityAPi(pointTypes).subscribe(
        data => {
          this.spinner.hide();
          this.pointActivities = data;
          // console.log('data---', data);
        },
        error => {
          this.spinner.hide();
          console.log(error);
        });
    } else {
      const pointTypes = environment.apidocs + 'v1/API/pointActivities' + '?pointActivityTypeID=' + id;
      this.pointService.getPointActivityAPi(pointTypes).subscribe(
        data => {
          this.spinner.hide();
          this.pointActivities = data;
          // console.log('data---', data);
        },
        error => {
          this.spinner.hide();
          console.log(error);
        });
    }
  }

  getPointActivities () {
    this.spinner.show();
    const pointTypes = environment.apidocs + 'v1/API/pointActivities';
    this.pointService.getPointActivityAPi(pointTypes).subscribe(
      data => {
        this.spinner.hide();
        this.pointActivities = data;
        // console.log('data---', data);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  showPointActivityInModal(pointModal: TemplateRef<any>, data) {
   // console.log('data---', data);
    this.singlePointInfo = data;
    this.modalRef = this.modalService.show(pointModal, {class: 'modal-lg'});
  }

  ngOnDestroy() {
    this.spinner.hide();
  }

}
