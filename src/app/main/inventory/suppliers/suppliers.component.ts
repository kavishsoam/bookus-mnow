import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { countries } from 'app/services/utilites';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  countryArray: any = countries;
  suppliersForm: FormGroup;
  physicalAddress: FormGroup;
  postalAddress: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) { 
    this.initializeForm();
  }
  ngOnInit() {
    
  }

  initializeForm() {
    this.suppliersForm = this._formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      telePhone: [''],
      email: [''],
      website: [''],
      usePostalAddress: [true],
      physicalAddress: this._formBuilder.group({
        street: [''],
        area: [''],
        city: [''],
        state: [''],
        country: [''],
        zip: [''],
      }),
      postalAddress: this._formBuilder.group({
        street: [''],
        area: [''],
        city: [''],
        state: [''],
        country: [''],
        zip: [''],
      })
    })
  }

  
  suppliers(e) {

  }

  onSubmitProduct(form) {
    console.log(form);
  }

  isDelete() {}
  get formFunction() {return this.suppliersForm.controls}
}
