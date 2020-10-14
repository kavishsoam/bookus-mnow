import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageUploaderOptions } from 'ngx-image-uploader';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-body-point-modal',
  templateUrl: './body-point-modal.component.html',
  styleUrls: ['./body-point-modal.component.scss']
})
export class BodyPointModalComponent implements OnInit {
  bodyPointForm: any;


  constructor(
    @Optional() public dialogRef: MatDialogRef<BodyPointModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder : FormBuilder,
    private _service : ApiService,
    private _toast: MessageService,
    private spinner : NgxSpinnerService
  ) { 

    this.bodyPointForm = this.formBuilder.group({
      point : this.data.point,
      muscle : this.data.muscle,
      description : [''],
      pain : ['']
    })
  }

  painLevels :any = [
    {
      label : '1', value: '1'
    },
    {
      label : '2', value: '2'
    },
    {
      label : '3', value: '3'
    },
    {
      label : '4', value: '4'
    },
    {
      label : '5', value: '5'
    },
    {
      label : '6', value: '6'
    },
    {
      label : '7', value: '7'
    },
    {
      label : '8', value: '8'
    },
    {
      label : '9', value: '9'
    },
    {
      label : '10', value: '10'
    },
  ]

  ngOnInit() {
    // this.bodyPointForm.controls.point.setValue(this.data)
    if(this.data.description != '' && this.data.description != null){
      this.bodyPointForm.controls.description.setValue(this.data.description)
    }
    if(this.data.pain != null || this.data.pain != ''){
      this.bodyPointForm.controls.pain.setValue((this.data.pain).toString());
    }
  }

  delete() {

  }

  openEditModalModal(item) {
console.log(item)
  }

  savePointData(form) {
    let closedData = form.value
    console.log('Submit Bodypoint Form clicked ===>>>',form);
    this.dialogRef.close({closedData});
  }

  submitBodyPoint(form) {
    console.log('Submit Bodypoint Form clicked ===>>>',form);
    this.dialogRef.close({form});
  }

  cancelClicked(e) {
    console.log('cancel Bodypoint Form clicked ===>>>',e);
    this.dialogRef.close({e});
  }

}
