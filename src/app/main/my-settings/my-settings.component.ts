import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EMAIL_PAT } from 'app/services/pattern';
import { FuseConfigService } from '@fuse/services/config.service';
import { ApiService } from 'app/services/api.service';
import { MYSETTINGS, PROFILE } from 'app/services/url';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.scss']
})
export class MySettingsComponent implements OnInit {
  mySettingsForm: FormGroup;
  _id: any;
  id: any;
  data: any;
  phone_invalid: boolean = true;
  countryStr: string = "au"
  countryCode: string = "61"
  phoneNumber: any;
  phoneDis: boolean;
  constructor(
    private _formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private _toast: MessageService,
    private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
  ) { }
  pageHeader: Object = { header: "My settings", navigate: false }
  @ViewChild('telInput')
  telInput: any;
  ngOnInit() {
    this.setPageHeader();
    this.countryStr = localStorage.getItem("CountryCode") ? localStorage.getItem("CountryCode") : "au";
    this.countryCode = localStorage.getItem("countrycode");
    this.mySettingsForm = this._formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: [''],
      email: ['', Validators.compose([Validators.pattern(EMAIL_PAT)])],
      phone: [''],
      current_pass: [''],
      new_pass: [''],
      confirm_pass: ['', [confirmPasswordValidator]],
    })
    this.getOwnerInfo();
  }
  getOwnerInfo() {
    var id = localStorage.getItem('id');
    localStorage.getItem('id')
    this._service.get(`${MYSETTINGS}/${id}`).subscribe(res => {
      this.fillOwnerInfo(res);
    }, err => {
    })
  }
  fillOwnerInfo(res) {
    if (res && res.phone) {
      this.phoneNumber = res.phone;
    }
    if (res && res.countryCode) {
      this.countryCode = res.countryCode;
    }
    if (res && res.countryStr) {
      this.countryStr = res.countryStr
      this.cdRef.detectChanges();
    }
    this.phoneDis = true;
    this.mySettingsForm.patchValue({
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      phone: res.phone,
    })
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  mySettings(form) {
    if (form.invalid || !this.phone_invalid) {
      return;
    }
    if (!form.value.new_pass) {
      delete form.value.new_pass
      delete form.value.current_pass
    }
    form.value.phone = this.phoneNumber;
    form.value.countryStr = this.countryStr;
    form.value.countryCode = this.countryCode;
    this._service.put(PROFILE, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
    }), err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    }
  }
  onCountryChange(e) {
    this.countryStr = e.iso2;
    this.countryCode = e.dialCode;
  }
  telInputObject(e) {
  }
  getNumber(e) {
  }
  hasError(e) {
    this.phone_invalid = e;
    // when it return fasle => thats mean it has error.
  }
  telInputChange(e) {
    if (this.telInput.nativeElement.value == `+${this.countryCode} ` && e.keyCode === 8) return false
  }
  ngAfterViewInit(): void {
    if (this.telInput && this.telInput.nativeElement) {
      this.telInput.nativeElement.value = `+${this.countryCode} `
    }
  }
  ngAfterViewChecked() {
    if (this.telInput && !this.telInput.nativeElement.value) this.telInput.nativeElement.value = `+${this.countryCode} `
    this.cdRef.detectChanges();
  }
}
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const password = control.parent.get('new_pass');
  const passwordConfirm = control.parent.get('confirm_pass');
  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }
  return { 'passwordsNotMatching': true };
};
