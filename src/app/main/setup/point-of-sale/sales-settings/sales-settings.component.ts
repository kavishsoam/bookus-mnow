import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SETUP } from 'app/services/url';
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-sales-settings',
  templateUrl: './sales-settings.component.html',
  styleUrls: ['./sales-settings.component.scss']
})
export class SalesSettingsComponent implements OnInit {
  selected = '6 Months';
  expiryperiod = [
    { value: '1 Month' },
    { value: '2 Months' },
    { value: '3 Months' },
    { value: '6 Months' },
    { value: '1 Year' }
  ];
  salesSettingsForm: FormGroup;
  loader: boolean = false;
  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService
  ) { }
  pageHeader: Object = { header: " Sales settings", main: "Setup", navigate: true }
  ngOnInit() {
    this.getSalesSettings();
    this.setPageHeader();
    this.salesSettingsForm = this._formBuilder.group({
      beforeDiscount: [''],
      includingTax: [''],
      expiryPeriod: ['']
    })
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  salesSettings(form) {
    form.invalid ? this.loader = false : this.loader = true;
    form.value.beforeDiscount = form.value.beforeDiscount || false;
    form.value.includingTax = form.value.includingTax || false;
    this._service.put(`${SETUP}saleSettings`, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message })
      this.loader = false;
    }, err => {
      this.loader = false
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err });
    })
  }
  getSalesSettings() {
    this.spinner.show()
    this._service.get(`${SETUP}saleSettings`).subscribe(res => {
      this.setSalesSettings(res.result);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  setSalesSettings(data) {
    this.salesSettingsForm.patchValue({
      beforeDiscount: data.beforeDiscount,
      includingTax: data.includingTax,
      expiryPeriod: data.expiryPeriod,
    })
  }
}
