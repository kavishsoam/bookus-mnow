import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent implements OnInit {

  constructor(
    private fb : FormBuilder
  ) { }

  brandForm : FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.brandForm = this.fb.group({
      brandName : ['',[Validators.required]],
      count : ['',[Validators.required]]
    })
  }

  createForm(form) {
    console.log(form);
  }

  deleteGroup() {}

}
