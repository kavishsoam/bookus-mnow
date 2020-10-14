import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SERVICE_GP, STAFF, SERVICE, LOC_LIS } from 'app/services/url';
import { ApiService } from 'app/services/api.service';
import { Router } from '@angular/router';
import { ServicesGroupComponent } from './services-group/services-group.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { duration } from 'app/services/utilites'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import {flatten} from "../../services/utilites";
import { ExportService } from 'app/services/export.service';
import { Translator } from 'app/services/translator';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [MessageService]
})
export class ServicesComponent implements OnInit {

  allServiceList = [];
  allServiceColumns: string[] = ['serviceType', 'name', 'description'];
  dialogRef: any;
  currencyCode: string;
  constructor(private _fuseConfigService: FuseConfigService,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private spinner: NgxSpinnerService,
    private exportFile : ExportService
  ) { }
  pageHeader: Object = { header: "Services", navigate: false }
  ngOnInit() {
    this.currencyCode = localStorage.getItem('currency')
    this.setPageHeader();
    this.getAllService();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  serviceSelect(row, serviceGroupData) {
    const dialogRef = this.dialog.open(EditClient, {
      width: '100vw',
      height: '100vh',
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { header: 'Edit Service', value: row, serviceGroup: serviceGroupData }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        result.type == 'refresh' ? this.getAllService() : ''
      }
    });
  }
  //going to create new service from triple dot (...)
  drop(event: CdkDragDrop<string[]>, list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
  addNewService(item) {
    const dialogRef = this.dialog.open(EditClient, {
      width: '100vw',
      height: '100vh',
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { _id: item._id, header: 'New Service', serviceGroup : item }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        result.type == 'refresh' ? this.getAllService() : ''
      }
    })
  }
  // float button to create service from group list (show group list)
  groupModelList() {
    const dialogRef = this.dialog.open(ServicesGroupComponent, {
      width: '50vw',
      height: '70vh',
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { header: 'Select Service Group' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type == "refresh") {
        this.getAllService();
      }
    });
  }
  getAllService() {
    this.spinner.show();
    this._service.get(SERVICE_GP).subscribe(res => {
      this.allServiceList = res;
     
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }
  openGroupModel() {
    const dialogRef = this.dialog.open(ServicesGroupComponent, {
      width: '50vw',
      height: '60vh',
      panelClass: 'pad-Mnow321',
      data: { header: 'Add Service Group' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type == "refresh") {
        this.getAllService();
      }
    });
  }
  //open the group modal from three dot(...) menu
  editGroupModel(item) {
    const dialogRef = this.dialog.open(ServicesGroupComponent, {  panelClass: 'pad-Mnow321',
      data: { header: 'Edit Service Group', value: item }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type == "refresh") {
        this.getAllService();
      }
    });
  }
  deleteGoup(item) {
    if (item && item.services && item.services.length == 0) {
      const dialogRef = this.dialog.open(ServicesGroupComponent, {
        width: '40vw',
        height: '30vh',
        panelClass: 'pad-Mnow321',
        data: { header: '', value: item, delete: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.type == "refresh") {
          this.getAllService();
        }
      });
    }
    else {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: "Remove existing services first to be able to delete a group" });
    }
  }
  onOptionSelected(e) {
    if (e == "CSV") this.csvDownload("csv");
    if (e == "Excel") this.csvDownload("xlsx");
    if (e == "Pdf") this.csvDownload("Pdf");
  } 
  csvDownload(type) {   
    
      this.exportFile.print(type,
        [{label:"Group Name",value:"group.name"},
        {label:"Service Name",value:"ser.name"},
         {label:"Service Type",value:"ser.serviceType"},
          {label:"Service Available",value:"ser.serviceFor"},
           ],
        ["Group Name", "Service Name", "Service Type", "Service Available"],
        flatten(this.allServiceList),
        "service-group",
        "Service Group List",
        "Auto-generated service group data")
    }
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxx EDIT SERVICE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
@Component({
  selector: 'editServices',
  templateUrl: 'editServices.html',
  styleUrls: ['./editServices.scss']
})
export class EditClient implements OnInit {
  @ViewChild('select_all')
  select_all: any;
  @ViewChild('select_allLocation')
  select_allLocation: any;
  staffList: any = [];
  enableAllStaff: boolean = true;
  enableOnlineBook: boolean = true;
  enableVoucher: boolean = true;
  roomAvailable: boolean = true;
  editService: FormGroup;
  pricing_option: FormArray;
  submitStaffForm: boolean;
  durationArray = duration;
  _id: any;
  selected_staff: [{ _id: '' }];
  selected_loc : [{_id: ''}];
  duration: any = [{
    value: 5
  },
  {
    value: 10
  }, {
    value: 15
  }, {
    value: 20
  }, {
    value: 25
  }, {
    value: 30
  }, {
    value: 35
  }, {
    value: 40
  }, {
    value: 45
  }
  ];
  checkAll: boolean;
  checkAllLocation : boolean;
  locationList: any;
  categoryData: any = [];
  categoryCollection: any = [];
  isShowPoints: any = false;
  message: string;
  imagePath: any;
  imgURL: any = "https://i.ibb.co/p2WY8hS/newmnow.png";
  constructor(
    public dialogRef: MatDialogRef<EditClient>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private translator : Translator
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
    this.editService = this._formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      pricing_option: this._formBuilder.array([this.createPricingOption()]),
      serviceType: ['', Validators.compose([Validators.required])],
      staff: [''],
      categoryId : [''],
      locationId : [''],
      serviceFor: ['Everyone'],
      description: [''],
      onlineBooking: [''],
      extra_time_type: [''],  //in update extra time is not comming
      extra_duration: [''],  // in update is not comming
      room: [''],
      voucherEnabled: [''],
      voucherExpiry: [''],
      commissionEnabled: [true],   //in update not comming
      loyaltyPoint: [''],
      loyalityPoints: [false],
      redeemPoints: [''],
      servicePoints: [''],
      image : ['']
      
    });
    if (this.data.header == 'Edit Service') {
      let value = this.data.value;


      this.editService.patchValue({
        name: value.name,
        serviceType: value.serviceType,
        staff: value.staff,
        categoryId: value.categoryId,
        serviceFor: value.serviceFor,
        description: value.description,
        onlineBooking: value.onlineBooking,
        room: value.room,
      loyalityPoints : (value && value.loyalityPoints && value.loyalityPoints.point) ? value.loyaltyPoint.point : false,
      servicePoints : (value && value.loyalityPoints && value.loyalityPoints.point) ? value.loyaltyPoint.recieve : '',
      redeemPoints : (value && value.loyalityPoints && value.loyalityPoints.point) ? value.loyaltyPoint.canRedeem : '',
        voucherEnabled: value.voucherEnabled,
        voucherExpiry: value.voucherExpiry,
        extra_time_type: value.extraTime.extra_time_type,
        extra_duration: Number(value.extraTime.duration),
        commissionEnabled: value.commissionEnabled
      });
      if(value.image){
        this.imgURL = value.image;
      }
      this.enableOnlineBook = value.onlineBooking;
      this.enableVoucher = value.voucherEnabled;
      this.roomAvailable = value.room;
      var pricing = value.pricing_option;
      delete pricing[0]._id;
      this.editService.controls['pricing_option'] = this._formBuilder.array(pricing.map(i => this._formBuilder.group(i)));
      this._id = value._id;
      let user = value.staff;
      if (user.length > 0) {
        this.selected_staff = value.staff;
      }
      let loc = value.locationId;
      if (loc.length > 0) {
        this.selected_loc = value.locationId;
      }
      if(value.loyaltyPoint && value.loyaltyPoint.point){
        this.isShowPoints = value.loyaltyPoint.point;
      }
    }
      this.getCategoryList();
    this.getAllStaff();
    this.getAllLocation();
    // this.addPricingOption()
  }
  addPricingOption() {
    this.pricing_option = this.editService.get('pricing_option') as FormArray;
    this.pricing_option.push(this.createPricingOption());
  }
  selectAll(val) {
    this.staffList.forEach(tot => {
      tot.selected = val;
    })
  }

  pointsClicked(e) {
    setTimeout(() => {
      this.isShowPoints = !this.isShowPoints;
    }, 10);
  }

  selectAllLoc(val) {
    this.locationList.forEach(tot => {
      tot.selected = val;
    })
  }

  // checkboxClick() {
  //   this._toast.add({ severity: 'info', summary: 'Edit Settings', detail: 'Go to the Staff section to change these settings' });
  // }

  createPricingOption(): FormGroup {
    return this._formBuilder.group({
      duration: ['1h'],//---------------
      price: ['', Validators.compose([Validators.required])],//------------   
      specialPriceFor: [''], //------------------
      specialPrice: ['', Validators.compose([priceValidator])], //------------------
    })
  }
  autoSelectStaff() {
    if (this.selected_staff != undefined && this.selected_staff.length > 0) {
      this.selected_staff.forEach((sel) => {
        this.staffList.forEach(tot => {
          if (sel == tot.id) {
            tot.selected = true
          }
        });
      });
    }
    this.checkAll = this.staffList.every(staff => staff.selected == true)
  }
  //select all staff when create new service
  selectAllStaffNewService() {
    this.checkAll = true;
    this.staffList.forEach(tot => {
      tot.selected = true;
    })
  }
  getAllStaff() {
    this._service.get(`${STAFF}/?list=true&type=staff`).subscribe(res => {
      this.staffList = res;
      this.staffList = this.staffList.map(item => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          id: item._id,
          selected: false
        }
      })
      if (this._id != undefined) {
        this.autoSelectStaff();
      } else {
        this.selectAllStaffNewService();
      }
    }, err => {
    })
    // return Promise.resolve(this.staffList)
  }

  autoSelectLoc() {
    if (this.selected_loc != undefined && this.selected_loc.length > 0) {
      this.selected_loc.forEach((sel) => {
        this.locationList.forEach(tot => {
          if (sel == tot.id) {
            tot.selected = true
          }
        });
      });
    }
    this.checkAllLocation = this.locationList.every(locationId => locationId.selected == true)
  }

  selectAllLocNewService() {
    this.checkAllLocation = true;
    this.locationList.forEach(tot => {
      tot.selected = true;
    })
  }

  getAllLocation() {
    this._service.get(LOC_LIS).subscribe(res => {
      if(!res.length){
        // this.noLocationView = true;
        // this.spinner.hide();
      }
      else{
        this.locationList = res;
        this.locationList = this.locationList.map(item => {
          return {
            name: item.name,
            id: item._id,
            selected: false
          }
        })

        if (this._id != undefined) {
          this.autoSelectLoc();
        } else {
          this.selectAllLocNewService();
        }
      }

    }),
      err => {
        this._toast.add({severity:'error', summary : 'No locations available', detail : 'Something went wrong' })
        // this.spinner.hide();
      };
  }

  userSelectLogic(item) {
    if (this.select_all.checked) this.select_all.checked = !this.select_all.checked
    item.selected = !item.selected;
    this.select_all.checked = this.staffList.every(loc => loc.selected == true)
  }

  userSelectLogicLocation(item) {
    if (this.select_allLocation.checked) this.select_allLocation.checked = !this.select_allLocation.checked
    item.selected = !item.selected;
    this.select_allLocation.checked = this.locationList.every(loc => loc.selected == true)
  }
  get formData() {
    return <FormArray>this.editService.get('pricing_option')
  }
  editServiceSave(form) {

    var pricing_option = this.editService.get('pricing_option') as FormArray;
    var data = form.value
    var extraTime = {
      extra_time_type: data.extra_time_type,
      duration: data.extra_duration
    }
    data.loyaltyPoint = {
      point: data.loyalityPoints,
      recieve: data.servicePoints,
      canRedeem: data.redeemPoints
  }
    delete data.pricing_option;
    data.pricing_option = pricing_option.value;
    data.extraTime = extraTime;
    data.onlineBooking = this.enableOnlineBook;
    data.room = this.roomAvailable;
    data.groupId = this.data._id;
    data.voucherEnabled = this.enableVoucher
    if (form.invalid) {
      this.submitStaffForm = true;
      return;
    }
    let staffId = [];
    this.staffList.forEach(element => {
      if (element.selected == true)
        staffId.push(element.id)
    })
    data.staff = staffId;

    let locations = [];
    this.locationList.forEach(element => {
      if (element.selected == true)
        locations.push(element.id)
    })
    data.locationId = locations;
    if (this._id != undefined) {
      this.updateService(data);
      return;
    }

    form.value.name = _.startCase(_.toLower(form.value.name));

    if (this.imagePath) {
      const formData: any = new FormData();
    formData.append('photos', this.imagePath[0]);
    this._service.postImage('assets/uploadImages',formData).subscribe(res => {
      if (!form.value.image) {
        form.value.image = "";
      }
      form.value.image= form.value.image = this.translator.imageProductTranslator(res['result'][0])
      this.createServiceWithImage(data);
    }, rej => {
      console.log("rej", rej);
    });
  } else {
    form.value.image=this.imgURL;
    this.createServiceWithImage(data);
  }

    

  }

  createServiceWithImage(data) {
    this._service.post(SERVICE, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      setTimeout(() => {
        this.dialogRef.close({
          type: "refresh"
        })
      }, 1500)
    }, err => {
    })
  }


  updateService(data) {
    data.name = _.startCase(_.toLower(data.name));

    if (this.imagePath) {
      const formData: any = new FormData();
    formData.append('photos', this.imagePath[0]);
    this._service.postImage('assets/uploadImages',formData).subscribe(res => {
      if (!data.image) {
        data.image = "";
      }
      data.image= data.image = this.translator.imageProductTranslator(res['result'][0])
      this.updateServiceWithImage(data);
    }, rej => {
      console.log("rej", rej);
    });
  } else {
    data.image=this.imgURL[0];
    this.updateServiceWithImage(data);
  }


  }

  updateServiceWithImage(data) {
    this._service.put(`${SERVICE}/${this._id}`, data).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this._id = undefined;
      setTimeout(() => {
        this.dialogRef.close({
          type: "refresh"
        })
      }, 1500)
    }, err => {
    })
  }


  deleteService() {
    this._service.delete(`${SERVICE}?service=${this._id}`).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      setTimeout(() => {
        this.dialogRef.close({
          type: "refresh"
        })
      }, 1500)
    }, err => {
    })
  }

  getCategoryList() {
    this._service.get('category').subscribe(res=>{
      let categoryList : any = [];
       categoryList = this.data.serviceGroup.categoryId;
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

preview(files) {
  if (files.length === 0) {
    return;
  }
  let mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.message = 'Only images are supported.';
    return;
  }
  let reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]);
  reader.onload = (_event) => {
    this.imgURL = reader.result;

  };
}

}
export const priceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const price = control.parent.get('price');
  const specialPrice = control.parent.get('specialPrice');
  if (parseFloat(price.value) < parseFloat(specialPrice.value)) {
    return { 'specialPriceError': true };
  }
}
