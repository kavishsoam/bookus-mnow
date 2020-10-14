import { Component, OnInit, Optional, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ApiService } from "app/services/api.service";
import { Router } from "@angular/router";
import * as moment from "moment";

@Component({
  selector: "app-close-date",
  templateUrl: "./close-date.component.html",
  styleUrls: ["./close-date.component.scss"]
})
export class CloseDateComponent implements OnInit {
  closeDateForm: FormGroup;
  id: any;
  ifDelete: boolean;
  allCheck:boolean=true;
  submittedError:boolean;

  constructor(
    @Optional() public dialogRef: MatDialogRef<CloseDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}
 
  ngOnInit() {
      this.closeDateForm = this._formBuilder.group({
      startDate: ["",Validators.compose([Validators.required])],
      endDate: ["",Validators.compose([Validators.required])],
      location: new FormArray([],this.minSelectedCheckboxes(1)),
      description: ["",Validators.compose([Validators.required])]
    });

    this.addCheckboxLocation(
      this.data && this.data.tableData && this.data.tableData.locationId
        ? this.data.tableData.locationId
        : []
    );

    if (this.data.tableData) {
      this.patchUpData(this.data.tableData);
    }
  }

  //patch data to form
  patchUpData(f) {
    this.closeDateForm.patchValue({
      startDate: f.startDate,
      endDate: f.endDate,
      description: f.description
    });
    this.id = f._id;
    this.allCheck = f.selectAll;
  }

  //to add location into the array.
  private addCheckboxLocation(arr) {
    this.data.location.map((o, i) => {
      const control = new FormControl(
       //arr length is zero then select all because new close date.
        arr.length == 0  ? true : arr.some((it: any) => { if (it == o._id) { return true;} })
      );
      (this.closeDateForm.controls.location as FormArray).push(control);
    });
  }

  //add 30 min. (time changer)
  timeIncrease(d) {
    let obj: any = moment(d).add(30, "minutes");
    return obj._d;
  }

  //add close date submit
  AddCloseSubmit(f) {
    //
    if (f.invalid) {
      this.submittedError = true;
      return true;
    }   
    let data = Object.assign({}, f.value);
    delete data.location;
    data.location = this.getLocDrop();
    
    //Update
    if(this.id){
      this._service.put(`closed/${this.id}`, data).subscribe(
        res => {
        
          this.dialogRef.close({ refresh: true });
        },
        err => {
          //(err);
        }
      );
      return;
    }

    //New  
    this._service.post(`closed`, data).subscribe(
      res => {
      
        this.dialogRef.close({ refresh: true });
      },
      err => {
        //(err);
      }
    );
  }

  //to get the array of selected location id.
  getLocDrop() {
    const selectedOrderIds = this.closeDateForm.value.location
      .map((v, i) => (v ? this.data.location[i]._id : null))
      .filter(v => v !== null);
    return selectedOrderIds;
  }

//to delete the closed date
deleteCloseDate(){
  this._service.delete(`closed/${this.id}`).subscribe(res=>{
    this.dialogRef.close({ refresh: true });
  },err=>{
    console.error("close date delete",err)
  })
}

// select all check button
selectAll(e){
  let control = (this.closeDateForm.controls.location as FormArray);
  if (!e) 
  control.controls.map(x => x.patchValue(true))
  else
  control.controls.map(x => x.patchValue(false))
}


minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map(control => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => next ? prev + next : prev, 0);

    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}


}
