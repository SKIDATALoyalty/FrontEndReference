import { Component, OnInit, OnDestroy, TemplateRef, ViewEncapsulation } from '@angular/core';
import {ProductService} from './product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {

  productCategories: any ;
  productList: any ;
  singleProductInfo: any;
  modalRef: BsModalRef;
  activeSlideIndex = 0;

  totalItems = 64;
  currentPage = 4;
  smallnumPages = 0;

  constructor(private productService: ProductService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.spinner.show();
    // const productTypesUrl = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    // this.productService.getProductAPi(productTypesUrl).subscribe(
    //   data => {
    //     this.productCategories = data;
    //     this.getProductData();
    //   },
    //   error => {
    //     this.spinner.hide();
    //     console.log(error);
    //   });

    this.getProductData();
  }

  getProductData() {
    const productTypesUrl = environment.apidocs + 'v2/API/Product';
    this.productService.getProductAPi(productTypesUrl).subscribe(
      data => {
        this.spinner.hide();
        this.productList = data['Data']['Records'];
        // console.log('product data', this.productList);
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  openProductInModal(productModal: TemplateRef<any>, data) {
     this.singleProductInfo = data;
     this.modalRef = this.modalService.show(productModal);
   }

   pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }

}
