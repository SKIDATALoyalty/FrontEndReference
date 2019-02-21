import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {MembervalueService} from '../membervalue.service';
import { LoaderService } from '../../services/loader.service';
import {environment} from '../../../environments/environment';
import {AuthServiceService} from '../../auth-service.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var Accept: any;
@Component({
  selector: 'app-stored-value',
  templateUrl: './stored-value.component.html',
  styleUrls: ['./stored-value.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StoredValueComponent implements OnInit {

  storedList: any;
  storedHistory: any;
  singleLoadedInfo: any;
  userID: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private membervalueService: MembervalueService,
    private loaderService: LoaderService,
    private modalService: BsModalService,
    private authService: AuthServiceService) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.getStoredData();
  }

  getStoredData() {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const storedApiUrl = environment.apidocs + 'v2/API/MemberValue/u/' + this.userID + '/StoredValue?autoCreate=true';
    this.membervalueService.getValueAPi(storedApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.storedList = data;
        // console.log('data', data);
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  getStoredValueHistory(lId: Number) {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const storedTransactionApiUrl = environment.apidocs + 'v2/API/MemberValue/u/' + this.userID + '/StoredValueTransactions/' + lId + '?successfulOnly=false&pageOffset=0&pageSize=20';
    this.membervalueService.getValueHistoryAPi(storedTransactionApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.storedHistory = data['Records'];
        // console.log('data', data['Records']);
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

}
