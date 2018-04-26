import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {BadgeService} from './badge.service';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {AuthServiceService} from '../auth-service.service';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 100 });
}

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }],
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {

  @ViewChild(ModalDirective) modal: ModalDirective;
  badgeContentInfo: any;
  singleBadgeContentInfo: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;
  userID: any;

  constructor(private badgeService: BadgeService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              private authService: AuthServiceService) { }

  ngOnInit() {

    this.spinner.show();
    this.userID =  this.authService.decodeJwtToken()['custom:UserId'];
    const badgeApiUrl = environment.apidocs + 'v1/API/Badge/GetBadges?userID=' + this.userID;
    this.badgeService.getBadgeAPi(badgeApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.badgeContentInfo = data;
        // console.log('badge res', data);
      },
      error => {
        this.spinner.hide();
        console.log('error in badge get api', error);
      });
  }

  showBadgeInModal(badgeModal: TemplateRef<any>, data) {
    // console.log('data---', data);
     this.singleBadgeContentInfo = data;
     this.modalRef = this.modalService.show(badgeModal);
  }

}
