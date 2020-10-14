import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { INTAKE, CLIENT } from '../../../services/url';
import { ClientIntakeForm } from '../clients.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'app/services/api.service';
@Component({
  selector: 'app-client-intake-list',
  templateUrl: './client-intake-list.component.html',
  styleUrls: ['./client-intake-list.component.scss']
})
export class ClientIntakeListComponent implements OnInit {
  service: any = [];
  intakeList: any;
  intakeId: any;
  clientList: any;
  info: any;
  loader: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialog: MatDialog,
    private _service: ApiService,
    private spinner : NgxSpinnerService,
    public dialogRef: MatDialogRef<ClientIntakeListComponent>
  ) { }
  ngOnInit() {
    this.getAllIntakeList(this.data.id);
  }
  intakeForm(intakedata): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      width: '100vw',
      height: '100vh',
      autoFocus: false,
      data: { type: "new", intakedata: intakedata, secBtn: false }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getAllIntakeList(id) {
    this.spinner.show();
    this._service.get(`${INTAKE}?client=${id}`).subscribe(res => {
      this.spinner.hide();
      this.intakeList = res.result;
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
  getIntakeId(intakeId) {
    this._service.get(`${INTAKE}?intake=${intakeId}`).subscribe(res => {
      this.intakeForm(res);
      this.dialogRef.close({
      })
    }, err => {
    })
  }
}
