import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSlideToggleChange,
  MatDialog,
} from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "app/services/api.service";
import { STAFF, CREATE_STAFF, SERVICE, LOCATION } from "app/services/url";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { EMAIL_PAT, PHONE_NUM } from "app/services/pattern";
import { formArray } from "app/services/utilites";
import { Translator } from "app/services/translator";
import { FuseThemeOptionsModule } from "@fuse/components";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { CropImageModalComponent } from "app/main/shared-component/crop-image-modal/crop-image-modal.component";

@Component({
  selector: "staffEditorProfile",
  templateUrl: "staffEditProfile.html",
  styleUrls: ["staffEditProfile.scss"],
})
export class staffEditorProfile implements OnInit {
  loader: boolean = false;
  staffProfileForm: FormGroup;
  commissionForm: FormGroup;
  submittedError: boolean;
  location: any = [];
  service: any = [];
  schedule_shifts: any = [];
  displayDelete: boolean;
  _id: any;
  phone_invalid: boolean = true;
  countryStr: string = "au";
  countryCode: string = "61";
  checkAll: boolean;
  checkAll_ser: boolean;
  @ViewChild("select_all")
  select_all: any;
  @ViewChild("select_all_ser")
  select_all_ser: any;
  color: any = [
    { value: "orange" },
    { value: "yellow" },
    { value: "green" },
    { value: "blue" },
    { value: "violet" },
    { value: "indigo" },
    { value: "orange" },
    { value: "orange" },
    { value: "orange" },
    { value: "orange" },
  ];
  calendarBooking: boolean;
  profileImg: any;
  @ViewChild("telInput")
  telInput: any;
  freelancerForm: FormGroup;
  directEmployeeForm: FormGroup;
  categoryData: any = [];
  categoryCollection: any = [];
  message: string;
  imagePath: any;
  imgURL: any = "";
  disabledForPast: boolean = false;
  ownerId: string;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  otherImages: any = [];
  allOtherImages: any = [
    "http://18.216.120.11:8080/uploads/ee46df66-3bb6-4ceb-8426-a2cd35cf4b5a.png",
  ];

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imgURL = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  constructor(
    public dialogRef: MatDialogRef<staffEditorProfile>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private cdRef: ChangeDetectorRef,
    public translator: Translator,
    private _router: Router,
    public dialog: MatDialog
  ) {}
  serviceList: any = [];
  serviceListArray: any = [];
  selectedService: any;
  locationList: any = [];
  selected_serviceList: any = [];
  selected_locationList: any = [];
  colorValue: any = "#ef9a9a";
  phoneNumber: any;
  ngOnInit() {
    this.getCategoryList();
    this.getAllService();
    this.getAllServiceList();
    this.getAllLocation();
    this.countryStr = localStorage.getItem("CountryCode")
      ? localStorage.getItem("CountryCode")
      : "au";
    this.countryCode = localStorage.getItem("countrycode");
    this.ownerId = localStorage.getItem("owner");
    this.calendarBooking = true;
    this.staffProfileForm = this._formBuilder.group({
      firstName: ["", Validators.compose([Validators.required])],
      lastName: [""],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(EMAIL_PAT),
        ]),
      ],
      qualification: [""],
      phone: [""],
      provider: [""],
      staffTitle: [""],
      categoryId: [""],
      notes: [""],
      descriptions: [""],
      owner: [""],
      _type: ["staff"],
      employmentStartDate: [],
      employmentEndDate: [""],
      location: [""],
      service: [""],
      schedule_shifts: [],
      serviceColor: [""],
      active: [""],
      // userPermission: ['']
      product_commission: [""],
      service_commission: [""],
      specific_commission: [""],
      hourly_commission: [""],
      hourly_pay: [""],
      gender: ["", Validators.required],
      voucher_commission: [""],
      appointmentColor: [""],
      employmentType: ["", Validators.compose([Validators.required])],
      subcontractorABN: [""],
      subcontractorCommission: [""],
      subcontractorPercent: [""],
      permanentABN: [""],
      permanentTFN: [""],
      employment: [""],
      image: [],
      favProduct: [[]],
      profileImage: [[]],
      ownerDetails: [],
    });

    if (this.data.staff) {
      this.setStaffData(this.data.staff);
      if (!this.data.staff.active) {
        this.staffProfileForm.disable();
        this.disabledForPast = true;
      }
    }

    //this.colorValue = "#ef9a9a"
    if (this.data.header == "New Staff") {
      this.staffProfileForm.get("employmentStartDate").setValue(new Date());
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  toggle(event: MatSlideToggleChange) {
    this.calendarBooking = event.checked;
  }

  // findCommission(data) {
  //   let object : any;
  //   object = {
  //     commission : data.subcontractorCommission,
  //     amount : data.subcontractorPercent
  //   }
  //   return object;
  // }

  modifyFormType(data, type) {
    let object;
    if (type == "free") {
      object = {
        employmentType: data.employmentType,
        numberABN: data.subcontractorABN,
        numberTFN: "",
        tax: {
          commission: data.subcontractorCommission,
          amount: data.subcontractorPercent,
        },
      };
    }
    if (type == "perm") {
      object = {
        employmentType: data.employmentType,
        numberABN: data.permanentABN,
        numberTFN: data.permanentTFN,
        tax: {
          commission: "",
          amount: 0,
        },
      };
    }

    return object;
  }

  staffProfileSubmit(form) {
    form.invalid
      ? this._toast.add({
          severity: "error",
          summary: "Employment Type",
          detail: "Select employment type before processing forward",
        })
      : console.log(form);
    form.invalid ? (this.loader = false) : (this.loader = true);
    form.value.phone = this.phoneNumber;
    form.value.countryStr = this.countryStr;
    form.value.countryCode = this.countryCode;
    form.value.calendarBooking = this.calendarBooking;
    form.value.profileImage = [];
    form.value.service_commission = Number(form.value.service_commission);
    form.value.specific_commission = Number(form.value.specific_commission);
    form.value.hourly_commission = Number(form.value.hourly_commission);
    form.value.hourly_pay = Number(form.value.hourly_pay);
    //to add new client
    form.value.schedule_shifts = this.schedule_shifts;

    if (
      form.value &&
      form.value.employmentType &&
      form.value.employmentType == "freelancer"
    ) {
      form.value.employment = this.modifyFormType(form.value, "free");
    }
    if (
      form.value &&
      form.value.employmentType &&
      form.value.employmentType == "permanent"
    ) {
      form.value.employment = this.modifyFormType(form.value, "perm");
    }

    if (this.otherImages.length) {
      if (form.value.favProduct.length) {
        let arrImg: any = [];
        arrImg = form.value.favProduct;
        arrImg = [...arrImg, ...this.otherImages];
      } else {
        form.value.favProduct = this.allOtherImages;
      }
    } else {
      form.value.favProduct = form.value.favProduct;
    }

    form.value.schedule_shifts = [];
    let serviceList = [];
    this.serviceList.forEach((element) => {
      if (element.selected == true) serviceList.push(element.id);
    });
    form.value.service = serviceList;
    let locationList = [];
    this.locationList.forEach((element) => {
      if (element.selected == true) locationList.push(element.id);
    });
    form.value.ownerDetails = [
      {
        owner: this.ownerId,
        active: true,
        location: locationList,
      },
    ];
    form.value.location = locationList;
    if (form.invalid || !this.phone_invalid) {
      this.submittedError = true;
      return;
    }

    if (this._id != undefined) {
      this.updateStaff(form);
      return;
    }
    if (form.value.appointmentColor == "") {
      form.value.appointmentColor = "#ef9a9a";
    }

    if (this.croppedImage) {
      form.value.image = this.croppedImage;
      this.submitFormWithImage(form);
      // const formData: any = new FormData();
      // formData.append("photos", this.imagePath[0]);
      // this._service.postImage("assets/uploadImages", formData).subscribe(
      //   (res) => {
      //     if (!form.value.image) {
      //       form.value.image = "";
      //     }
      //     form.value.image = form.value.image = this.translator.imageProductTranslator(
      //       res["result"][0]
      //     );
      //     this.submitFormWithImage(form);
      //   },
      //   (rej) => {
      //     console.log("rej", rej);
      //   }
      // );
    } else {
      form.value.image = "";
      this.submitFormWithImage(form);
    }
  }

  submitFormWithImage(form) {
    this._service.post(CREATE_STAFF, form.value).subscribe(
      (res) => {
        localStorage.setItem("staff", res);
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: res.message,
        });
        setTimeout(() => {
          this.loader = false;
          this.dialogRef.close({
            type: "refresh",
          });
        }, 1500);
      },
      (err) => {
        this.loader = false;
        this._toast.add({
          severity: "error",
          summary: "Service Message",
          detail: err.error,
        });
      }
    );
  }

  updateStaff(form) {
    if (this.croppedImage) {
      form.value.image = this.croppedImage;
      this.updateStaffWithImage(form);
      // const formData: any = new FormData();
      // formData.append("photos", this.croppedImage);
      // this._service.postImage("assets/uploadImages", formData).subscribe(
      //   (res) => {
      //     if (!form.value.image) {
      //       form.value.image = "";
      //     }
      //     form.value.image = this.translator.imageProductTranslator(
      //       res["result"][0]
      //     );
      //     this.updateStaffWithImage(form);
      //   },
      //   (rej) => {
      //     console.log("rej", rej);
      //   }
      // );
    } else {
      form.value.image = this.imgURL[0];
      this.updateStaffWithImage(form);
    }
  }

  updateStaffWithImage(form) {
    this._service.put(`users?staffId=${this._id}`, form.value).subscribe(
      (res) => {
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "Staff update successfully",
        });
        setTimeout(() => {
          this.loader = false;
          this.dialogRef.close({
            type: "refresh",
          });
        }, 1500);
      },
      (err) => {
        this._toast.add({
          severity: "error",
          summary: "Service Message",
          detail: err.error,
        });
      }
    );
  }

  getAllService() {
    this._service.get(`${SERVICE}?list=true`).subscribe(
      (res) => {
        this.serviceList = res;
        if (this.serviceList && this.serviceList.length > 0) {
          this.serviceList = this.serviceList.map((item) => {
            return {
              id: item._id,
              name: item.name,
              selected: false,
            };
          });
          if (this._id) {
            this.autoSelectService();
          } else {
            this.selectAllSerNewStaff();
          }
        }
      },
      (err) => {}
    );
  }
  getAllServiceList() {
    let data = [];
    this._service.get("services/pricing_list").subscribe(
      (res) => {
        // console.log(res);
        // res.result.forEach((ele) => {
        //   let innerData = [];
        //   ele.services.forEach((element) => {
        //     innerData.push({ value: element._id, viewValue: element.name });
        //     // data.service.push({ value : element._id, viewValue : element.name })
        //   });
        //   data.push({ name: ele.serviceGroup, service: innerData });
        //   // data['service'].push(innerData);
        // });
        // console.log(data);
        this.serviceListArray = res.result;
      },
      (err) => {
        console.log(err);
      }
    );
    // this.serviceGroups = data;
  }

  setSelectedService(item) {
    this.selectedService = item;
  }
  getAllLocation() {
    this._service.get(`${LOCATION}?list=true`).subscribe(
      (res) => {
        this.locationList = res;
        if (this.locationList && this.locationList.length > 0) {
          this.locationList = this.locationList.map((item) => {
            return {
              id: item._id,
              name: item.name,
              selected: false,
            };
          });
          if (this._id) {
            this.autoSelectLocation();
          } else {
            this.selectAllLocNewStaff();
          }
        }
      },
      (err) => {}
    );
  }
  serviceModify(item) {
    if (this.select_all_ser.checked)
      this.select_all_ser.checked = !this.select_all_ser.checked;
    item.selected = !item.selected;
    this.select_all_ser.checked = this.serviceList.every(
      (ser) => ser.selected == true
    );
  }
  locationModify(item) {
    if (this.select_all.checked)
      this.select_all.checked = !this.select_all.checked;
    item.selected = !item.selected;
    this.select_all.checked = this.locationList.every(
      (loc) => loc.selected == true
    );
  }

  checkPatchValue(value, type) {
    let data;
    if (type == "freeABN") {
      if (value.employment.employmentType == "freelancer") {
        data = value.employment.numberABN;
      }
      if (value.employment.employmentType == "permanent") {
        data = "";
      }
    }

    if (type == "permTFN") {
      if (value.employment.employmentType == "freelancer") {
        data = "";
      }
      if (value.employment.employmentType == "permanent") {
        data = value.employment.numberTFN;
      }
    }

    if (type == "permABN") {
      if (value.employment.employmentType == "freelancer") {
        data = "";
      }
      if (value.employment.employmentType == "permanent") {
        data = value.employment.numberABN;
      }
    }
    return data;
  }

  setStaffData(value) {
    if (value && value.countryCode) {
      this.countryCode = value.countryCode;
    }
    if (value && value.countryStr) {
      this.countryStr = value.countryStr;
    }
    this.calendarBooking = value.calendarBooking;
    this._id = value._id;
    // this.allOtherImages = value.favProduct;
    this.staffProfileForm.patchValue({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      provider: value && value.provider ? value.provider : "",
      phone: value.phone,
      staffTitle: value.staffTitle,
      categoryId: value.categoryId,
      notes: value.notes,
      descriptions: value.descriptions,
      owner: value.owner,
      gender: value.gender,
      _type: value._type,
      employmentStartDate: value.employmentStartDate,
      employmentEndDate: value.employmentEndDate,
      location: value.location,
      service: value.service,
      active: value.active,
      profileImage: [],
      favProduct: value && value.favProduct ? value.favProduct : [],
      ownerDetails: value.ownerDetails,
      appointmentColor: value.appointmentColor,
      service_commission: value.service_commission,
      specific_commission: value.specific_commission,
      hourly_commission: value.hourly_commission,
      hourly_pay: value.hourly_pay,
      employmentType:
        value.employment && value.employment.employmentType
          ? value.employment.employmentType
          : "",
      subcontractorABN:
        value.employment && value.employment.employmentType
          ? this.checkPatchValue(value, "freeABN")
          : "",
      subcontractorCommission:
        value.employment && value.employment.employmentType
          ? value.employment.tax.commission
          : "",
      subcontractorPercent:
        value.employment && value.employment.employmentType
          ? value.employment.tax.amount
          : "",
      permanentABN:
        value.employment && value.employment.employmentType
          ? this.checkPatchValue(value, "permABN")
          : "",
      permanentTFN:
        value.employment && value.employment.employmentType
          ? this.checkPatchValue(value, "permTFN")
          : "",
    });
    if (value.image) {
      this.croppedImage = value.image;
    }
    this.selected_serviceList = value.service;
    this.selected_locationList = value.location;
    this.colorValue = value.appointmentColor;
    this.phoneNumber = this.staffProfileForm.controls["phone"].value;
  }
  autoSelectService() {
    if (this.selected_serviceList && this.selected_serviceList.length > 0) {
      this.selected_serviceList.forEach((sel) => {
        this.serviceList.forEach((tot) => {
          if (sel == tot.id) {
            tot.selected = true;
          }
        });
      });
    }
    this.checkAll_ser = this.serviceList.every((loc) => loc.selected == true);
  }
  autoSelectLocation() {
    if (this.selected_locationList && this.selected_locationList.length > 0) {
      this.selected_locationList.forEach((sel) => {
        this.locationList.forEach((tot) => {
          if (sel == tot.id) {
            tot.selected = true;
          }
        });
      });
    }
    this.checkAll = this.locationList.every((loc) => loc.selected == true);
  }
  //select all the location when create new staff
  selectAll(type, val) {
    if (type == 1) {
      this.locationList.forEach((tot) => {
        tot.selected = val;
      });
    } else {
      this.serviceList.forEach((tot) => {
        tot.selected = val;
      });
    }
  }
  selectAllLocNewStaff() {
    this.checkAll = true;
    this.locationList.forEach((tot) => {
      tot.selected = true;
    });
  }
  //select all service when create new staff
  selectAllSerNewStaff() {
    this.checkAll_ser = true;
    this.serviceList.forEach((tot) => {
      tot.selected = true;
    });
  }
  deleteStaff() {
    this.displayDelete = !this.displayDelete;
    if (this.displayDelete) {
      this.dialogRef.updateSize("45vw", "35vh");
    } else {
      this.dialogRef.updateSize("100vw", "100vh");
    }
  }
  deleteStaffConfirm() {
    this._service
      .delete(`${STAFF}/${this._id}` + "?owner=" + this.ownerId)
      .subscribe(
        (res) => {
          this._toast.add({
            severity: "success",
            summary: "Service Message",
            detail: "Staff delete successfully",
          });
          this._id = undefined;
          setTimeout(() => {
            this.dialogRef.close({
              type: "refresh",
            });
          }, 1500);
        },
        (err) => {
          this._toast.add({
            severity: "error",
            summary: "Service Message",
            detail: "Staff delete failed",
          });
        }
      );
  }
  deleteShiftConfirm() {}
  colorSetter(color) {
    this.staffProfileForm.controls["appointmentColor"].setValue(color);
  }
  onCountryChange(e) {
    this.countryStr = e.iso2;
    this.countryCode = e.dialCode;
  }
  telInputObject(e) {}
  getNumber(e) {
    this.staffProfileForm.value.phone = e;
  }
  hasError(e) {
    console.log("hasError: ", e);
    this.phone_invalid = e;
    // when it return fasle => thats mean it has error.
  }
  telInputChange(e) {
    // //
    // this.staffProfileForm.value.phone = e
    if (
      this.telInput &&
      this.telInput.nativeElement.value == `+ ${this.countryCode} ` &&
      e.keyCode === 8
    )
      return false;
  }
  ngAfterViewInit(): void {
    if (this.telInput && this.telInput.nativeElement) {
      this.telInput.nativeElement.value = `+ ${this.countryCode} `;
    }
  }
  ngAfterViewChecked() {
    if (this.telInput && !this.telInput.nativeElement.value)
      this.telInput.nativeElement.value = `+ ${this.countryCode} `;
    this.cdRef.detectChanges();
  }
  removeImage() {
    //
    this.profileImg = "";
  }
  imageUploadEvt(event: any) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImg = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  getCategoryList() {
    this._service.get("category").subscribe(
      (res) => {
        let categoryList: any = [];
        categoryList = localStorage.getItem("categoryList").split(",");
        let data = [];
        let category = [];
        category = res.result;
        category.forEach((element) => {
          element.category.forEach((innerEle) => {
            categoryList.forEach((id) => {
              if (innerEle.language == "english" && element._id == id)
                data.push({ id: element._id, name: innerEle.name });
            });
          });
        });
        this.categoryData = data;
        console.log("category data ===>>>", this.categoryData);
      },
      (err) => {
        console.log(err);
      }
    );
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
      this.message = "Only images are supported.";
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  chooseButtonClicked() {
    const dialogRef = this.dialog.open(CropImageModalComponent, {
      maxWidth: "50vw",
      maxHeight: "100vh",
      // height: "80%",
      autoFocus: false,
      data: {
        _id: "",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.croppedImage = result.image;
    });
  }

  moreUpload() {
    const dialogRef = this.dialog.open(CropImageModalComponent, {
      maxWidth: "50vw",
      maxHeight: "100vh",
      // height: "80%",
      autoFocus: false,
      data: {
        _id: "",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.otherImages.push(result.image);
      this.allOtherImages.push(result.image);
      this.cdRef.detectChanges();
      // this.croppedImage = result.image;
    });
  }

  removeSelectedImg(index) {
    console.log(index);
    if (index > -1) {
      this.allOtherImages.splice(index, 1);
    }
  }
}
