import { LoaderService } from './../services/loader.service';
import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {ProductService} from './product.service';
import {environment} from '../../environments/environment';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AuthServiceService} from '../auth-service.service';

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
  showAddToCart = false;
  tempdef = [];
  productForm: FormGroup;
  message: any;
  selectedReward: any;

  constructor(private productService: ProductService,
              private loaderService: LoaderService,
              private modalService: BsModalService,
              private authService: AuthServiceService) { }

  ngOnInit() {
    this.loaderService.display(true);
    // const productTypesUrl = environment.apidocs + 'v1/API/PointActivityType/GetTypes';
    // this.productService.getProductAPi(productTypesUrl).subscribe(
    //   data => {
    //     this.productCategories = data;
    //     this.getProductData();
    //   },
    //   error => {
    //      this.loaderService.display(false);
    //     console.log(error);
    //   });

    this.getProductData();
  }

  getProductData() {
    const productTypesUrl = environment.apidocs + 'v2/API/Product';
    this.productService.getAPi(productTypesUrl).subscribe(
      data => {
        this.loaderService.display(false);
        this.productList = data['Data']['Records'];
      },
      error => {
        this.loaderService.display(false);
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
        this.modalRef = this.modalService.show(productModal, {class: 'modal-lg'});
        let arrtmp = [];
        for (const val of this.attributes) {
          arrtmp = [];
          for (const value of this.rewardData) {
              const tempDef = value['Definitions'];
              for (const tmpVal of tempDef) {
                if (val.LoyaltyProductAttributeID === tmpVal.LoyaltyProductAttributeID) {
                  arrtmp.push(tmpVal);
                }
              }
          }
          val['options'] = this.removeDuplicates(arrtmp);
        }

        const formGroup = {};
        for (const attr of this.attributes) {
          formGroup[attr['LoyaltyProductAttributeID']] = new FormControl('', Validators.required);
        }
        this.productForm = new FormGroup(formGroup);
        // subscribe to form group to see changes
        this.productForm.valueChanges.subscribe(form => {

          this.tempdef = [];
          if (this.productForm.valid) {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                const element = form[key];
                const obj = {LoyaltyProductAttributeDefinitionID: Number(element), LoyaltyProductAttributeID: Number(key)};
                this.tempdef.push(obj);
              }
            }

            let count = 0;
            for (const value of this.rewardData) {
              count = 0;
              for (const val of value.Definitions) {
                for (const tdef of this.tempdef) {
                  if (val.LoyaltyProductAttributeDefinitionID === tdef.LoyaltyProductAttributeDefinitionID) {
                    count++;
                  }
                }
                if (value.Definitions.length === count) {
                  this.selectedReward = value;
                  break;
                }
              }
              if (value.Definitions.length === count) {
                this.selectedReward = value;
                break;
              }
            }
            console.log('final result', this.selectedReward);
            if (this.selectedReward.UseCheckout) {
              this.showAddToCart = true;
            }
          } else {
            this.tempdef = [];
            this.showAddToCart = false;
          }
        });
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
    const redeemUrl = environment.apidocs + 'v1/API/Rewards/' + this.selectedReward.RewardID + '/redeem';
    const params = [];
    const pBody = {
      'quantity': 1
    };

    this.productService.post<any>(redeemUrl, params, pBody).subscribe(res => {
      this.message = 'Reward Redeemed Successfully';
      const formGroup = {};
        for (const attr of this.attributes) {
          formGroup[attr['LoyaltyProductAttributeID']] = new FormControl('', Validators.required);
        }
        this.productForm = new FormGroup(formGroup);
    },
    error => {
      console.log('redeem', error);
      this.message = error['error']['Message'];
    });
  }

  addTocart(productForm: NgForm) {
    const userID =  this.authService.decodeJwtToken()['uid'];
    const paymtd = this.selectedReward.NotForSale ? '2' : '1';
    const addCartUrl = environment.apidocs + 'v2/API/Orders/' + userID + '/AddItem/' + this.selectedReward.RewardID + '?quantity=' + 5 + '&paymentMethod=' + paymtd ;
    const params = [];
    const pBody = {};

    this.productService.post<any>(addCartUrl, params, pBody).subscribe(res => {
      this.message = 'Reward Successfully Added to the cart';
      const formGroup = {};
        for (const attr of this.attributes) {
          formGroup[attr['LoyaltyProductAttributeID']] = new FormControl('', Validators.required);
        }
        this.productForm = new FormGroup(formGroup);
    },
    error => {
      console.log('redeem', error);
      this.message = error['error']['Message'];
    });
  }

  closeModal() {
    this.modalRef.hide();
    this.message = '';
    this.showAddToCart = false;
  }
}
