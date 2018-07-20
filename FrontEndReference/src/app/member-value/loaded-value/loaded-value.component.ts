import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {MembervalueService} from '../membervalue.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {environment} from '../../../environments/environment';
import {AuthServiceService} from '../../auth-service.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-loaded-value',
  templateUrl: './loaded-value.component.html',
  styleUrls: ['./loaded-value.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoadedValueComponent implements OnInit {

  loadedList: any;
  loadedHistory: any;
  singleLoadedInfo: any;
  userID: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private membervalueService: MembervalueService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private authService: AuthServiceService) { }

  ngOnInit() {
    this.spinner.show();
    this.getLoadedData();
  }

  getLoadedData() {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const loadedApiUrl = environment.apidocs + 'v3/API/LoadedValue/u/' + this.userID + '/LoadedValue';
    this.membervalueService.getLoadedValueAPi(loadedApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.loadedList = data['Data']['Records'];
        // console.log('data', data['Data']['Records']);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  getLoadedValueHistory(lId: Number) {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const loadedTransactionApiUrl = environment.apidocs + 'v2/API/MemberValue/u/' + this.userID + '/LoadedValueTransactions/' + lId;
    this.membervalueService.getLoadedValueHistoryAPi(loadedTransactionApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.loadedHistory = data['Records'];
        console.log('data', data['Records']);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  openBenefitInModal(benefitModal: TemplateRef<any>, data) {
    this.singleLoadedInfo = data;
    this.modalRef = this.modalService.show(benefitModal);
  }
}
