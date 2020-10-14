import { Component, OnInit, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { SETUP } from 'app/services/url';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrls: ['./payment-types.component.scss']
})
export class PaymentTypesComponent implements OnInit {
  paymentListColumns: string[] = ['type'];
  paymentList: any = [];
  constructor(private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }
  pageHeader: Object = { header: " Payment types", main: "Setup", navigate: true }
  ngOnInit() {
    this.getPayment();
    this.setPageHeader()
  }
  addpayments(): void {
    const dialogRef = this.dialog.open(AddPayment, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "New Payment Type" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getPayment();
        }
      }
    });
  }
  editPayment(row) {
    const dialogRef = this.dialog.open(AddPayment, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "Edit Payment Type", type: row, paymentList: this.paymentList.length }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getPayment();
        }
      }
    });
  }
  getPayment() {
    this.spinner.show();
    this._service.get(`${SETUP}paymentTypes`).subscribe(res => {
      this.paymentList = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
}
@Component({
  selector: 'addPayment',
  templateUrl: 'addPayment.html',
  styleUrls: ['./addPayment.scss']
})
export class AddPayment implements OnInit {
  isDeletePrompt: boolean;
  addPaymentType: FormGroup;
  name: any;
  value: any;
  loader: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddPayment>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
  ) { }
  // ConfirmDelLocation() {
  //   this.isDeletePrompt = !this.isDeletePrompt;
  //   if (!this.ConfirmDelLocation) {
  //     this.dialogRef.updateSize('600px', '500px');
  //   }
  //   else {
  //     this.dialogRef.updateSize('600px', '215px');
  //   }
  // }
  ngOnInit() {
    this.addPaymentType = this._formBuilder.group({
      type: ['', Validators.required],
    });
    if (this.data.header == "Edit Payment Type") {
      this.editPayment(this.data.type);
    }
  }
  addPayment(form) {
    form.invalid ? this.loader = false : this.loader = true;
    if (form.invalid) {
      return;
    }
    if (this.data.header == "Edit Payment Type") {
      this.updatePayment(form.value);
    }
    else {
      this._service.post(`${SETUP}paymentTypes`, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        this.loader = false
        this.dialogRef.close({
          type: 'refresh'
        }
        )
      }), err => {
        this.loader = false
        this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      }
    }
  }
  updatePayment(data) {
    let val = {
      oldValue: this.data.type,
      newValue: data.type
    }
    this._service.put(`${SETUP}paymentTypes`, val).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
    }, err => {
    })
  }
  deletePayment() {
    let val = {
      type: this.data.type
    }
    this._service.put(`${SETUP}payment_delete`, val).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  editPayment(value) {
    this.addPaymentType.patchValue({
      type: value,
    })
  }
}