import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {SimpleContentService} from './simple-content.service';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;
  toggleView: string;
  simpleContentInfo: any;
  singleContentInfo: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  constructor(private simpleContentService: SimpleContentService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.toggleView = 'list';

    this.spinner.show();
    const simpleApiUrl = environment.apidocs + 'v1/API/SimpleContent/GetArticlesByCategory';
    this.simpleContentService.getSimpleContentAPi(simpleApiUrl).subscribe(
      data => {
        this.spinner.hide();
        this.simpleContentInfo = data;
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  showSimpleContentInModal(simpleContentModal: TemplateRef<any>, data) {
    // console.log('data---', data);
     this.singleContentInfo = data;
     this.modalRef = this.modalService.show(simpleContentModal);
  }

}
