import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { COMPANY_DETAILS } from 'app/services/url';
import { currencies, countries } from 'app/services/utilites'
import { MessageService } from 'primeng/api';
import * as momentTZ from 'moment-timezone';
import { businessType, allCountries } from 'app/services/utilites';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ImageCompressService } from 'ng2-image-compress';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-business',
  templateUrl: './new-business.component.html',
  styleUrls: ['./new-business.component.scss']
})
export class NewBusinessComponent implements OnInit {
  companyDetailsForm: FormGroup;
  _id: any;
  currencyArray: any = currencies;
  countryArray: any = countries;
  timeZoneArray: any = [];
  loader: boolean = false;
  businessTypeArray = businessType;
  profileUrl: any;
  timeFormatArray = [
    { value: '12hours', viewValue: '12-hours (e.g. 9:00pm)' },
    { value: '24hours', viewValue: '24-hours (e.g. 21:00)' },
  ];
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _toast: MessageService,
    private _service: ApiService,
    private spinner: NgxSpinnerService,
    private imgCompressService: ImageCompressService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewBusinessComponent>,

    // private sanitizer: DomSanitizer
  ) { }
  pageHeader: Object = { header: " Company Details", main: "Setup", navigate: true }
  ngOnInit() {
      // this.getAllCompanyDetails()
      // this.setPageHeader()
    this.companyDetailsForm = this._formBuilder.group({
      businessName: [''],
      businessType: [''],
      country: [''],
      timezone: [''],
      currency: [''],
      address: [''],
      description: [''],
      phone: [''],
      timeFormat: [''],
      website: [''],
    });
    let timezoneArr = momentTZ.tz.names()
    for (let i in timezoneArr) {
      this.timeZoneArray.push(`(GMT${momentTZ.tz(timezoneArr[i]).format('Z')}) ${timezoneArr[i]}`);
    }
    this.timeZoneArray = this.timeZoneArray.sort();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  findCountryCode() {
    var country = localStorage.getItem('country');
    let countryList = []
    countryList = allCountries;
    var final = countryList.filter(item => {
      if ((item[0].toLowerCase().indexOf(country.toLowerCase()) > -1))
        return item;
    })
    if (final.length > 0) {
      if (final.length == 1) {
        localStorage.setItem('CountryCode', final[0][1]);
        localStorage.setItem('countrycode', final[0][2]);
      }
      else {
        final.sort((it1, it2) => {
          return it1[0].length - it2[0].length
        })
        localStorage.setItem('CountryCode', final[0][1]);
        localStorage.setItem('countrycode', final[0][2]);
      }
    }
  }
  getAllCompanyDetails() {

    this.spinner.show();
    this._service.get(COMPANY_DETAILS).subscribe(res => {
      this.setCompanyDetails(res[0]);
      this.spinner.hide();
    }), err => {
      this.spinner.hide();
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    }
  }
  companyDetails(companyDetailsForm) {
    companyDetailsForm.invalid ? this.loader = false : this.loader = true;
    companyDetailsForm.value.logo = this.profileUrl;
    companyDetailsForm.value.businessName = _.startCase(_.toLower(companyDetailsForm.value.businessName));


    this._service.put(`${COMPANY_DETAILS}/${this._id}`, companyDetailsForm.value).subscribe(res => {
      localStorage.setItem("currency", res.result.currency);
      localStorage.setItem("country", res.result.country);
      this.findCountryCode();

      this.loader = false
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
    }, err => {
      this.loader = false
    })
  }
  setCompanyDetails(value) {
    this._id = value._id
    this.companyDetailsForm.patchValue({
      businessName: value.businessName,
      businessType: value.businessType,
      country: value.country,
      timezone: value.timezone,
      currency: value.currency,
      address: value.address,
      description: value.description,
      phone: value.phone,
      timeFormat: value.timeFormat,
      website: value.website,
    })
    if (value.logo) {
      this.profileUrl = `${value.logo.prefix},${value.logo.data}`;
    }
  }
  filechangeProfile(event: any) {    
    let files = event.target.files;
    ImageCompressService.filesToCompressedImageSource(files).then(observableImages => {
      observableImages.subscribe((image) => {     
      this.profileUrl = (image.compressedImage.imageDataUrl);
      }, (error) => {
        //("Error while converting");
      }, () => {
      });
    });
  }
  removeImage() {
    this.profileUrl = undefined;
  }



  public getSantizeUrl(url: string) {
    return url
    // return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
