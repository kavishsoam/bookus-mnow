import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { SETUP } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-staff-notifications',
  templateUrl: './staff-notifications.component.html',
  styleUrls: ['./staff-notifications.component.scss']
})
export class StaffNotificationsComponent implements OnInit {
  staffNotificationsForm: FormGroup;
  ifToggleOn: boolean;
  loader: boolean = false;

  constructor(private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService
  ) { }
  pageHeader: Object = { header: " Staff notifications", main: "Setup", navigate: true }
  ngOnInit() {
    this.getStaffNotifications();
    this.staffNotificationsForm = this._formBuilder.group({
      // enableStaffNotify: [''],
      sendToStaff: [''],
      sendToSpecific: [''],
      specificMailId: [''],
    });
    this.setPageHeader()
  }
  showMenu(e) {
    this.ifToggleOn = !this.ifToggleOn
  }
  staffNotifications(form) {
    form.invalid ? this.loader = false : this.loader = true;
    this._service.put(`${SETUP}setting?staff_notify=true`, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Staff Notifications updated' });
      this.loader = false
    }, err => {
      this.loader = false
      this._toast.add({ severity: 'error', summary: 'Staff Notifications not updated' });
    })
  }
  getStaffNotifications() {
    this._service.get(`${SETUP}staffNotify`).subscribe(res => {
      this.patchStaffNotifications(res.result)
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  patchStaffNotifications(data) {
    this.staffNotificationsForm.patchValue({
      // enableStaffNotify: data.enableStaffNotify,
      sendToStaff: data.sendToStaff,
      sendToSpecific: data.sendToSpecific,
      specificMailId: data.specificMailId,
    })
  }
}
