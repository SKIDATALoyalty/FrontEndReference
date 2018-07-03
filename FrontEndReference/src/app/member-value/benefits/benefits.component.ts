import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {MembervalueService} from '../membervalue.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {environment} from '../../../environments/environment';
import {AuthServiceService} from '../../auth-service.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BenefitsComponent implements OnInit {

  benefitsList: any ;
  singleBenefitInfo: any;
  userID: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private membervalueService: MembervalueService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private authService: AuthServiceService) { }

  ngOnInit() {
    this.spinner.show();
    this.getBenefitsData();
  }

  getBenefitsData() {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const benefitApiUrl = environment.apidocs + 'v2/API/MemberBenefits/' + this.userID;
    this.membervalueService.getMemberBenefitsAPi(benefitApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.benefitsList = data;
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  openBenefitInModal(benefitModal: TemplateRef<any>, data) {
    this.singleBenefitInfo = data;
    this.modalRef = this.modalService.show(benefitModal);
  }

}
