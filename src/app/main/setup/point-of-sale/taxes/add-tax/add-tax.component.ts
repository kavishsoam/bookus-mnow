import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { SETUP, TAX, SETT } from 'app/services/url';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.scss']
})
export class AddTaxComponent implements OnInit {
  addTax: FormGroup;
  addTaxGroup: FormGroup;
  chooseTaxCalculation: FormGroup;
  editTaxDefaults: FormGroup;
  isDeletePrompt: boolean;
  defaultId: any;
  taxesList: any = []
  defaultServiceTax: any;
  @ViewChild('taxDropdown')
  taxDropdown: any;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTaxComponent>,
    private _formBuilder: FormBuilder,
    private _toast: MessageService,
    private _service: ApiService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit() {
    //
    if(this.data && this.data.taxesList){
      this.data.taxesList.map((tax) => {
        tax.disabled = false
      })
    }  
    this.addTax = this._formBuilder.group({
      name: ['', Validators.required],
      taxRate: ['', Validators.required],
    });
    if (this.data.header == 'New Tax Group' || this.data.header == 'Edit Tax Group') {
      let data;
      this.data.tax ? data = this.data.tax : null
      this.addTaxGroup = this._formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        taxGroup: this._formBuilder.array(this.taxGroupInit(data))
      })
    }
    this.chooseTaxCalculation = this._formBuilder.group({
      priceIncludetax: [''],
    });
    this.editTaxDefaults = this._formBuilder.group({
      defaultServiceTax: [''],
    })
    if (this.data.header == "Edit Tax") {
      this.editTax(this.data.tax);
    }
    if (this.data.header == "Edit Tax Group") {
      this.editTaxGroup(this.data.tax);
    }
    if(this.data.header == "Edit Tax Defaults"){
          //patch in editTaxDefaults
          this.editTaxDefaultInit()
    }
    if(this.data.header == "Change Tax Calculation"){
       this.changeTaxCalculation();
    }
  }

changeTaxCalculation(){
  this.spinner.show();
this._service.get(`${SETT}priceIncludetax`).subscribe(res=>{

this.chooseTaxCalculation.patchValue({
  priceIncludetax:res.result
});
this.spinner.hide();
},err=>{

this.spinner.hide();
})
}


  editTaxDefaultInit(){
    this.editTaxDefaults.patchValue({
      defaultServiceTax:this.data.defaultServiceTax._id
    });
  }
  taxGroupInit(data = null) {
    let group = [], len;
    data ? len = data.taxGroup.length : len = 2
    for (let i = 0; i < len; i++) {
      group.push(this._formBuilder.group({
        tax: ['', Validators.required]
      }))
    }
    if (!data && this.data.taxesList.length > 2) {
      group.push(this._formBuilder.group({
        tax: ['']
      }))
    }
    return group;
  }
  Tax(form) {
    //
    // form.value.name = this.name;
    if (form.invalid) {
      return;
    }
    if (this.data.header == "Edit Tax") {
      this.updateTax(form.value);
    }
    else {
      this._service.post(`${SETUP}taxRates`, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        this.dialogRef.close({
          type: 'refresh'
        }
        )
      }), err => {
        this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      }
    }
  }
  TaxGroup(form) {
    //
    if (form.invalid) {
      return;
    }
    let val = form.value
    let taxGroup = [], tax
    val.taxGroup.map((group) => {
      if (group.tax) {
        tax = {
          taxName: group.tax.taxName,
          taxId: group.tax.taxId,
          taxRate: group.tax.taxRate
        }
        taxGroup.push(tax)
      }
    })
    val.taxGroup = taxGroup
    if (this.data.header == "Edit Tax Group") {
      this.updateTaxGroup(val);
    }
    else {
      this._service.post(`${SETUP}taxRates`, val).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        this.dialogRef.close({
          type: 'refresh'
        }
        )
      }), err => {
        this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      }
    }
  }
  TaxCalculation(form) {
    this._service.put(`${SETUP}setting?taxcal=true`, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh',
        selectedOption : form.value.priceIncludetax
      }
      )
    }), err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      // this.dialogRef.close({
      //   type: 'refresh',
      //   selectedOption : form.value.priceIncludetax
      // })
    }
  }
  TaxDefaults(form) {    
    this._service.put(`${SETUP}defaultTax/${this.data.location._id}`, form.value).subscribe(res => {
      this.dialogRef.close({
        type: 'refresh'
      }
      )
    }), err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    }
  }
  updateTax(data) {
    this._service.put(`${SETUP}taxRates/${this.data.tax._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
    })
  }
  updateTaxGroup(data) {
    this._service.put(`${SETUP}taxRates/${this.data.tax._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
    })
  }
  editTax(value) {
    this.addTax.patchValue({
      name: value.name,
      taxRate: value.taxRate,
    })
  }
  editTaxGroup(value) {
    this.addTaxGroup.patchValue({
      name: value.name
    })
    value.taxGroup.map((val, i) => {
      this.addTaxGroup.get('taxGroup')['controls'][i].get('tax').setValue(val)
    })
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1.taxId === o2.taxId;
  }
  // deleteTax() {
  //   this.isDeletePrompt = !this.isDeletePrompt;
  //   if (!this.deleteTax) {
  //     this.dialogRef.updateSize('600px');
  //   }
  //   else {
  //     this.dialogRef.updateSize('600px', '215px');
  //   }
  // }
  deleteTax() {
    this._service.delete(`${TAX}/${this.data.tax._id}`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  temp: any;
  temp2: any = {};
  taxDropUpdate(e, i) {
    if (this.addTaxGroup.controls.taxGroup['controls'][i].controls.tax.value) {
      this.addTaxGroup.controls.taxGroup['controls'][i].controls.tax.value.disabled = true;
      let index = this.data.taxesList.findIndex(tax => tax.taxId === this.temp);
      let controlIndex = this.addTaxGroup.controls.taxGroup['controls'].findIndex(tax => tax.controls.tax.value.taxId === this.temp);
      if (index != -1 && (controlIndex == i || controlIndex == -1)) {
        this.data.taxesList[index].disabled = false
      }
      else if (index != -1 && this.temp2[i]) {
        let ind = this.data.taxesList.findIndex(tax => tax.taxId === this.temp2[i]);
        this.data.taxesList[ind].disabled = false
      }
      this.temp = this.addTaxGroup.controls.taxGroup['controls'][i].controls.tax.value.taxId
      this.temp2[i] = this.temp;
    }
    else {
      let ind = this.data.taxesList.findIndex(tax => tax.taxId === this.temp2[i]);
      if (ind != -1) {
        this.data.taxesList[ind].disabled = false;
        this.temp = null;
      }
    }
  }
  // dropdownReset(e, i) {
  //   if (this.addTaxGroup.controls.taxGroup['controls'][i].controls.tax.value) {
  //     this.temp = this.addTaxGroup.controls.taxGroup['controls'][i].controls.tax.value.taxId
  //   }
  // }
}
