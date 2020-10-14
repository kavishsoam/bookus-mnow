import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, NgZone, Input, SimpleChanges } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { LOCATION, LOCLIST } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { EMAIL_PAT } from 'app/services/pattern';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageCompressService } from 'ng2-image-compress';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  rowSelected: boolean = false;
  locationsForms: FormGroup;
  dataSource = [];
  displayedColumns: string[] = ['locationname', 'address'];
  phoneNumber: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
    private _toast: MessageService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router : Router
    ) { }
  pageHeader: Object = { header: " Locations", main: "Setup", navigate: true }
  ngOnInit() {
    this.getAllLocations()
    this.setPageHeader()
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  openDialog(): void {
    this.rowSelected = false;
    this.router.navigate([`/main/setup/locations/${'newLocation'}`]);
    // const dialogRef = this.dialog.open(EditLocations, {
    //   width: '576px',
    //   autoFocus: false,
    //   data: { isvisible: this.rowSelected, header: "Add Location", }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.type) {
    //     if (result.type == 'refresh') {
    //       this.getAllLocations();
    //     }
    //   }
    // });
  }

  locationSelect(row) {
    this.rowSelected = true;
    this.router.navigate([`/main/setup/locations/${row._id}`]);
    // const dialogRef = this.dialog.open(EditLocations, {
    //   width: '576px',
      // height: '100%',
    //   autoFocus: false,
    //   data: { isvisible: this.rowSelected, header: "Edit Location", locations: row, locList: this.dataSource.length }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.type) {
    //     if (result.type == 'refresh') {
    //       this.getAllLocations();
    //     }
    //   }
    // });
  }

  //location timing update new by kavish -----++++++++++++++++++++++++++++++++++++++++++++++++
  timeSetupButton(e) {
    // console.log('setup time ===>>>',e);
    // const dialogRef = this.dialog.open(LocationTimingComponent, {
    //   width: '100%',
    //   autoFocus : false,
    //   data : {isvisible: this.rowSelected, header: "Edit Location Time", locList: this.dataSource.length}
    // });
    // dialogRef.afterClosed().subscribe(result=>{
    //   console.log(result);
    // })
  }

  //location timing update new By Kavish ----------+++++++++++++++++++++++++++++++++++++++++++++

  getAllLocations() {
    this.spinner.show();
    this._service.get(LOCATION).subscribe(res => {
      this.dataSource = res;
      this.spinner.hide();
      this.dataSource.map(data => {
        data.address = [data.building, data.street, data.city, data.state, data.country, data.zip, data.timeOffset];
        data.address = data.address.filter(Boolean).join(', ');
        return data;
      })
    }), err => {
      this.spinner.hide();
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    }
  }
}

import { amenity } from '../../../../services/utilites';
import { payment } from '../../../../services/utilites';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { Translator } from 'app/services/translator';
import { Router } from '@angular/router';
// import { LocationTimingComponent } from './location-timing/location-timing.component';
// import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'editLocation',
  templateUrl: 'editLocations.html',
  styleUrls: ['./editLocations.scss']
})
export class EditLocations implements OnInit {
  rowSelected: boolean;
  isDeletePrompt: boolean;
  addLocationForm: FormGroup;
  _id: any;
  phoneNumber: any;
  phone_invalid: boolean = true;
  countryStr: string = 'au';
  countryCode: string = "61";
  loader: boolean = false;
  @ViewChild('telInput')
  telInput: any;
  filesToUpload: Array<File> = [];
  profileUrl = new Array<any>();
  amenity: any = [];
  payment: any = [];
  filesArray : any = [];
  urls : any = [];
  points = [
    {
      checked: false,
      viewValue: 'Gift Card',
      name: 'giftCard'
    },
    {
      checked: false,
      viewValue: 'Points',
      name: 'points'
    },
    {
      checked: false,
      viewValue: 'Cash',
      name: 'cash'
    },
    {
      checked: false,
      viewValue: 'Zip Pay',
      name: 'zipPay'
    },
    {
      checked: false,
      viewValue: 'After Pay',
      name:'afterPay'
    },
    {
      checked: false,
      viewValue: 'Others',
      name:'others'
    }
  ]

  //     giftCard: Boolean,
//     points: Boolean,
//     afterPay: Boolean,
//     others: Boolean,
//     cash: Boolean,
//     zipPay: Boolean

// ********************
//? 1) 5 images upload     
//?  2) Facilities icon + name
//?  3) Payment icon + name

//! Create
//! Update

  //address of googlemap
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  addrSel: boolean = true;
  locationImage: any = 'http://18.216.120.11:8080/uploads/9badc529dc96870c944b64b271ce5f44';
  categoryData: any = [];
  categoryCollection: any = [];
  message: string;
  imagePath: any;  
  imgURL:any = '';
  imageFiles: any;
  imgData: any = [];
  facilitesRes: any = [];
  paymentRes: any = [];

  constructor(
    // public dialogRef: MatDialogRef<EditLocations>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private zone: NgZone,
    private imgCompressService: ImageCompressService,
    private translator : Translator,
    private router : Router
    // private sanitizer: DomSanitizer
  ) { }
  
  ConfirmDelLocation() {
    this.isDeletePrompt = !this.isDeletePrompt;
    if (!this.ConfirmDelLocation) {
      // this.dialogRef.updateSize('600px', '500px');
    }
    else {
      // this.dialogRef.updateSize('600px', '215px');
    }
  }

  @Input() locationDetails : any;
  ngOnInit() {
    this.getCategoryList();
    this.countryCode = localStorage.getItem("countrycode");
    let a = _.cloneDeep(amenity);
    this.amenity = a;

    let b = _.cloneDeep(payment);
    this.payment = b;

    this.addLocationForm = this._formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      phone: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_PAT)])],
      categoryId: [''],
      street: ['', Validators.required],
      building: [''],
      city: [''],
      state: [''],
      zip: [''],
      profileImg: [''],
      loyaltyPoints : [''],
      onlineBooking: [''],
      descriptions: [''],
      geo_location: [''],
      timeOffset : [''],
      facilities : [''],
      payment : ['']
    });
    // this.rowSelected = this.data.isvisible;
    // if (this.data.header == "Edit Location") {
    //   this.setLocationData(this.data.locations);
    // }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.locationDetails){
            this.setLocationData(this.locationDetails);
    }
  }


  async addLocation(form) {
    this.loader = true;
    if (form.invalid || this.addrSel || !this.phone_invalid) {
      this.loader = false;
      return;
    }

    form.value.facilities =  this.facilityFormat();  //! create facilities blob
    form.value.loyaltyPoints =  this.loyaltypoints(); //! create loyality points blob
    form.value.payment =  this.paymentList(); //! create payment blob 
    // form.value.profileImg = [ this.locationImage ];
    form.value.phone = this.phoneNumber;
    form.value.countryStr = this.countryStr;
    form.value.countryCode = this.countryCode;
    if (this._id) {
      setTimeout(() => {
        form.value.facilities = this.facilitesRes;
        form.value.payment = this.paymentRes;
        this.updateLocation(form.value);        
      }, 1500);
    }
    else {
      form.value.onlineBooking = form.value.onlineBooking || false

      if (this.filesArray.length) {
        const formData: any = new FormData();
        this.imageFiles = this.filesArray;
        for (let i = 0; i < this.imageFiles.length; i++) {
          formData.append('photos', this.imageFiles[i]);
        }
      //   const formData: any = new FormData();
      // formData.append('photos', this.imagePath[0]);
      this._service.postImage('assets/uploadImages',formData).subscribe(res => {
        let data = [];
        if (!form.value.profileImg) {
          form.value.profileImg = [];
        }
        if(res['result'].length){
          res['result'].forEach(element => {
            data.push({ img : this.translator.imageProductTranslator(element), verified : false })
            // form.value.profileImg.push({ img : this.translator.imageProductTranslator(element), verified : false })
          });
          form.value.profileImg = data;

        }
        //  form.value.profileImg = [ {
        //    img : this.translator.imageProductTranslator(res['result'][0]),
        //   verified : false
        // }]
        setTimeout(() => {
          form.value.facilities = this.facilitesRes;
          form.value.payment = this.paymentRes;
          this.createLocationWithImage(form);      
        }, 1500);
      }, rej => {
        console.log("rej", rej);
      });
    } else {
      form.value.profileImg = [];
          //     {
    //     img : this.imgURL,
    //    verified : false
    //  }
    setTimeout(() => {
      form.value.facilities = this.facilitesRes;
      form.value.payment = this.paymentRes;
      this.createLocationWithImage(form);      
    }, 1600);
    }


    }
  }


  createLocationWithImage(form){
    this._service.post(LOCATION, form.value).subscribe(res => {
      this.loader = false;
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.router.navigateByUrl('main/setup/locations');
    }), err => {
      if(err['status'] == 400){
          console.log('error')
          this.loader = false;
          this._toast.add({ severity: 'error', summary: 'error Message', detail: err['error'] });
      }
      setTimeout(() => {
        this.router.navigateByUrl('main/setup/locations');
      }, 200);
      console.log(err);
      this.loader = false;
      this._toast.add({ severity: 'error', summary: 'error Message', detail: err['error'] });
    }
  }


   updateLocation(form) {

    if (this.filesArray.length > 0) {
      const formData: any = new FormData();
        this.imageFiles = this.filesArray;
        for (let i = 0; i < this.imageFiles.length; i++) {
          formData.append('photos', this.imageFiles[i]);
        }
    this._service.postImage('assets/uploadImages',formData).subscribe(res => {
      
      let data : any = [];
      if (!form.profileImg) {
        form.profileImg = [];
      }
      if(res['result'].length){
        res['result'].forEach(element => {
          data.push({ img : this.translator.imageProductTranslator(element), verified : false })
        });
        // if(form.value.profileImg.length + data.length < 5)
        form.profileImg = [...form.profileImg, ...data];
        this.updateLocationWithImage(form);
      }  
    }, rej => {
      console.log("rej", rej);
    });
  } else {
    form.profileImg = this.imgData;

   setTimeout(() => {
    this.updateLocationWithImage(form);     
   }, 1000);
  }

  }

  updateLocationWithImage(data) {
    
    this._service.put(`${LOCATION}/${this._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.router.navigateByUrl('main/setup/locations');
      this._id = undefined;
      // this.dialogRef.close({ type: 'refresh' })
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
      setTimeout(() => {
        this.router.navigateByUrl('main/setup/locations');
      }, 200);
    })
  }


  deleteLocation() {
    this._service.delete(`${LOCATION}/${this._id}`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this.router.navigateByUrl('main/setup/locations');
      // this.dialogRef.close({
      //   type: 'refresh'
      // })
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }

  setLocationData(value) {
    this._id = value._id;
    this.addLocationForm.patchValue({
      name: value.name,
      phone: value.phone,
      email: value.email,
      categoryId: value.categoryId,
      street: value.street,
      building: value.building,
      city: value.city,
      state: value.state,
      zip: value.zip,
      profileImg : value.profileImg,
      onlineBooking: value.onlineBooking,
      descriptions: value.descriptions,
      geo_location: value.geo_location,
      timeOffset : (value && value.timeOffset) ? value.timeOffset : ''
    })
    if(value && value.profileImg.length) {
      this.imgData = JSON.parse(JSON.stringify((value.profileImg)))  //! profile image
      this.urls = this.imgData.map(e=>{
        return e.img
      })
    }else{
      this.imgData = [];
      this.urls = []
    }

    if (value.geo_location && value.geo_location.coordinates) {
      this.addrSel = false;
    }
    // if (value.profileImg) {
     //   this.profileUrl = [];
    //   this.imgURL = value.profileImg;
    //   // value.profileImg.forEach(ele => {
    //   //   this.profileUrl.push(`${ele.prefix},${ele.data}`)
    //   // });
    // }

    if(value.payment && value.payment.length) {
      this.paymentAutoPatch(value.payment);
    }

    if (value.facilities && value.facilities.length) {
      this.facilityAutoPatch(value.facilities)
    }

    if(value.loyaltyPoints) {
      this.loyalityPointsAutoPatch(value.loyaltyPoints)
    }
    if (value && value.phone) {
      this.phoneNumber = value.phone;
    }
    if (value && value.countryStr) {
      this.countryStr = value.countryStr;
    }
    if (value && value.countryCode) {
      this.countryCode = value.countryCode;
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
    if (!this.telInput.nativeElement.value) this.telInput.nativeElement.value = `+${this.countryCode} `
    this.cdRef.detectChanges();
  }
  //file change event 



  imageUrlGenerator(data) {
    let imageUrl : any;
    imageUrl = data.result[0];
    this.locationImage = this._service.imageUrl + imageUrl;
  //   this._service.viewImage(imageUrl).subscribe(res=>{
  // console.log(res);
  // this.locationImage = res;
  //   },err=>{
  //   console.log(err);
  //   })
  }

  onCancelClick() {
  }

  removeImage(item, imageType) {
    if (imageType == 'profileUrl') {
      this.profileUrl.filter((ele, index) => {
        if (ele == item) {
          this.profileUrl.splice(index, 1);
        }
      })
    }
  }

  facilitySelect(e, item) {
    if (e.checked) {
      item.selected = e.checked;
      // this.uploadFacilitesImage(item);
    } else {
      item.selected = e.checked;
    }
    //
  }


  pointSelect(e,item) {
    if (e.checked) {
      item.checked = e.checked;
    } else {
      item.selected = e.checked;
    }
  }

  loyaltypoints(){
    let loyalObj =   {
      'giftCard': Boolean,
          'points': Boolean,
          'afterPay': Boolean,
          'others': Boolean,
          'cash': Boolean,
          'zipPay': Boolean
    }     
    this.points.forEach(item=>{
        loyalObj[item.name] = item.checked;
    })
    return loyalObj;
  }



   facilityFormat() {
    let facilities = []
    this.amenity.map(item => {
      if (item.selected) {
        facilities.push({
          icon: item.base,
          blob : this.getFileTypeBlob(item.base,''),
          // blob : this.changeBase64(item.base.split(',')[1],'image/png'),
          name: item.name
        })
      }
    })
    let feat : any;
    this.uploadFacilitiesImg(facilities).then(res => {
      console.log('imgArr ==>',res);
      feat = res;
      console.log('feat ==>',feat);
      return feat;
    }).catch(err => {
      console.log('imgArr_Err ==>',err);
    })
  }


   uploadFacilitiesImg(filesArray) {
     return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      filesArray.forEach(element => {
        formData.append('photos', element.blob)
      });
  this._service.postImage('assets/uploadImages', formData).subscribe(res => {
    console.log(res);
    let arr3: any = [];
    arr3 =  filesArray.map((item, i) => Object.assign({}, { name: item.name, icon: this.translator.newImageTranslator(res['result'][i])}));
    // res['result'].forEach(element => {
    //   data.push({  img : this.translator.imageProductTranslator(element), verified : false })
    // });
    console.log(arr3);
    if(arr3){
      this.facilitesRes = arr3
      resolve (arr3);
    }
  }, err => {
    console.log(err);
    reject (false);
  })
     })

  }

  facilityAutoPatch(facility) {
    facility.forEach(ele => {
      this.amenity.forEach(item => {
        if (item.name == ele.name) {
          item.isUploaded = true;
          item.selected = true;
        }
      })
    });
  }

  loyalityPointsAutoPatch(pts) {
    this.points.forEach(item=>{
     if(pts[item.name]){
       item.checked = pts[item.name];
     } 
    })
  }

  setAddress(addrObj) {
    //We are wrapping this in a NgZone to reflect the changes
    //to the object in the DOM.
    if (addrObj.locality)
      this.addLocationForm.get('city').setValue(addrObj.locality);

    if (addrObj.postal_code)
      this.addLocationForm.get('zip').setValue(addrObj.postal_code);

    if (addrObj.admin_area_l1)
      this.addLocationForm.get('state').setValue(addrObj.admin_area_l1);

      if(addrObj.utc_offset)
      this.addLocationForm.get('timeOffset').setValue(addrObj.utc_offset);

    if (addrObj.geo_location) {
      this.addrSel = false;
      this.addLocationForm.get('geo_location').setValue(addrObj.geo_location);
    } else {
      this.addrSel = true;
    }



    if (addrObj.formatted_address)
      this.addLocationForm.get('street').setValue(addrObj.formatted_address);

    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }
  get f() { return this.addLocationForm.controls; }

  OnAddrChg(e) {
    if (e == "") { this.addrSel = true }
  }
  public getSantizeUrl(url: string) {
    return url;;
    // return this.sanitizer.bypassSecurityTrustUrl(url);
  }



  getCategoryList() {
    this._service.get('category').subscribe(res=>{
      let categoryList : any = [];
       categoryList = localStorage.getItem('categoryList').split(',');
      let data = [];
        let category = [];
        category = res.result;
        category.forEach(element => {
            element.category.forEach(innerEle => {
              categoryList.forEach(id => {
                if(innerEle.language == 'english' && element._id == id)
                data.push({id: element._id, name: innerEle.name });
              });
            });
        });
        this.categoryData = data;
        console.log('category data ===>>>',this.categoryData);
    },err=>{
        console.log(err);
    })
}

catSelectedListener(data) {
  this.categoryCollection = data;
}

preview(event) {

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



removeSelectedImg(index) {
  this.urls.splice(index, 1);
  this.filesArray.splice(index, 1);
}

detectFiles(event) {
  if (event.target.files.length === 0 && event.target.files.length < 5) {
    return;
  }

  const files = event.target.files;
  if (files) {
    for (const file of files) {
      if(files.length < 5)
      this.filesArray.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if(this.urls.length < 5)
        this.urls.push(e.target.result);
       else
        this._toast.add({ severity: 'error', summary: 'Upload Message', detail: 'Maximum 5 images can be uploaded' });
      };
      reader.readAsDataURL(file);
    }
  }
  console.log(this.urls)
}


getFileTypeBlob(d, imageFileFormat) {
  let file : any;
  let phase1 = d.split(',')[0];
  let phase2 = phase1.split(';')[0];
  let type = phase2.split(':')[1]
  let blob = this.dataURItoBlob(d);
  file = new File([blob], `${this.randomNameGenerator()}.png`, { type: type });
  return file;
}


dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

randomNameGenerator() {
  let length = 9;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


 b64toBlob(dataURI) {

  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}


changeBase64(b64Data, contentType='', sliceSize=512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

paymentSelect(e,item) {
  if (e.checked) {
    item.selected = e.checked;
  } else {
    item.selected = e.checked;
  }
}

paymentAutoPatch(payment){
    payment.forEach(ele => {
      this.payment.forEach(item => {
        if (item.name == ele.name) {
          item.isUploaded = true;
          item.selected = true;
        }
      })
    });
}

paymentList() {

  let payment = []
  this.payment.map(item => {
    if (item.selected) {
      payment.push({
        icon: item.base,
        blob : this.getFileTypeBlob(item.base,''),
        // blob : this.changeBase64(item.base.split(',')[1],'image/png'),
        name: item.name
      })
    }
  })
  let feat : any;
  this.uploadPaymentImg(payment).then(res => {
    console.log('imgArr ==>',res);
    feat = res;
    console.log('feat ==>',feat);
    return feat;
  }).catch(err => {
    console.log('imgArr_Err ==>',err);
  })
  // let payments = []
  // this.payment.map(item => {
  //   if (item.selected) {
  //     payments.push({
  //       icon: item.base,
  //       blob : this.changeBase64(item.base.split(',')[1],'image/png'),
  //       name: item.name
  //     })
  //   }
  // })
  // console.log(payments);
  // this.uploadPaymentImg(payments);
  // // return payments
}

uploadPaymentImg(filesArray) {

  return new Promise((resolve, reject) => {
    const formData: any = new FormData();
    filesArray.forEach(element => {
      formData.append('photos', element.blob)
    });
this._service.postImage('assets/uploadImages', formData).subscribe(res => {
  console.log(res);
  let arr3: any = [];
  arr3 =  filesArray.map((item, i) => Object.assign({}, { name: item.name, icon: this.translator.newImageTranslator(res['result'][i])}));
  // res['result'].forEach(element => {
  //   data.push({  img : this.translator.imageProductTranslator(element), verified : false })
  // });
  console.log(arr3);
  if(arr3){
    this.paymentRes = arr3
    resolve (arr3);
  }
}, err => {
  console.log(err);
  reject (false);
})
   })
  //   const formData: any = new FormData();
  //     filesArray.forEach(element => {
  //       formData.append('photos', element.blob)
  //     });
  //     let data = [];
  // this._service.postImage('assets/uploadImages',formData).subscribe(res=>{
  // console.log(res);

  // },err=>{
  // console.log(err);
  // })
}

}






