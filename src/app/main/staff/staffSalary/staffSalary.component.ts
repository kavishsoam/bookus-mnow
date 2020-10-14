import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { Router } from "@angular/router"

@Component({
  selector: 'staffSalary',
  templateUrl: 'staffSalary.html',
  styleUrls: ['staffSalary.scss'],
})
export class staffSalary implements OnInit {
  staffDisplayedColumns: string[] = ['bookingReference', 'commission', 'sales']
  totalComm: any;
  totalSale: any;
  currencyCode: any;
  constructor(
    public dialogRef: MatDialogRef<staffSalary>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _router: Router) { }
  ngOnInit() {
    this.currencyCode = localStorage.getItem('currency')

    this.totalComm = this.data && this.data.specificStaffCommission.totalCommission;
    this.totalSale = this.data && this.data.specificStaffCommission.totalSales;
  }
}