import { Component, OnInit } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { enableRipple } from '@syncfusion/ej2-base';
import { CALENDAR_SETTINGS } from '../../../services/url'
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import {MatDialogRef} from '@angular/material/dialog'
@Component({
  selector: 'app-calendar-setting-modal',
  templateUrl: './calendar-setting-modal.component.html',
  styleUrls: ['./calendar-setting-modal.component.scss']
})
export class CalendarSettingModalComponent implements OnInit {
  calendarSettingsForm: FormGroup;
  calendarSettings: boolean;
  time = [
    { value: '5', viewValue: '5 Minutes' },
    { value: '10', viewValue: '10 Minutes' },
    { value: '15', viewValue: '15 Minutes' },
    { value: '30', viewValue: '30 Minutes' },
    { value: '60', viewValue: '1 hour' },
    { value: '90', viewValue: '1 hour 30 Minutes' },
    { value: '120', viewValue: '2 hours' }
  ];
  color = [
    { value: 'By booking status', viewValue: 'By booking status' },
    { value: 'By service group', viewValue: 'By service group' },
    { value: 'By staff booked', viewValue: 'By staff booked' }
  ];
  default = [
    { value: 'Day', viewValue: 'Day' },
    { value: 'Week', viewValue: 'Week' },
  ];
  week = [
    { value: '0', viewValue: 'Sunday' },
    { value: '1', viewValue: 'Monday' },
    { value: '2', viewValue: 'Tuesday' },
    { value: '3', viewValue: 'Wednesday' },
    { value: '4', viewValue: 'Thursday' },
    { value: '5', viewValue: 'Friday' },
    { value: '6', viewValue: 'Saturday' },
  ];
  loader: boolean = false;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService,
    private dialogRef:MatDialogRef<CalendarSettingModalComponent>
  ) { }
  pageHeader: Object = { header: " Calendar Settings", main: "Setup", navigate: true }
  ngOnInit() {
    this.calendarSettings = false
    this.spinner.show();
    this.calendarSettingsForm = this._formBuilder.group({
      appoinment_col_preference: [''],
      time_interval: [''],
      default_view: [''],
      week_start_day: [''],
      startHour: [''],
      endHour: ['']
    });
    this.getCalendarSettings()
    this.setPageHeader()
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  updateCalendarSettings(form) {
    form.invalid ? this.loader = false : this.loader = true;
    let data = form.value
    this._service.put(CALENDAR_SETTINGS, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: 'Calendar settings updated' });
      this.loader = false
      localStorage.setItem('calendarSettings', JSON.stringify(res.result))
        this.dialogRef.close()
    }, err => {
      this.loader = false
      this.dialogRef.close()

      this._toast.add({ severity: 'error', summary: 'Service Message', detail: 'Calendar settings update failed' });
    })
  }
  getCalendarSettings() {
    this._service.get(`${CALENDAR_SETTINGS}`).subscribe(res => {
      this.patchCalendarSettings(res)
      this.calendarSettings = true;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }
  patchCalendarSettings(data) {
    this.calendarSettingsForm.patchValue({
      appoinment_col_preference: data.appoinment_col_preference,
      time_interval: data.time_interval,
      default_view: data.default_view,
      week_start_day: data.week_start_day,
      startHour: data.startHour,
      endHour: data.endHour
    })
  }

  get endHourMin() {
    
  let time =  this.calendarSettingsForm.value.startHour
  return   moment(time).add(2, 'hours').toDate(); 
  }

  onClick(){
    this.dialogRef.close()
  }

}
