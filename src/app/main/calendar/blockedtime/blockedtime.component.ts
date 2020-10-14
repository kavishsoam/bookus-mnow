import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { STAFF, APPOINTMENT } from '../../../services/url';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-blockedtime',
  templateUrl: './blockedtime.component.html',
  styleUrls: ['./blockedtime.component.scss']
})
export class BlockedtimeComponent implements OnInit {
  staffLists: any = [];
  blockedTimeForm: FormGroup;
  blockedDate: any = [];
  Date: string;
  constructor(
    @Optional() public dialogRef: MatDialogRef<BlockedtimeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _toast: MessageService,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit() {
    this.getAllStaff();
    this.blockedTimeForm = this._formBuilder.group({
      staff: [''],
      day: [''],
      startTime: [''],
      endTime: [''],
      notes: [''],
    });
  }
  getAllStaff() {
    this.spinner.show();
    this._service.get(`${STAFF}?type=staff`).subscribe(res => {
      this.staffLists = res;
      this.staffLists = this.staffLists.map((item) => {
        return {
          id: item._id,
          firstName: item.firstName,
          lastName: item.lastName
        }
      })
      //when all staff is recived then patch the form data
      this.setBlockedData();

    }, err => {
    })
  }
  setBlockedData() {
    let date = moment(this.data.startTime).format("YYYY-MM-DD");
    if (this.data.header == 'New Blocked Time') {

      this.blockedTimeForm.patchValue({
        staff: this.data.staff,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        day: date,
      })
      this.spinner.hide();
    }
    else {
      this.blockedTimeForm.patchValue({
        staff: this.data.details.staff,
        startTime: this.data.details.startTime,
        endTime: this.data.details.endTime,
        day: this.data.details.date,
        notes: this.data.details.notes
      })
      this.spinner.hide();
    }
  }
  blockedTime(form) {

    form.value._type = "blocked";
    form.value.location = this.data.location;
    var bookedBy = {
      id: localStorage.getItem('id'),
      type: 'staff',
      name: localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName')
    };
    form.value.bookedBy = bookedBy;
    if (this.data.header == "New Blocked Time") {
      this._service.post(`${APPOINTMENT}`, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: `Block time created` });
        this.dialogRef.close({
          Type: "refresh",
        })
      }, err => {
      })
    }
    else {
      form.value.location = this.data.details.location_id;
      this._service.put(`${APPOINTMENT}/${this.data.details.id}`, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: `Blocked time has been updated` });
        this.dialogRef.close({
          Type: "refresh",
        })
      }, err => {
      })
    }
  }
  deleteBlockedTime() {
    this._service.delete(`${APPOINTMENT}/${this.data.details.id}?blocked=true`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        Type: 'refresh'
      })
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  compareObjectsStaff(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.id == obj2.id && obj1.firstName == obj2.firstName && obj1.lastName == obj1.lastName) : obj1 === obj2
  }
}
