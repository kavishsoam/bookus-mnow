import { Component, OnInit, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { SETUP } from 'app/services/url';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cancellation-reasons',
  templateUrl: './cancellation-reasons.component.html',
  styleUrls: ['./cancellation-reasons.component.scss']
})
export class CancellationReasonsComponent implements OnInit {
  cancellationReasonsListColumns: string[] = ['name', 'addedAt'];
  cancellationReasonsList: any = [];
  constructor(private _fuseConfigService: FuseConfigService,
    public dialog: MatDialog,
    private _service: ApiService,
    private spinner: NgxSpinnerService
  ) { }
  pageHeader: Object = { header: " Cancellation reasons", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.getCancellationReasons();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  addCancellation(): void {
    const dialogRef = this.dialog.open(AddCancellation, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "New Cancellation Reason" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getCancellationReasons();
        }
      }
    });
  }
  editCancellation(row) {
    const dialogRef = this.dialog.open(AddCancellation, {
      width: '590px',
      position: { top: '20px' },
      data: { header: "Edit Cancellation Reason", cancellation: row }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == 'refresh') {
          this.getCancellationReasons();
        }
      }
    });
  }
  getCancellationReasons() {
    this.spinner.show();
    this._service.get(`${SETUP}cancellationReasons`).subscribe(res => {
      this.cancellationReasonsList = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
}
@Component({
  selector: 'addCancellation',
  templateUrl: 'addCancellation.html',
  styleUrls: ['./addCancellation.scss']
})
export class AddCancellation implements OnInit {
  // isDeletePrompt: boolean;
  addCancellationReason: FormGroup;
  name: any;
  loader: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddCancellation>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
  ) { }
  ngOnInit() {
    this.addCancellationReason = this._formBuilder.group({
      name: ['', Validators.required],
    });
    if (this.data.header == "Edit Cancellation Reason") {
      this.editCancellation(this.data.cancellation);
    }
  }
  addCancellation(form) {
    form.invalid ? this.loader = false : this.loader = true;
    if (form.invalid) {
      return;
    }
    if (this.data.header == "Edit Cancellation Reason") {
      this.updateCancellation(form.value);
    }
    else {
      this._service.post(`${SETUP}cancellationReasons`, form.value).subscribe(res => {
        this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
        this.loader = false
        this.dialogRef.close({
          type: 'refresh'
        })
      }), err => {
        this.loader = false
        this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      }
    }
  }
  updateCancellation(data) {
    this._service.put(`${SETUP}cancellationReasons/${this.data.cancellation._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
    })
  }
  deleteCancellation() {
    this._service.delete(`${SETUP}cancellationReasons/${this.data.cancellation._id}`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.dialogRef.close({
        type: 'refresh'
      })
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  editCancellation(value) {
    this.addCancellationReason.patchValue({
      name: value.name,
    })
  }
}