import { Component, OnInit, Inject, Optional } from '@angular/core';

import { VOUCHER } from '../../../../../services/url';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { ToastModule, Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  voucherSearch: boolean = false;
  voucherGet: any;
  voucherInfo: any;
  VoucherInput : any;
  voucherCode : any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef<VoucherComponent>,
    private _service: ApiService,
    private _toast: MessageService
  ) { }
  // this.data.redemptionAmount.totalPrice;
  ngOnInit() {   
  }

  voucherSubmit() {
    if(this.voucherCode) {
      this._service.get(`${VOUCHER}/${this.voucherCode}`).subscribe(res=>{
        console.log('response of voucher==>>>',res)
        this.voucherGet = res.result[0];
      },err=>{
        console.log(err);
        delete this.voucherGet
        this._toast.add({
          severity: "error",
          summary : "Voucher Error",
          detail : err.error
        })
      })
    }
    else{
      delete this.voucherGet
    }
  }

  onSearchChange(value) {
    this.voucherCode = value;
    // if (value.length >= 1) {
    //   this.voucherSearch = true;
    // }
    // else {
    //   this.voucherSearch = false;
    // }
    // if (value.length == 8) {
    //   this._service.get(`${VOUCHER}/${value}`).subscribe(res => {
    //     this.voucherGet = res.result[0];
    //     //
    //   }, err => {
    //   })
    // }
    // else {
    //   delete this.voucherGet
    // }
  }
  voucherAdded() {
    this.dialogRef.close({
      amount: this.data.redemptionAmount.totalPrice > this.voucherGet.remainingAmount ? (this.voucherGet.remainingAmount) : (this.data.redemptionAmount.totalPrice),
      type: this.voucherGet._type == 'Gift Voucher' ? 'Gift Voucher' : 'Service Voucher',
      code : this.voucherGet.code
    });
  }
}
