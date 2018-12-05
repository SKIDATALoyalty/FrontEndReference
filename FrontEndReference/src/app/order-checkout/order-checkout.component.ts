import { LoaderService } from './../services/loader.service';
import { Component, OnInit } from '@angular/core';
import {OrderCheckoutService} from './order-checkout.service';
import {environment} from '../../environments/environment';
import {AuthServiceService} from '../auth-service.service';

declare var Accept: any;

@Component({
  selector: 'app-order-checkout',
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.css']
})
export class OrderCheckoutComponent implements OnInit {

  currentOrder: any;
  pointsRequired = 0;
  moneyRequired = 0;
  orderlength = 0;

  constructor(private orderCheckoutService: OrderCheckoutService,
    private authService: AuthServiceService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    const params = [];
    const userID =  this.authService.decodeJwtToken()['uid'];
    const currentorderurl = environment.apidocs + 'v2/API/Orders/' + userID + '/Current';
    this.orderCheckoutService.get<any>(currentorderurl, params).subscribe(res => {
      this.currentOrder = this.calculateTotal(res);
    },
    error => {
      console.log('error in get current order', error);
    });
  }

  calculateTotal(orderReceived: any) {
    for (let i = 0; i < orderReceived.Items.length; i++) {
        if (orderReceived.Items[i].PaymentMethod === 'Money') {
            this.moneyRequired += orderReceived.Items[i].Quantity * orderReceived.Items[i].Reward.BuyNowCost;
        } else {
            this.pointsRequired += orderReceived.Items[i].Quantity * orderReceived.Items[i].Reward.CostInPoints;
        }
        // this.orderData.push(getQuantity(orderReceived.Items[i]));
        this.getQuantity(orderReceived.Items[i]);
        this.orderlength += orderReceived.Items[i].Quantity;
    }
   // console.log('success in get current order', orderReceived);
    return orderReceived;
  }

  // below method is used to insert max quantity for particualr reward.
  getQuantity(data) {
    const options = [];
    let limit = 0; // Will be zero if no reward is selected.

    const qtyRemaining = data.Reward.QuantityRemaining;
    const userCap = data.Reward.CurrentUserCap;

    if ((qtyRemaining > userCap) && (userCap > -1)) {
        limit = userCap;
    } else {
        if (qtyRemaining > -1) {
            limit = qtyRemaining;
        } else {
            limit = userCap;
        }
    }

    if (limit < 0) {
        limit = 50; // This reward has unlimited availability, but let's only show 50 or so.
    }

    for (let i = 1; i <= limit; i++) {
        options.push({ value: i.toString(), text: i.toString() });
    }

    const noOfEntities = 'Select';
    if (limit === 0) {
        options.push({ value: '', text: noOfEntities });
    }

    data.Reward.quantityMax = options;

    return data;
  }

  deleteOrderItem(orderItem: any) {
    const params = [];
    const pBody = {};
    const userID =  this.authService.decodeJwtToken()['uid'];
    const currentorderurl = environment.apidocs + 'v2/API/Orders/' + userID + '/RemoveItem/' + orderItem.OrderItemID;
    this.orderCheckoutService.post<any>(currentorderurl, params, pBody).subscribe(res => {
      console.log('success in delete order item', res);
      for (let i = 0; i < this.currentOrder.Items.length; i++) {
        if (this.currentOrder.Items[i].OrderItemID === orderItem.OrderItemID) {
          this.currentOrder.Items.splice(i, 1);
          this.calculateTotal(this.currentOrder);
          break;
        }
      }
    },
    error => {
      console.log('error in get current order', error);
    });
  }

}
