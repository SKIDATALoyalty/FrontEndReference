import { LoaderService } from './../services/loader.service';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { PointsService } from './points.service';
import { environment } from '../../environments/environment';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-point-activity',
  templateUrl: './point-activity.component.html',
  styleUrls: ['./point-activity.component.css']
})
export class PointActivityComponent implements OnInit, OnDestroy {
  defaultCategory = 1;
  pointCategories: any;
  pointActivities: any[] = [];
  singlePointInfo: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private pointService: PointsService,
    private loaderService: LoaderService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.loaderService.display(true);
    const pointTypes = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    this.pointService.getPointActivityAPi(pointTypes).subscribe(
      data => {
        this.pointCategories = data;
        this.loaderService.display(false);
        this.getPointActivities();
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  getSinglePointActivities(id: number, name: string) {
    // console.log('category id', id);
    if (name === 'All Categories') {
      const pointTypes = environment.apidocs + 'v1/API/pointActivities';
      this.pointService.getPointActivityAPi(pointTypes).subscribe(
        data => {
          this.pointActivities = [];
          this.loaderService.display(false);
          this.addExtraProperties(data);
        },
        error => {
          this.loaderService.display(false);
          console.log(error);
        });
    } else {
      const pointTypes = environment.apidocs + 'v1/API/pointActivities' + '?pointActivityTypeID=' + id;
      this.pointService.getPointActivityAPi(pointTypes).subscribe(
        data => {
          this.pointActivities = [];
          this.loaderService.display(false);
          this.addExtraProperties(data);
        },
        error => {
          this.loaderService.display(false);
          console.log(error);
        });
    }
  }

  getPointActivities() {
    this.loaderService.display(true);
    const pointTypes = environment.apidocs + 'v1/API/pointActivities';
    this.pointService.getPointActivityAPi(pointTypes).subscribe(
      data => {
        this.loaderService.display(false);
        this.addExtraProperties(data);
        // console.log(this.pointActivities);
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  addExtraProperties(collection: any) {
    for (const val of collection) {
      if (val.ActiveStartTime != null) {
        const activityStartDate = new Date(val.ActiveStartTime);
        if (activityStartDate > new Date()) {
          val.activityActiveIn = true;
        } else {
          val.activityActiveIn = false;
        }
      } else {
        val.activityActiveIn = false;
      }
      this.pointActivities.push(val);
    }
  }

  showPointActivityInModal(pointModal: TemplateRef<any>, data) {
    // console.log('data---', data);
    this.singlePointInfo = data;
    this.modalRef = this.modalService.show(pointModal, { class: 'modal-lg' });
  }

  ngOnDestroy() {
    this.loaderService.display(false);
  }

}
