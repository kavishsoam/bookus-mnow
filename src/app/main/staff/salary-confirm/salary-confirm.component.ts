import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-salary-confirm',
  templateUrl: './salary-confirm.component.html',
  styleUrls: ['./salary-confirm.component.scss']
})
export class SalaryConfirmComponent implements OnInit {
  form: FormGroup
  constructor(
    @Optional() public dialogRef: MatDialogRef<SalaryConfirmComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {


    this.form = this.formBuilder.group({
      salary: [''],
      message: ['']
    })
  }

  ngOnInit() {
    console.log("data", this.data);

    this.populateData(this.data);
  }

  populateData(value) {
    this.form.patchValue({
      salary: value.totalSales,
      message: `This is to inform you that the salary for this month of August that is fue to me is yet to credited in my account . Lorem ipsum`
    })
  }

    onSubmit(form) {
    console.log(form);
  }

  submitted: any;

  delete() {

  }

  reject() {
    
  }

}


// Modaldata: any = {};

//   constructor(
//     private formBuilder: FormBuilder,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//   ) {
//     (this.data.edit) ? this.Modaldata.header = 'New Blog' : this.Modaldata.header = 'Edit Blog';
//   }

//   resource: any;

//   ngOnInit() {
//     this.resource = this.formBuilder.group({
//       category: [''],
//       topic: [''],
//       description: ['']
//     })
//   }


// }




