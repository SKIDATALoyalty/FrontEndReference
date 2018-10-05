import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {SimpleContentService} from './simple-content.service';
import {environment} from '../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaderService } from './../services/loader.service';
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
    private loaderService: LoaderService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.toggleView = 'list';

    this.loaderService.display(true);
    const simpleApiUrl = environment.apidocs + 'v1/API/SimpleContent/GetArticlesByCategory';
    this.simpleContentService.getSimpleContentAPi(simpleApiUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.simpleContentInfo = data;
      },
      error => {
        this.loaderService.display(false);
        console.log(error);
      });
  }

  showSimpleContentInModal(simpleContentModal: TemplateRef<any>, data) {
    // console.log('data---', data);
      this.singleContentInfo = data;
      this.modalRef = this.modalService.show(simpleContentModal);
  }

}
