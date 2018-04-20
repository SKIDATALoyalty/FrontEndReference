import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  page = 1;
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.hide();
  }

}
