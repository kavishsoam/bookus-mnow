import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageService } from 'primeng/api';
import { ApiService } from 'app/services/api.service';
import { APPOINTMENT_STATUS}from '../../../services/url';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent implements OnInit {
  selected = 'option1';

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CancelComponent>,
    private _service: ApiService,
    private _toast: MessageService,
  ) { }
  ngOnInit() {
  }
  appointmentCancelled() {
    //
    this._service.delete(`${APPOINTMENT_STATUS}${this.data.appointmentId}`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message })
      setTimeout(() => {
        this.dialogRef.close({
        })
      }, 1500);
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
}
