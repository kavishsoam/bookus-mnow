import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { SETUP } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoicesForm: FormGroup;
  loader: boolean = false;
  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService

  ) { }
  pageHeader: Object = { header: " Invoices & Receipts", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.getInvoices();
    this.invoicesForm = this._formBuilder.group({
      autoPrint: [''],
      showMobEmail: [''],
      showAddress: [''],
      invoiceTitle: ['', Validators.required],
      line1: [''],
      line2: [''],
      footer: ['']
    })
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  invoices(form) {
    form.invalid ? this.loader = false : this.loader = true;
    if (form.invalid) {
      return;
    }
    form.value.autoPrint = form.value.autoPrint || false;
    form.value.showMobEmail = form.value.showMobEmail || false;
    form.value.showAddress = form.value.showAddress || false;
    this._service.put(`${SETUP}invoices`, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: 'Settings has been updated' });
      this.loader = false
    }, err => {
      this.loader = false
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err });
    })
  }
  getInvoices() {
    this.spinner.show()
    this._service.get(`${SETUP}invoices`).subscribe(res => {
      this.setInvoiceDetails(res.result);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  setInvoiceDetails(data) {
    this.invoicesForm.patchValue({
      autoPrint: data.autoPrint,
      showMobEmail: data.showMobEmail,
      showAddress: data.showAddress,
      invoiceTitle: data.invoiceTitle,
      line1: data.line1,
      line2: data.line2,
      footer: data.phone,
    })
  }
}