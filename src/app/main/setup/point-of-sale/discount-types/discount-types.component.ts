import { Component, OnInit, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { SETUP } from 'app/services/url';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-discount-types',
  templateUrl: './discount-types.component.html',
  styleUrls: ['./discount-types.component.scss']
})
export class DiscountTypesComponent implements OnInit {
  discountList: any = [];
  discountListColumns: string[] = ['discountName', 'value', 'discountType', 'serviceEnabled', 'productEnabled', 'voucherEnabled', 'dateAdded'];
  constructor(private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) { }
  pageHeader: Object = { header: " Discount types", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.getDiscountTypes();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  addDiscount(): void {
    const dialogRef = this.dialog.open(AddDiscount, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "New Discount" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getDiscountTypes();
        }
      }
    });
  }
  editDiscount(row) {
    const dialogRef = this.dialog.open(AddDiscount, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "Edit Discount", discount: row }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getDiscountTypes();
        }
      }
    });
  }
  getDiscountTypes() {
    this.spinner.show();
    this._service.get(`${SETUP}discounts`).subscribe(res => {
      this.discountList = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
}
@Component({
  selector: 'addDiscount',
  templateUrl: 'addDiscount.html',
  styleUrls: ['./addDiscount.scss']
})
export class AddDiscount implements OnInit {
  isDeletePrompt: boolean;
  addDiscount: FormGroup;
  name: any;
  value: any;
  loader: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddDiscount>,
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
    this.addDiscount = this._formBuilder.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      valueType: ['percentage'],
      enableService: [''],
      enableProduct: [''],
      enableVoucher: [''],
    });
    if (this.data.header == "Edit Discount") {
      this.editDiscount(this.data.discount);
    }
  }
  Discount(form) {
    form.invalid ? this.loader = false : this.loader = true;
    if (form.invalid) {
      return;
    }
    form.value.enableService = form.value.enableService || false;
    form.value.enableProduct = form.value.enableService || false;
    form.value.enableVoucher = form.value.enableVoucher || false;
    if (this.data.header == "Edit Discount") {
      this.updateDiscount(form.value);
    }
    else {
      this._service.post(`${SETUP}discounts`, form.value).subscribe(res => {
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
  updateDiscount(form) {
    if (form.invalid) {
      return;
    }
    this._service.put(`${SETUP}discounts/${this.data.discount._id}`, form).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
    }, err => {
    })
  }
  deleteDiscount() {
    this._service.delete(`${SETUP}discounts/${this.data.discount._id}`).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      })
      this._toast.add({ severity: 'su\ccess', summary: 'Service Message', detail: res.message });
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  editDiscount(value) {
    this.addDiscount.patchValue({
      name: value.name,
      value: value.value,
      valueType: value.valueType,
      enableService: value.enableService,
      enableProduct: value.enableProduct,
      enableVoucher: value.enableVoucher,
    })
  }
}