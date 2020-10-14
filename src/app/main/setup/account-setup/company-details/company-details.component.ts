import { Component, OnInit } from '@angular/core';
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
import { Translator } from 'app/services/translator';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
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
  message: string;
  imagePath: any;
  imgURL: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _toast: MessageService,
    private _service: ApiService,
    private spinner: NgxSpinnerService,
    private imgCompressService: ImageCompressService,
    public translator : Translator

    // private sanitizer: DomSanitizer
  ) { }
  pageHeader: Object = { header: " Company Details", main: "Setup", navigate: true }
  ngOnInit() {
    this.getAllCompanyDetails()
    this.setPageHeader()
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
      logo : ['']
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

    if (this.imagePath) {
      const formData: any = new FormData();
    formData.append('photos', this.imagePath[0]);
    this._service.postImage('assets/uploadImages',formData).subscribe(res => {
      if (!companyDetailsForm.value.logo) {
        companyDetailsForm.value.logo = "";
      }
      companyDetailsForm.value.logo= companyDetailsForm.value.logo = this.translator.imageProductTranslator(res['result'][0])
      this.updateCompanyWithImage(companyDetailsForm);
    }, rej => {
      console.log("rej", rej);
    });
  } else {
    companyDetailsForm.value.logo = this.imgURL;
    this.updateCompanyWithImage(companyDetailsForm);
  }
  }

  updateCompanyWithImage(form) {

    this._service.put(`${COMPANY_DETAILS}/${this._id}`, form.value).subscribe(res => {
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
      this.imgURL = value.logo;
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
    this.imgURL = undefined;
  }



  public getSantizeUrl(url: string) {
    return url
    // return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  preview(event) {


    // let reader = new FileReader(); // HTML5 FileReader API
    // let file = event.target.files[0];
    // if (event.target.files && event.target.files[0]) {
    //   reader.readAsDataURL(file);

    //   // When file uploads set it to file formcontrol
    //   reader.onload = () => {
    //     this.imageUrl = reader.result;
    //     this.registrationForm.patchValue({
    //       file: reader.result
    //     });
    //     this.editFile = false;
    //     this.removeUpload = true;
    //   }
    //   // ChangeDetectorRef since file is loading outside the zone
    //   this.cd.markForCheck();        
    // }




    if (event.target.files.length === 0) {
      return;
    }
    let mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    let reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  

}
