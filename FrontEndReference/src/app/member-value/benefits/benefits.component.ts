import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {MembervalueService} from '../membervalue.service';
import {environment} from '../../../environments/environment';
import {AuthServiceService} from '../../auth-service.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LoaderService } from '../../services/loader.service';

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
    private loaderService: LoaderService,
    private modalService: BsModalService,
    private authService: AuthServiceService) { }

  ngOnInit() {
    this.loaderService.display(true);
    this.getBenefitsData();
  }

  getBenefitsData() {
    this.userID =  this.authService.decodeJwtToken()['uid'];
    const benefitApiUrl = environment.apidocs + 'v2/API/MemberBenefits/' + this.userID;
    this.membervalueService.getMemberBenefitsAPi(benefitApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.benefitsList = data;
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  openBenefitInModal(benefitModal: TemplateRef<any>, data) {
    this.singleBenefitInfo = data;
    this.modalRef = this.modalService.show(benefitModal);
  }

}
