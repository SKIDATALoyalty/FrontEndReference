import { LoaderService } from './../services/loader.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {BadgeService} from './badge.service';
import {environment} from '../../environments/environment';
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
              private loaderService: LoaderService,
              private modalService: BsModalService,
              private authService: AuthServiceService) {
              }

  ngOnInit() {
    this.loaderService.display(true);
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const badgeApiUrl = environment.apidocs + 'v1/API/Badge/GetBadges?userID=' + this.userID;
    this.badgeService.getBadgeAPi(badgeApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.badgeContentInfo = data;
      },
      error => {
        this.loaderService.display(false);
        console.log('error in badge get api', error);
      });
  }

  showBadgeInModal(badgeModal: TemplateRef<any>, data) {
      this.singleBadgeContentInfo = data;
      this.modalRef = this.modalService.show(badgeModal);
  }

}
