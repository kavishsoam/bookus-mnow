import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STAMP, COMP } from '../../../../services/url'
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-loyalty-rewards',
  templateUrl: './loyalty-rewards.component.html',
  styleUrls: ['./loyalty-rewards.component.scss']
})
export class LoyaltyRewardsComponent implements OnInit {
  stampSetting: FormGroup;
  isFormInvalid: boolean;
  constructor(private _fuseConfigService: FuseConfigService,
    private fb: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService, ) { }
  pageHeader: Object = { header: " Loyalty Rewards", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.stampSetting = this.fb.group({
      stampValue: ['', Validators.required],
      serviceStampValue: ['', Validators.required],
      stampServiceDuration: ['', Validators.required]
    });
    this.getStampSetting();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  onSubmitStampSett(form) {
    this.isFormInvalid = false;
    if (form.invalid) {
      this.isFormInvalid = true;
      return
    }
    this._service.put(`${STAMP}`, form.value).subscribe(res => {

      this._toast.add({ severity: 'success', summary: 'Service Message', detail: "Stamp setting updated" });
    }, err => {

      this._toast.add({ severity: 'error', summary: 'Service Message', detail: "Stamp setting update failed" });
    })
  }
  getErrorStamp() {
    return this.stampSetting.controls.stampValue.hasError('required') ? 'Stamp is required' : '';
  }
  getErrorService() {
    return this.stampSetting.controls.serviceStampValue.hasError('required') ? 'Service Stamp is required' : '';
  }
  getErrorDuration() {
    return this.stampSetting.controls.stampServiceDuration.hasError('required') ? 'Duration is required' : '';
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getStampSetting() {
    this._service.get(`${COMP}`).subscribe(res => {

      this.stampSetting.patchValue({
        stampValue: res.result.stampValue,
        serviceStampValue: res.result.serviceStampValue,
        stampServiceDuration: res.result.stampServiceDuration
      })
    }, err => {

    })
  }
}
