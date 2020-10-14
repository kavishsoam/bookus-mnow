import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-email',
  templateUrl: './invoice-email.component.html',
  styleUrls: ['./invoice-email.component.scss']
})
export class InvoiceEmailComponent implements OnInit {

  @Input() invoiceData : any
  constructor(

    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<InvoiceEmailComponent>,
    private _service: ApiService,
    private toast : MessageService,
    private spinner : NgxSpinnerService

  ) { }
  email : any;

  ngOnInit() {
    console.log('invoice data==>>',this.invoiceData);
  }


  sendInvoice() {
    // this.dialogRef.close();
    this.spinner.show();
    this._service.get('sales/email_invoice?invoice='+this.invoiceData.invoiceNo+'&email='+this.email).subscribe(res=>{
      console.log(res);
      this.spinner.hide();
      this.toast.add({severity: "success",summary: "invoice sent to the Email",detail: 'invoice  send to email - '+this.email })
    },err=>{
      this.spinner.hide();
      this.toast.add({severity: "error",summary: "Something Went Wrong",detail: 'invoice could not be send to email -'+this.email })
      console.error(err);
      // this.dialogRef.close();
    })
    
  }

}
