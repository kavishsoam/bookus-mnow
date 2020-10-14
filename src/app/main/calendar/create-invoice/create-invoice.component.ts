import { Component, OnInit, Optional, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { CheckOutComponent } from "../check-out-appointment/check-out/check-out.component";
import { SERVICE_GP, SERVICE } from "../../../services/url";
import { ApiService } from "app/services/api.service";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "app-create-invoice",
  templateUrl: "./create-invoice.component.html",
  styleUrls: ["./create-invoice.component.scss"]
})
export class CreateInvoiceComponent implements OnInit {
  // selected = '6 Months';

  startDate = new Date();
  endTime: any = new Date();

  expiryPeriod = [
    { value: "1 Month", viewValue: "1 Month" },
    { value: "2 Months", viewValue: "2 Months" },
    { value: "3 Months", viewValue: "3 Months" },
    { value: "6 Months", viewValue: "6 Months" },
    { value: "1 Year", viewValue: "1 Year" },
    { value: "End of this month", viewValue: "End of this month" },
    { value: "No Expiry", viewValue: "No Expiry" },
    { value: "custom", viewValue: "custom" }
  ];
  serviceLoader: boolean;
  serviceGroupLoader: boolean;
  giftVoucherClicked: boolean = false;
  serviceVoucherClicked: boolean = false;
  serviceGroupClicked: boolean = false;
  serviceGroupLists: any = [];
  serviceLists: any = [];
  id: any;
  voucherValue: any;
  voucherCode: any;
  expiry: any = "6 Months";
  location: any;
  timepicker: boolean;
  giftVoucherForm: FormGroup;
  constructor(
    @Optional() public dialogRef: MatDialogRef<CreateInvoiceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _service: ApiService
  ) { }
  ngOnInit() {
    this.location = this.data.location_id;
  }
  checkoutDialog(value, priceValue) {
    //;

    // Header: "Edit Appointment"
    // Id: "5ce784b42ed87600182b4fe7"
    // bookedBy: {id: "5ce780822ed87600182b4fce", type: "staff", name: "vijaya vijaya"}
    // booking_reference: "AVFCANVW"
    // checkout: false
    // childrenNo: ""
    // client: {_id: "5ce782d62ed87600182b4fdc", firstName: "Siddharth  ", lastName: "Bahl"}
    // createdAt: "2019-05-24T05:44:20.214Z"
    // day: "2019-05-24T03:07:30.000Z"
    // endTime: "2019-05-24T03:47:30.000Z"
    // location: "5ce780822ed87600182b4fcf"
    // location_id: "5ce780822ed87600182b4fcf"
    // notes: ""
    // ownerId: "5ce780822ed87600182b4fce"
    // price: 400
    // requested_staff: false
    // service: {id: "5ce780e32ed87600182b4fd4", name: "Service 1", commissionEnabled: true}
    // service_group_color: "#ef9a9a"
    // service_pricing_name: "special"
    // special_price: 300
    // staff: {id: "5ce780822ed87600182b4fce", firstName: "vijaya", lastName: "mallya"}
    // startTime: "2019-05-24T03:07:30.000Z"
    // status: "new"
    // status_color: "#6DA6F8"
    // updatedAt: "2019-05-24T05:44:20.214Z"
    // walkIn: false

    //value date ::::::::::::::
    // commissionEnabled: true
    // createdAt: "2019-05-24T05:28:03.228Z"
    // description: ""
    // extraTime: {extra_time_type: "", duration: ""}
    // name: "Service 1"
    // onlineBooking: true
    // ownerId: "5ce780822ed87600182b4fce"
    // pricing_option: [{duration: "40 min",price: 400,specialPrice: 300,specialPriceFor: "special"}]
    // resourceRequired: false
    // room: true
    // serviceFor: "Everyone"
    // serviceType: "type 1"
    // staff: ["5ce780822ed87600182b4fce"]
    // updatedAt: "2019-05-24T05:28:03.228Z"
    // voucherEnabled: true
    // voucherExpiry: null
    // _id: "5ce780e32ed87600182b4fd4"

    let voucherData = [
      {
        //serivce-voucher
        service: {
          id: value && value._id ? value._id : "",
          name: value && value.name ? value.name : "Gift Voucher",
          commissionEnabled:
            value && value.commissionEnabled ? value.commissionEnabled : ""
        },
        special_price:
          value && value.pricing_option && value.pricing_option.length > 0
            ? value.pricing_option[0] && value.pricing_option[0].specialPrice
              ? value.pricing_option[0].specialPrice
              : ""
            : "",
        price:
          value && value.pricing_option && value.pricing_option.length > 0
            ? value.pricing_option[0] && value.pricing_option[0].price
              ? value.pricing_option[0].price
              : ""
            : this.voucherValue,
        duration:
          value && value.pricing_option && value.pricing_option.length > 0
            ? value.pricing_option[0] && value.pricing_option[0].duration
              ? value.pricing_option[0].duration
              : ""
            : "",
        staff: {
          id:
            value && value.staff && value.staff.length > 0
              ? value.staff[0]
              : "",
          firstName: "",
          lastName: ""
        },

        //gift- voucher
        expiry: this.expiry,
        giftVoucherAmt: this.voucherValue
      }
    ];

    const dialogRef = this.dialog.open(CheckOutComponent, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      data: {
        header: "Checkout",
        type: this.voucherValue ? "Gift" : "Voucher",
        serviceVoucher: value,
        pricing: priceValue,
        value: this.voucherValue,
        expiry: this.expiry,
        _type: this.voucherValue ? "Gift Voucher" : "Service Voucher",
        location: this.location,
        voucherCode: this.voucherCode,
        voucherData: voucherData,
        voucherCheckout: true
      }
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe(result => { });
  }

  giftVoucher() {
    this.data.Header = "Gift Voucher";
    this.giftVoucherClicked = true;
  }

  goBack() {
    if (this.data.Header == "Gift Voucher") {
      this.giftVoucherClicked = false;
      this.data.Header = "Vouchers";
    } else if (this.data.Header == "Service Vouchers") {
      this.serviceVoucherClicked = false;
      this.data.Header = "Vouchers";
    } else {
      this.serviceLists = [];
      this.serviceGroupClicked = false;
      this.serviceVoucherClicked = true;
      this.data.Header = "Service Vouchers";
    }
  }
  serviceGroupList() {
    this.serviceGroupLoader = true;
    this.getServiceGroup();
    this.serviceVoucherClicked = true;
    this.data.Header = "Service Vouchers";
  }
  serviceList(data) {
    this.serviceLoader = true;
    this.getServiceList(data._id);
    this.serviceGroupClicked = true;
    this.data.Header = data.name;
  }
  getServiceGroup() {
    this._service.get(SERVICE_GP).subscribe(
      res => {
        this.serviceGroupLoader = false;
        this.serviceGroupLists = res;
      },
      err => { }
    );
  }
  getServiceList(id) {
    this._service.get(`${SERVICE}/${id}`).subscribe(
      res => {
        this.serviceLoader = false;
        this.serviceLists = res[0].services;
      },
      err => { }
    );
  }


  selectedChange(e) {
    //(e);
  }


  onDate(e) {
    //(e);
    // let startDate = e;
    this.endTime = e;
  }


  endDate(e) {
    //(e);
  }
  // optionChanged() {
  //   // //('selected value',value);
  //   // //('event ===>>>', event);
  //   //(this.expiry);
  //   if(this.expiry == 'custom'){
  //     this.timepicker = true;
  //   }
  //   else{
  //     this.timepicker = false
  //   }
  // }


}
