import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss']
})
export class OrderCreateComponent implements OnInit {

  constructor(
    private fb : FormBuilder 
  ) { }

  pageView : any = 'normal';
  orderForm : FormGroup;

  ngOnInit() {
    this.intializeForm();
  }

  intializeForm() {
    this.orderForm = this.fb.group({
      price : ['',[Validators.required]],
      referenceNumber : [''],
      supplier : [''],
      sourceLocation:[''],
      destinationLocation : [''],
      orderQuantity: [''],
      supplyPrice : [''],
      recievedQuantity : ['']
    }) 
  }

  onSubmitProduct(form) {}

}
