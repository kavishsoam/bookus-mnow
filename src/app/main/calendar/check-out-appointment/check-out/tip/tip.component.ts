import { Component, OnInit, Optional, Inject } from '@angular/core';

import { GET_STAFF_DROP } from '../../../../../services/url';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { getCurrencySymbol } from '@angular/common';
import { ApiService } from 'app/services/api.service';
@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent implements OnInit {
  logo: any;
  staff: any;
  selectedStaff: any = "";
  button = true;
  tip: any;
  tipHeader: string;
  logoHeader: string;
  amount: any = "";
  type: any;
  currencyCode: string;
  currCode: string;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TipComponent>,
    private _service: ApiService,
  ) {
  }
  ngOnInit() {
    this.currencyCode = localStorage.getItem('currency')
    this.currCode = getCurrencySymbol(this.currencyCode, "narrow")
    this.getAllStaff();
    this.currency();
    this.logoHeader = this.currCode
  }
  onTipAmountChange(searchValue: string) {
    this.tipHeader = searchValue;
    if (this.logoHeader == this.currCode) {
      this.currency();
      this.amount = searchValue;
    }
    else {
      this.percentage()
    }
  }
  currency() {
    this.logo = " %";
    this.logoHeader = this.currCode;
    this.button = true;
    this.tip = (Number(this.tipHeader) / Number(this.data.finalPrice) * 100).toFixed(2);
    if (this.tip == "NaN") this.tip = `${this.currCode} 0`
    else this.tip = this.tip + (this.logo)
  }
  percentage() {
    this.logo = this.currCode;
    this.logoHeader = "%"
    this.button = false;
    this.tip = (Number(this.tipHeader) * Number(this.data.finalPrice) / 100).toFixed(2);
    if (this.tip == "NaN") this.tip = `0 %`
    else this.tip = `${(this.logo)} ${this.tip}`
    this.amount = (Number(this.tipHeader) * Number(this.data.finalPrice) / 100).toFixed(2);
  }
  getAllStaff() {
    this._service.get(GET_STAFF_DROP).subscribe(res => {
      this.staff = res;
      this.selectedStaff = this.data.selectedStaff;
    }, err => {
    })
  }
  tipAdded() {
    var staff_Data = this.staff.filter(item => item._id == this.selectedStaff)
    staff_Data = staff_Data[0];
    var staff_firstName = staff_Data && staff_Data.firstName ? staff_Data.firstName : '';
    var staff_lastName = staff_Data && staff_Data.lastName ? staff_Data.lastName : '';
    if (this.selectedStaff == undefined && this.amount == "") {
      return;
    }
    this.dialogRef.close({
      staff: this.selectedStaff, amount: this.amount,
      firstName: staff_firstName, lastName: staff_lastName,
      type: "save"
    });
  }
  staffSelected(item) {
  }
}
