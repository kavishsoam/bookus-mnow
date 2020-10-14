import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageUploaderOptions } from 'ngx-image-uploader';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-familyandfriend',
  templateUrl: './familyandfriend.component.html',
  styleUrls: ['./familyandfriend.component.scss']
})
export class FamilyandfriendComponent implements OnInit {

  @ViewChild('telInput')
  telInput: any;
  imageOptions: ImageUploaderOptions = {
    uploadUrl: 'https://fancy-image-uploader-demo.azurewebsites.net/api/demo/upload',
    cropEnabled: false,
    thumbnailResizeMode: 'fill',
    autoUpload: false,
    resizeOnLoad: true,
    thumbnailWidth: 150,
    thumbnailHeight: 145
  };
  countryStr: any;
  countryCode: any;
  phoneNumber: any;
  phone_invalid: boolean = true;
  familyAndFriendsForm : any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<FamilyandfriendComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder : FormBuilder,
    private _service : ApiService,
    private _toast: MessageService,
    private spinner : NgxSpinnerService
    
  ) { 
    this.familyAndFriendsForm = this.formBuilder.group({
      relationship :  new FormControl('', [Validators.required]),
      firstName :  new FormControl('', [Validators.required]),
      lastName :  new FormControl(''),
      email:  new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      phone :  new FormControl(''),
      gender :  new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.telInput
    this.countryStr = localStorage.getItem("CountryCode") ? localStorage.getItem("CountryCode") : "au";
    this.countryCode = localStorage.getItem("countrycode");

  }

  gender = [ 
    {
      viewValue : 'Male',
      value : 'Male'
    },
    {
      viewValue : 'Female',
      value : 'Female'
    },
    {
      viewValue : 'Others',
      value : 'Unknown'
    }]

    closeModal() {
      this.dialogRef.close();
    }

    saveDetails() {
      console.log('details to be saved');
    }

    telInputChange(e) {
      if (this.telInput.nativeElement.value == `+${this.countryCode} ` && e.keyCode === 8) return false
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
    if (!e) this.familyAndFriendsForm.controls.phone1.setErrors({ 'invalid': true });
    else this.familyAndFriendsForm.controls.phone1.setErrors(null);
    // when it return false => mean it has error.
  }

    familyAndFriendsFormSubmit(formData) {
      this.dialogRef.close();
  console.log(formData);
    this.submitFandFData(formData.value);
    }

    submitFandFData(form) {
      //
      // form.phone = this.phoneNumber && this.phoneNumber.split(this.countryCode)
      form.phone = this.phoneNumber;
      let postData = {};
      postData['id'] = this.data._id;
      postData['relations'] = [form];
        this.spinner.show();
      this._service.post('client/relations',postData).subscribe(res=> {
        console.log(res);
        this._toast.add({ severity: "success",summary: "family & Friends Sharing",detail: "Successfully added a (Family & Friends)member of the client" });
        setTimeout(() => {
          this.spinner.hide();          
        }, 1000);
      },err=> {
        setTimeout(() => {
          this.spinner.hide();
          this._toast.add({ severity: "error",summary: "family & Friends Sharing",detail: "Something went wrong." });
        }, 1000);
        console.log(err);
      })
    }

}
