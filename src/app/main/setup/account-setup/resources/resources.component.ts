import { Component, OnInit, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LOC_LIS, SETT } from 'app/services/url';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  resourceData: any = [];
  displayedColumns: string[] = ['name', 'description'];
  locList: any = [];
  selectedLoc: any = "";
  constructor(private _fuseConfigService: FuseConfigService,
    public dialog: MatDialog,
    private _service: ApiService,
    private spinner: NgxSpinnerService) { }
  pageHeader: Object = { header: " Resources", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.getAllLocationList();
    this.getAllResource();
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  resourceEdit(value) {
    const dialogRef = this.dialog.open(resourceModal, {
      width: '600px',
      autoFocus: false,
      data: { header: "Edit Resource", data: value, location: this.locList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.type == "refresh") {
        this.getAllResource();
      }
    });
  }
  addNewResource() {
    const dialogRef = this.dialog.open(resourceModal, {
      width: '600px',
      autoFocus: false,
      data: { header: "New Resource", data: '', location: this.locList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type == "refresh") {
        this.getAllResource();
      }
    });
  }
  getAllLocationList() {
    this._service.get(LOC_LIS).subscribe(res => {
      this.locList = res;
      if (this.locList.length > 0) {
        // this.selectedLoc = this.locList[0]._id;
      }
    }, err => {
    })
  }
  locSelectedListener(e) {
    this.spinner.show();
    if (e == "") {
      this.getAllResource();
      return;
    }
    // {{url}}/api/company/setup/resources?location=5c74dc6cb9167d0018e7f2df
    this._service.get(`${SETT}resources/?location=${e}`).subscribe(res => {
      this.resourceData = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  getAllResource() {
    this.spinner.show();
    this._service.get(`${SETT}resources`).subscribe(res => {
      this.resourceData = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'resource-modal',
  templateUrl: './resource-modal/resource-modal.html',
  styleUrls: ['./resource-modal/resource-modal.scss']
})
export class resourceModal implements OnInit {
  Modaldata: any;
  locList: any = [];
  selectedLoc: any;
  resource: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<resourceModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _service: ApiService,
    private formBuilder: FormBuilder) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.resource = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
    });
    this.Modaldata = this.data;
    this.locList = this.data.location;
    if (this.Modaldata.header == "Edit Resource") {
      this.resource.patchValue({
        name: this.Modaldata.data.name,
        description: this.Modaldata.data.description,
        location: this.Modaldata.data.location
      })
    }
    else {
    }
  }
  // getAllLocationList() {
  //   this._service.get(LOC_LIS).subscribe(res => {
  //     this.locList = res;
  //     if (this.locList.length > 0) {
  //       this.selectedLoc = this.locList[0]._id;
  //     }
  //   }, err => {
  //   })
  // }
  get f() { return this.resource.controls; }

  onSubmit(form) {
    this.submitted = true;
    if (this.resource.invalid) {
      return;
    }
    if (this.Modaldata.header == "Edit Resource") {
      var formData = form.value;
      this._service.put(`${SETT}resources/${this.Modaldata.data._id}`, formData).subscribe(res => {
        this.dialogRef.close({ type: "refresh" });
      }, err => {

      })
      return;
    }
    this._service.post(`${SETT}resources`, this.resource.value).subscribe(res => {

      this.dialogRef.close({ type: "refresh" });
    }, err => {

    })
  }
  delete() {
    if (this.Modaldata.header == "Edit Resource") {
      this._service.delete(`${SETT}resources/${this.Modaldata.data._id}`).subscribe(res => {
        this.dialogRef.close({ type: "refresh" });
      }, err => {

      })
    }
  }

}


