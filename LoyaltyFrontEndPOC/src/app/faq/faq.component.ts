import { Component, OnInit } from '@angular/core';
import {SimpleContentService} from './simple-content.service';
import {environment} from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  toggleView: string;
  simpleContentInfo: any;
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

}
