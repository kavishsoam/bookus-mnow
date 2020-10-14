import {
  Component,
  OnInit,
  Inject,
  Optional,
  ChangeDetectorRef,
  ViewChild,
  Input,
  ElementRef
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import {
  APPOINTMENT,
  CLIENT_INFO,
  GET_STAFF_DROP,
  SALE,
  CLIENT,
  TAX_CAL,
  LOC_LIS,
  SETUP,
  INVOICE
} from "../../../../services/url";

import * as moment from "moment";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { NgxSpinnerService } from "ngx-spinner";
import { TipComponent } from "./tip/tip.component";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { InvoiceComponent } from "../invoice/invoice.component";

import { ClientInfoComponent } from "../../../shared-component/client-info/client-info.component";
import { VoucherComponent } from "./voucher/voucher.component";
import { ApiService } from "app/services/api.service";
import { ClientIntakeForm } from "app/main/clients/clients.component";
import { formArray } from "../../../../services/utilites";
import { Observable, fromEvent, Subject } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
// import { Observable, Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { setTime } from "ngx-bootstrap/chronos/utils/date-setters";
@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrls: ["./check-out.component.scss"],
  animations: fuseAnimations
})
export class CheckOutComponent implements OnInit {
  checkoutForm: FormGroup;
  @ViewChild(ClientInfoComponent)
  // @ViewChild('searchInput') searchInput : ElementRef;
  // @ViewChild('specialSearchInput') specialSearchInput : ElementRef;
  
 
  clientInfoComponent: ClientInfoComponent;
  staffLists: any = [];
  selectedStaff: any = localStorage.getItem("id");
  totalAmount: number = 0;
  reduceAmount: number = 0;
  selectedDiscount: any;
  paymentModes: any = [];
  tips_Data: any = [];
  //xxxx sale created xxxxxx
  appointmentSales: any = [];
  totalBal: any;
  currencyCode: string;
  checkoutData: any;
  clientData: any;
  clientDetails: any;
  reducePayment: number = 0;
  type: void;
  voucherSale: any = [];
  selectedStaffDetails: any;
  value2: { type: any; amount: any };
  multipleAppList: any = [];
  apt: any;
  appointment: any;
  profile: boolean;
  isPayMode: boolean;
  location: any;
  discount: boolean = false;
  //xx xx xx xx xx xx xx xxx
  CheckoutForm: FormGroup;
  purchaseItem: FormArray;
  actualPrice: number = 0;
  tipsArray: any = [];
  actualTip: number = 0;
  paymentArray: any = [];
  actualPayment: number = 0;
  grandAmount: number = 0;
  taxData: any;
  actualTax: number = 0;
  loader: boolean;
  actualTaxAmt: number = 0;
  voucherModal: any;
  globalVariable: any = "global variable's value";
  location_id: any;
  customDiscountField: boolean = false;
  inputValue: any = 0;
  discountList: any = 0;
  customOption : any;
  customValue : any;
  appliedDiscount = false;
  errorPrice = false;
  customDisc = false;
  discItem = false;
  discountValue : any;
  searchClient: string = "";
  searchClientEmail: string;
 

  totalAppliedDiscount:any = 0;
  totalAppliedPercentage:any = 0;
  completeSalesClick: boolean = true;
  ifClicked: boolean;
  clientInvoices: any;
  clientList: boolean;
  clientIntakeFormFilled: boolean;
  walkIn: boolean;
  isVoucher : boolean = true;
  serviceVoucherAmount: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef<CheckOutComponent>,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private changeRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    //;by kavish
    this.userQuestionUpdate.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        console.log('input value==>>',value);
        if(Number(value) > 0){
          this.calculateAppliedDiscount();
          this.calculateActualPrice();
          this.calculateGrandAmount();
        }
        else{
          this.grandAmount = 0;
          this.actualTax = 0;
          this.actualPrice = 0;
          this._toast.add({severity: 'error',summary : 'value is incorrect', detail: 'please enter correct value' });
        }

      });
  }

  ngOnInit() {

/**by kavish */

    this.CheckoutForm = this._formBuilder.group({
      purchaseItem: this._formBuilder.array([])
    });
    //intial load for the component
    this.setUpUtils();

    //to check data recieved from previous component
    if (this.data.type == "Appointment") {
      this.spinner.show();
      this.loader = true;

      this.getAllStaff().subscribe(
        res => {
          this.isAppointmentCheckout();
          // this.loader = false;
        },
        err => {
          this.loader = false;
          this.spinner.hide();
        }
      );

      if (this.data.voucherCheckout) {
        this.voucherModal = true;
      } else {
        this.voucherModal = false;
      }
    }

    if (this.data.type == "Voucher" || this.data.type == "Gift") {


      this.isVoucher = false;
      this.spinner.show();
      this.loader = true;
      this.getAllStaff().subscribe(
        res => {
          this.isServiceVoucherCheckout(this.data.voucherData);
          // this.loader = false;
          setTimeout(() => {
            this.purchaseItem['controls'][0]['controls']['price'].disable();
            this.purchaseItem['controls'][0]['controls']['special_price'].disable();
          }, 500);
        },
        err => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }


    this.discountListApi();
  }



  discountListApi() {
    this.spinner.show();
    this._service.get(`${SETUP}discounts`).subscribe(res => {
      this.discountList = res.result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    })
  }

  customDiscount(type) {
    (type) ? this.customDiscountField = true : this.customDiscountField = false;
  }










  //initial component data load
  setUpUtils() {
    this.type = this.data.type;
    this.clientInfoComponent.test();
    this.currencyCode = localStorage.getItem("currency");
    if (
      this.data.location_id != undefined &&
      (this.data.isChild || this.data.appointment_id)
    ) {
      this.getAppoinmentById(
        this.data.appointment_id,
        this.data.location_id,
        this.data.bookingRef
      );
    }
  }

  // when previous component is view appointment
  isAppointmentCheckout() {
    //;
    this.multipleAppList = this.data.appointment;
    this.multipleAppList = this.multipleAppList.map(it => {
      return {
        ...it,
        offDiscount: it.price && it.special_price ? it.price - it.special_price : "No Discount",
        selectedDiscount: it.price && it.special_pric ? it.price - it.special_price : "No Discount"
        // staff: {id: "5ce780822ed87600182b4fce", firstName: "vijaya", lastName: "mallya"}
      };
    });
    this.multipleAppList.forEach(ele => {
      this.addPurchaseItem(ele);
    });
    this.calculateActualPrice();
  }

  // when previous component is create-invoice component
  isServiceVoucherCheckout(data) {
    this.multipleAppList = data;
    let staff = this.commissionCal();
    this.multipleAppList = this.multipleAppList.map(it => {
      return {
        ...it,
        offDiscount:
          it.price && it.special_price
            ? it.price - it.special_price
            : "No Discount",
        selectedDiscount:
          it.price && it.special_price
            ? it.price - it.special_price
            : "No Discount",
        staff: {
          id: staff._id,
          firstName: staff.firstName,
          lastName: staff.lastName
        }
      };
    });
    this.multipleAppList.forEach(ele => {
      this.addPurchaseItem(ele);
    });
    this.calculateActualPrice();
  }

  getAppoinmentById(apt_id, location_id, bookingRef) {
    var urlGenerator;
    if (bookingRef != "") {
      urlGenerator = `${APPOINTMENT}/search?booking_reference=${bookingRef}&location_id=${location_id}`;
    } else {
      urlGenerator = `${APPOINTMENT}/search?appointment=${apt_id}&location_id=${location_id}`;
    }
    this._service.get(urlGenerator).subscribe(
      res => {
        this.apt = res[0];
        if (res.length > 1) this.multipleAppList = res;
        else this.multipleAppList = res;
        this.totalBal = this.apt.totalBal;
        this.selectedStaff = this.apt.staff.id;
        if (this.multipleAppList.length > 0) {
          this.multipleAppList.forEach(element => {
            if (element.special_price) {
              this.selectedDiscount =
                (element && element.price) - (element && element.special_price);
            } else {
              this.selectedDiscount = "No Discount";
            }
            element.selectedDiscount = this.selectedDiscount;
          });
        }
        if (
          this.apt &&
          this.apt.location &&
          this.apt.client &&
          this.apt.client._id
        ) {
          this.getClientDetails(this.apt.client._id, this.apt.location);
          this.getClientInfo(this.apt.client._id);
        }
      },
      err => { }
    );
  }

  getClientDetails(client_id, location_id) {
    this._service
      .get(`${CLIENT_INFO}${client_id}&location_id=${location_id}`)
      .subscribe(
        res => {
          this.clientDetails = res.clientInfo;
          this.appointment = res.appointment;
        },
        err => { }
      );
  }


  viewProfile() {
    this.profile = !this.profile;
    this.clientInfoComponent.test();
  }

  //when press backbutton at the time of sale complete
  backToPayment(apt) {
    this.actualPayment = 0;
    this.actualTip = 0;
    this.tipsArray = [];
    this.paymentArray = [];
    this.isPayMode = false;
    this.calculateGrandAmount();
  }

  //calculate the commission, specific commission.
  commissionCal(id = null): any {
    let data;
    if (id == null) {
      if (this.staffLists.length > 0) {
        return this.staffLists[0];
      }
    }
    this.staffLists.forEach(it => {
      if (it._id == id) {
        data = it;
        return;
      }
    });
    return data;
  }

  calculateHourlyCommission(hourly_commission, start_time, end_time) {
    //;
    if (hourly_commission && start_time && end_time) {
      var stme = moment(start_time);
      var enme = moment(end_time);
      var duration = moment.duration(enme.diff(stme));
      var remain_hour = duration.hours();
      var remain_min = duration.minutes();

      let hourlyCommission = ((hourly_commission * remain_hour) + (hourly_commission * remain_min / 60));
      return hourlyCommission;
    }
    else
      return 0
  }

  //calculate the commission, specific commission, discount, amount, service for Appointment/Multiple-Appointment
  appointmentSale() {
    let appointmentForm = this.purchaseItem.value;
    //kavish discount in line 363 change
    appointmentForm.forEach(ele => {
      let staffCom = this.commissionCal(ele.staff_id);
      let hourlyCommission = this.calculateHourlyCommission(staffCom.specific_commission, ele.startTime, ele.endTime)
      this.appointmentSales.push({
        appointmentId: ele.Id,
        commission: ele.service_commissionEnabled
          ? staffCom.service_commission
            ? staffCom.service_commission
            : 0
          : 0,
        hourly_commission: hourlyCommission != 0 ? hourlyCommission : 0,
        discount: (ele.discountSelected == 'No_Discount' || ele.discountSelected ==  null || ele.discountSelected == '' || ele.discountSelected == undefined ) ? 0 :(ele.discountSelected == 'custom')? ele.customDiscountValue.value : ele.discountSelected.value,
        discountType : (ele.discountSelected == 'No_Discount' || ele.discountSelected == null || ele.discountSelected == '' || ele.discountSelected == undefined ) ? 'none':(ele.discountSelected == 'custom') ? ele.customDiscountType : ele.discountSelected.valueType,
        amount: ele.price,
        service: ele.service_id,
        staff: {
          _id: ele && ele.staff_id ? ele.staff_id : "",
          firstName:
            ele && ele.staff_id
              ? this.commissionCal(ele.staff_id).firstName
              : "",
          lastName:
            ele && ele.staff_lastName
              ? this.commissionCal(ele.staff_id).lastName
              : ""
        }
      });
    });
  }

  //calculate the commission, specific commission, discount, amount, service for voucher/gift
  VoucherOrGitftSale() {
    
    let appointmentForm = this.purchaseItem.value;
    let staffCom = this.commissionCal(appointmentForm[0].staff_id);
    this.appointmentSales.push({
      _type: this.data._type,
      value: (this.data._type == "Gift Voucher") ? appointmentForm[0].giftVoucherAmt ? 
      appointmentForm[0].giftVoucherAmt :
       appointmentForm[0].price : 
       appointmentForm[0].special_price ? 
       appointmentForm[0].special_price :
        appointmentForm[0].price,
        // value : (this.data._type == 'Service Voucher') ? this.serviceVoucherAmount: 0,
      expiryPeriod: appointmentForm[0].expiry,
      amount: (this.data._type == "Gift Voucher")  ? appointmentForm[0].giftVoucherAmt ? 
      appointmentForm[0].giftVoucherAmt :
       appointmentForm[0].price : 
       appointmentForm[0].special_price ? 
       appointmentForm[0].special_price :
        appointmentForm[0].price,
      quantity: "1",
      discount: this.data._type == "Gift Voucher" ? 0 : appointmentForm[0].special_price ? appointmentForm[0].price - appointmentForm[0].special_price : 0,
      code: (this.data._type == "Gift Voucher" || this.data._type == 'Service Voucher') && (this.data.voucherCode != "") ? this.data.voucherCode : '',
      staff: {
        _id: appointmentForm[0].staff_id,
        firstName: appointmentForm[0].staff_firstName,
        lastName: appointmentForm[0].staff_lastName
      },
      commission: staffCom.commission ? staffCom.commission : 0,
      service: this.data._type == "Service Voucher" ? appointmentForm[0].service_id : null,
      duration: this.data._type == "Service Voucher" ? appointmentForm[0].duration : null
    });
    if(this.data._type == 'Service Voucher'){
      this.appointmentSales.forEach(element => {
        element.value = this.serviceVoucherAmount;
        element.amount = this.serviceVoucherAmount;
      });
    }
  }

  //tip formatting
  tipsFormatting() {
    let tip = this.tipsArray.map(it => {
      return {
        staff: it.staff,
        amount: it.amount
      };
    });
    return tip;
  }
  //payment formatting
  paymentFormatting() {
    let payment;
      payment = this.paymentArray.map(it=>{
          if(it.code){
            return {
              name: 'voucher',
              paymentId : it.code,
              amount: it.amount
            }
          }
          else{
            return {
              name: it.type.toLowerCase(),
              amount: it.amount
            }
          }})
    return payment;
  }

  fetchOwnerId() {
    let ownerId =  localStorage.getItem('owner');
    return ownerId;
  }

  fetchClient_id() {
    return this.purchaseItem.value[0].client_id
  }

  //complete sales functionality
  completeSale() {
    this.completeSalesClick = false;
    let data = {};
    //
    //when checkout of appointment/ multiple appointment
    if (this.data.type == "Appointment") {
      //;
      this.appointmentSale();

      let totalDiscountApplied = {};
      totalDiscountApplied = {
        totalDiscountAmount : this.totalAppliedDiscount,
        totalDisocuntPercentage : this.totalAppliedPercentage
      }

      data = {
        appointment: this.appointmentSales,
        // totalAmount: this.actualTip + this.actualPrice + this.actualTax,         //! SALES api, needs to send hourly-pay object
        totalAmount: ((this.actualPrice != this.actualTaxAmt) ? (this.actualPrice) : (this.actualPrice)),
        totalDiscount : totalDiscountApplied,
        tips: this.tipsFormatting(),
        payment: this.paymentFormatting(),
        location: this.data.location_id,
        category: "appointment",
        ownerId: this.fetchOwnerId(),
        
        // totalDiscount : (this.totalAppliedDiscount) ? this.totalAppliedDiscount : this.totalAppliedPercentage
      };
      // this.ownerCheck() == '' ? '' : (data['ownerId'] = this.ownerCheck())
      (this.purchaseItem.value[0].client_id != '') ? data['clientId'] = this.fetchClient_id() : '';
      // clientId: this.fetchClient_id(),
    } else {
      this.VoucherOrGitftSale();

      data = {
        voucher: this.appointmentSales,
        // totalAmount: this.data.type == "Voucher" ? this.actualTip + this.actualPrice + this.actualTax : this.actualTip + this.actualPrice,
        totalAmount:
          this.data.type == "Voucher"
            ? this.actualPrice + this.actualTax
            : this.actualPrice,
        tips: this.tipsFormatting(),
        payment: this.paymentFormatting(),
        location: this.data.location,
        category: "voucher",
        ownerId: this.fetchOwnerId(),
        clientId: this.fetchClient_id()
      };
      // this.ownerCheck() == '' ? '' : (data['ownerId'] = this.ownerCheck())
    }
    //
    this._service.post(SALE, data).subscribe(
      res => {
        this.completeSalesClick = true;
        this.checkoutData = res;
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "Checkout Successful"
        });
        this.viewInvoice();
      },
      err => {
        data = {};
        this.appointmentSales = [];
        this._toast.add({
          severity: "error",
          summary: "Service Message",
          detail: "Checkout Failed"
        });
        this.completeSalesClick = true;
      }
    );
  }
  getAllStaff(): any {
    const staff = new Observable(observer => {
      if (this.staffLists.length != 0) {
        observer.complete();
      } else {
        this._service.get(GET_STAFF_DROP).subscribe(
          res => {
            this.staffLists = res;
            this.selectedStaffDetails = this.staffLists.filter(
              item => item._id == this.selectedStaff
            );
            observer.next({ res });
            observer.complete();
          },
          err => { }
        );
      }
    });
    return staff;
  }

  viewInvoice() {
    var getAppointment = {
      appointmentId: this.data.appointment_id,
      locationId: this.data.location_id,
      isChild: this.data.isChild
    };
    const dialogRef = this.dialog.open(InvoiceComponent, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      data: {
        invoiceId: this.checkoutData.result.invoice,
        getAppointment: getAppointment,
        tax:
          this.data.type == "Appointment" || this.data.type == "Voucher"
            ? this.actualTax
            : null
      }
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe(result => { });
  }

  //get client info
  getClientInfo(id) {
    this._service.get(`${CLIENT}/${id}`).subscribe(res => {
      this.clientData = res[0];
      this.searchClient =
      this.clientData &&
      `${this.clientData.firstName} ${this.clientData.lastName}`;
    this.searchClientEmail = this.clientData && `${this.clientData.email}`;
      this.changeRef.detectChanges();
    }),
      err => { };
  }


  getIntakeByIntakeId() {
    this.intakeForm(this.apt.intakeId);
  }
  intakeForm(intakedata): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { type: "viewIntake", intakedata: intakedata }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == "close") {
        }
      }
    });
  }

  //tip-component.ts
  addInvoiceDetatils() {
    const dialogRef = this.dialog.open(TipComponent, {
      data: { header: "Invoice details", selectedStaff: this.selectedStaff },
      width: "40%",
      height: "40%",
      panelClass: 'pad-Mnow321',
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  //on more option save unpaid/invoice details
  onMoreOptionSelected(value) {
    if (value == "Save Unpaid") {
    } else if (value == "Invoice Details") {
      this.addInvoiceDetatils();
    }
  }

  //to open the voucher modal
  voucher() {
    //
    let price = {
      totalPrice: this.actualPrice
    };
    const dialogRef = this.dialog.open(VoucherComponent, {
      width: "448px",
      panelClass: 'pad-Mnow321',
      position: { top: "20px" },
      data: {
        redemptionAmount: price,
        service: this.apt && this.apt.service.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.clientInfoComponent.test();
      this.paymentMode({ type: result.type, amount: result.amount , code : result.code });
    });
  }

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // + add tip modal open listener
  AddtipListener() {
    const dialogRef = this.dialog.open(TipComponent, {
      data: {
        header: "Add Tip",
        selectedStaff: this.selectedStaff,
        finalPrice: this.calculateActualPrice()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type && result.type == "save") {
        this.addTipBucket(result);
      }
    });
    this.clientInfoComponent.test();
  }

  //add tip
  addTipBucket(obj) {
    let isFoundObj;
    if (this.tipsArray.length != 0) {
      isFoundObj = this.tipsArray.some(it => {
        if (it.staff == obj.staff) {
          it.amount = Number(obj.amount) + Number(it.amount);
          return true;
        }
      });
    }
    if (!isFoundObj) {
      this.tipsArray.push({ ...obj });
    }
    this.calculateActualTip();
  }

  //total tip calculate
  calculateActualTip() {
    
    let sum = 0;
    if (this.tipsArray.length != 0) {
      this.tipsArray.forEach(it => {
        sum += Number(it.amount);
      });
      this.actualTip = sum;
    } else {
      this.actualTip = sum;
    }
    this.calculateGrandAmount();
    return this.actualTip;
  }

  //remove tip
  removeTipBucket(obj, i) {
    this.tipsArray.splice(i, 1);
    this.calculateActualTip();
  }
  //reactive form operations
  createPurchaseItem(form = null): FormGroup {
    if (form) {
      return this._formBuilder.group(formArray(form));
    }
  }

  addPurchaseItem(form = null): void {
    this.purchaseItem = this.CheckoutForm.get("purchaseItem") as FormArray;
    form
      ? this.purchaseItem.push(this.createPurchaseItem(form))
      : this.purchaseItem.push(this.createPurchaseItem());
  }



confirmCustom(data) {

  this.discountValue = data
  this.calculateActualPrice();
  this.calculateAppliedDiscount();
}


  //sum of the price or special price


  calculateThroughCustom() {

  }

  restrict(e: Number) {
    
    if(e < 0 || e > 100 || e > this.actualPrice) {
      this.errorPrice = true;
    } 
    if(e >= 0 && e <= this.actualPrice ) {
      this.errorPrice = false;
    }
  }

  

  //payment mode by cash | card | voucher | other
  paymentMode(obj) {
    //
    let isFoundObj;
    if (this.paymentArray.length != 0) {
      isFoundObj = this.paymentArray.some(it => {
        if (it.type == obj.type) {
          it.amount = Number(obj.amount) + Number(it.amount);
          return true;
        }
      });
    }
    if (!isFoundObj) {
      this.paymentArray.push({ ...obj });
    }
    this.calculateActualPayment();
  }

  //total payment calculate (Cash | voucher | card | other)
  calculateActualPayment() {
    let sum = 0;
    if (this.paymentArray.length != 0) {
      this.paymentArray.forEach(it => {
        sum += Number(it.amount);
      });
      this.actualPayment = sum;
    } else {
      this.actualPayment = sum;
    }
    this.calculateGrandAmount();
    return this.actualPayment;
  }

  //remove Payment
  removePaymentBucket(obj, i) {
    this.paymentArray.splice(i, 1);
    this.calculateActualPayment();
  }


  calculateGrandAmount() {
    //
    this.grandAmount =
      Number(this.actualPrice) != Number(this.actualTaxAmt) 
      ? Number(this.actualPrice) + Number(this.actualTip) - Number(this.actualPayment)
       : Number(this.actualPrice) + Number(this.actualTip) + Number(this.actualTax) - Number(this.actualPayment);
    this.grandAmount = parseFloat(this.grandAmount.toFixed(2));
    if (Number(this.grandAmount) == 0) {
      this.isPayMode = true;
    } else {
      this.isPayMode = false;
    }
    this.clientInfoComponent.test();
  }

  calculateTax(amount) {
    //;
    // this.data.location_id
    let location =
      this.data && this.data.location_id
        ? this.data.location_id
        : this.data.location;
    this._service.get(`${TAX_CAL}${location}&amount=${amount}`).subscribe(
      res => {
        this.taxData = res.result;
        this.actualTaxAmt = Number(res.result.amount);
        this.actualTax = Number(res.result.tax);
        this.calculateGrandAmount();
        this.loader = false;
        this.serviceVoucherAmount = res.result.totalAmount;
      },
      err => {
        console.error(err);
        this.loader = false;
      }
    );
  }

  customDiscountTypeListener(e,i){
    // this.purchaseItem.controls[i]['controls']['customDiscountType'].updateValueAndValidity();
    this.purchaseItem.controls[i]['controls']['customDiscountValue'].updateValueAndValidity();
  }



  /// IDEA BLF
calculateAppliedDiscount(){

  let app = this.purchaseItem.value;
    let totalAppliedAmt = 0;
    let totalAppliedPer = 0;


app.forEach(it => {

  

    if(it.discountSelected['valueType'] == 'amount' || it.discountSelected['valueType'] == 'percentage'){
      if(it.discountSelected['valueType'] == 'amount'){
        totalAppliedAmt +=  Number(it.discountSelected['value'])
      }
      else{
        totalAppliedPer += Number(it.discountSelected['value'])
      }
    }
   else if(it.discountSelected ==  'custom') {
             if(it.customDiscountType == 'amount')
              totalAppliedAmt += Number(it.customDiscountValue)
             else
              totalAppliedPer += Number(it.customDiscountValue)
             
           }
     else if(it.discountSelected == 'No_Discount'){
                
     }      
});

this.totalAppliedDiscount = Number(totalAppliedAmt);
this.totalAppliedPercentage = Number(totalAppliedPer);

}


discountChanges(e,i) {

let discountSelected = this.purchaseItem['controls'][i]['controls']['discountSelected'].value;
let price = this.purchaseItem['controls'][i]['controls']['price'].value;
let specialPrice = this.purchaseItem['controls'][i]['controls']['special_price'].value;


if(discountSelected.value && (discountSelected.valueType =='percentage' || discountSelected.valueType =='amount')){
  if(!!specialPrice){
    if(discountSelected.valueType =='percentage'){
      if(discountSelected.value > 100){
        this.purchaseItem['controls'][i]['controls']['discountSelected'].setValue('No_Discount');
      }
    }
    else{
      if(discountSelected.value > specialPrice){
        this.purchaseItem['controls'][i]['controls']['discountSelected'].setValue('No_Discount');
      }
    }
  }
  else{
    if(discountSelected.valueType =='percentage'){
      if(discountSelected.value > 100){
        this.purchaseItem['controls'][i]['controls']['discountSelected'].setValue('No_Discount');
      }
    }
    else{
      if(discountSelected.value > price){
        this.purchaseItem['controls'][i]['controls']['discountSelected'].setValue('No_Discount');
      }
    }
  }
}

   this.calculateActualPrice();
   this.calculateAppliedDiscount()
}


calculateActualPrice() {
    //
  let appointmentForm = this.purchaseItem.value;
  let sum = 0;
  appointmentForm.forEach(it => {

    if (!!it.special_price) {
      let finalDisc = 0;
      if(it.discountSelected == 'custom') {
        finalDisc =  it.customDiscountType == 'percentage' ? ((it.customDiscountValue * it.special_price)/100) : (it.customDiscountValue )
      }
      else if(it.discountSelected.valueType == "amount" || it.discountSelected.valueType == "percentage" ){
        if(it.discountSelected.valueType == 'percentage')         
           finalDisc = (it.discountSelected.value * it.special_price)/100;          
        else
          finalDisc = it.discountSelected.value;          
      }
      else{
        finalDisc = it.discountSelected == 'No_Discount' ? 0 :  it.discountSelected;          
      }
      sum += Number(it.special_price) - finalDisc;
    } else {
      let finalDisc = 0;
      if(it.discountSelected == 'custom') {
        finalDisc =  it.customDiscountType == 'percentage' ? ((it.customDiscountValue * it.price)/100) : (it.customDiscountValue )
      }
      else if(it.discountSelected.valueType == "amount" || it.discountSelected.valueType == "percentage" ){
        if(it.discountSelected.valueType == 'percentage')         
           finalDisc = (it.discountSelected.value * it.price)/100;          
        else
          finalDisc = it.discountSelected.value;          
      }
      else{
        finalDisc = it.discountSelected == 'No_Discount' ? 0 :  it.discountSelected;
        
      }
      sum += Number(it.price) - finalDisc;
    }
  });
  this.actualPrice = sum;
  this.calculateGrandAmount();
  if (this.data.type == "Appointment" || this.data.type == "Voucher") {
    this.calculateTax(this.actualPrice);
  } else {
    this.spinner.hide();
    this.loader = false;
  }
  return this.actualPrice;
}

//by kavish

showMenu(e) {
  this.ifClicked = !this.ifClicked;
}

//by kavish

selectClient(item) {
  this.clientList = false;
  this.clientIntakeFormFilled = false;
  this.walkIn = false;
  if (item.firstName)
    this.searchClient = item.firstName + " " + item.lastName;
  else this.ifClicked = true;
  // if (item.clientId) {
  //   this.appointmentForm.controls["client"].setValue(item.clientId);
  // }
  // if (item._id) {
  //   this.appointmentForm.controls["client"].setValue(item._id);
  // }
  this.getClientDetailsNoLocation(
    item.clientId || item._id._id ? item.clientId || item._id._id : item._id
  );
  this.getClientInfo(
    item.clientId || item._id._id ? item.clientId || item._id._id : item._id
  );
  this.getClientInvoices(
    item.clientId || item._id._id ? item.clientId || item._id._id : item._id
  );
  this.select_Client = "selected";
}

select_Client: string = "";

getClientInvoices(client_id) {
  this._service.get(`${INVOICE}/client/${client_id}`).subscribe(
    res => {
      this.clientInvoices = res.result;
    },
    err => { }
  );
}

getClientDetailsNoLocation(client_id) {
  this._service.get(`${CLIENT_INFO}${client_id}`).subscribe(
    res => {
      this.clientDetails = res.clientInfo;
      this.appointment = res.appointment;
    },
    err => { }
  );
}

editPrice(e,i,t) {
  console.log(t);
  if(t == 'special_price'){
    // this.purchaseItem['controls'][i]['controls']['special_price'].setValue(e);
  }
  if( t == 'price'){
// this.purchaseItem['controls'][i]['controls']['price'].setValue(e);
  }
  
  // this.purchaseItem.controls[i]['controls']['customDiscountValue'].updateValueAndValidity();
// setTimeout(() => {
  this.calculateAppliedDiscount();
  this.calculateActualPrice();
  this.calculateGrandAmount();
// }, 100);
  // this.purchaseItem.updateValueAndValidity();
}

userQuestionUpdate = new Subject<string>();

}
