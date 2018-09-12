import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {ProductService} from './product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {environment} from '../../environments/environment';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
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
  attributes: any;
  rewardData: any;
  totalItems = 64;
  currentPage = 4;
  smallnumPages = 0;
  productForm: FormGroup;

  constructor(private productService: ProductService,
              private spinner: NgxSpinnerService,
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
    this.productService.getAPi(productTypesUrl).subscribe(
      data => {
        this.spinner.hide();
        this.productList = data['Data']['Records'];
      },
      error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  openProductInModal(productModal: TemplateRef<any>, product, productID) {

     const productRewardUrl = environment.apidocs + 'v2/API/Product/Rewards/' + productID;
     this.singleProductInfo = product;
     this.attributes = product['Attributes'];

     this.productService.getAPi(productRewardUrl).subscribe(
       data => {
         this.rewardData = data['Data'];
         let arrtmp = [];
         for (const val of this.attributes) {
          arrtmp = [];
          for (const value of this.rewardData) {
              const tempDef = value['Definitions'];
              for (const tmpVal of tempDef) {
                if (val.LoyaltyProductAttributeID === tmpVal.LoyaltyProductAttributeID) {
                  if (arrtmp.length > 0) {
                    arrtmp.push(tmpVal);
                  } else {
                    const found = arrtmp.some(function (el) {
                      return el.LoyaltyProductAttributeDefinitionID === tmpVal.LoyaltyProductAttributeDefinitionID;
                    });
                    if (!found) {
                       arrtmp.push(tmpVal);
                    }
                  }
                }
              }
           }
          val['options'] = this.removeDuplicates(arrtmp);
        }
        // console.log('Attributes', this.attributes);
         const formGroup = {};
         for (const attr of this.attributes) {
           formGroup[attr['LoyaltyProductAttributeID']] = new FormControl('', Validators.required);
         }
         this.productForm = new FormGroup(formGroup);
         this.modalRef = this.modalService.show(productModal, {class: 'modal-lg'});
       },
       error => {
         console.log(error);
       });
   }

   pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }

  removeDuplicates(array) {
    const uniq = {};
    return array.filter(obj => !uniq[obj.LoyaltyProductAttributeDefinitionID] && (uniq[obj.LoyaltyProductAttributeDefinitionID] = true));
  }

  redeeemReward(productForm: NgForm) {
    console.log('Reward', this.rewardData);
    console.log(productForm.value);
  }
}
