import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, ApplicationRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PreviewComponent } from 'app/main/setup/client-settings/modal/preview/preview.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-client-notif',
  templateUrl: './client-notif.component.html',
  styleUrls: ['./client-notif.component.scss']
})
export class ClientNotifComponent implements OnInit {
  @Input() tabType: string;
  notify: FormGroup;
  isDisableField: boolean = true;
  tabLabel: any = "Reminder";
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private cd: ApplicationRef,
    private _toast: MessageService,
    private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.notify = this.fb.group({
      enableReminder: [false],
      sendBy: [''],
      remiderAdvance: [''],
      emailSubject: [''],
      emailTemplate: [''],
    });
  }
  onSubmitNotify(form) {
    this.spinner.show()
    setTimeout(() => {
      // this.spinner.hide()
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: "Saved" });
    }, 1000)

  }
  previousMsg() {
    this.spinner.show()
    setTimeout(() => {
      // this.spinner.hide()
      this.openPreview();
    }, 1000)
  }
  fetchRequiredApi(type) {
    this.tabLabel = type;
    if (type != "REMINDERS" && type != 'BIRTHDAY') {
      this.isDisableField = false;
      this.ref.detectChanges();
      this.cd.tick();
    }
    else {
      this.isDisableField = true;
      this.ref.detectChanges();
      this.cd.tick();
    }
    this.ref.detectChanges();
    this.cd.tick();
  }

  openPreview(): void {
    const dialogRef = this.dialog.open(PreviewComponent, {
      width: '650px',
      data: { tabType: this.tabType }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
