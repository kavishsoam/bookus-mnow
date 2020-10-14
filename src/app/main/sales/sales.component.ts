import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FuseConfigService } from "@fuse/services/config.service";
import { ApiService } from "app/services/api.service";
import { INVOICE, LOC_LIS, VOUCHER, SALEREP } from "app/services/url";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ExportService } from "app/services/export.service";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"]
})
export class SalesComponent implements AfterViewInit {
  // @ViewChild ('mytable') mytable: ElementRef;

  @ViewChild('mychild') mychild : ElementRef;


  ngAfterViewInit(): void {}
  selectedIndex : any = 0;
  locSelected = "";
  saleDateTimeRange: any = [];
  saleData: any = [];
  selected2 = "Options";
  export = [
    { value: "Export", viewValue: "Export" },
    { value: "Excel", viewValue: "Excel" },
    { value: "PDF", viewValue: "PDF" },
    { value: "CSV", viewValue: "CSV" }
  ];
  voucherColumns: string[] = [
    "issueDate",
    "expiryDate",
    "invoiceNo",
    "_type",
    "code",
    "remainingAmount",
    "redeemAmount",
    "status"
  ];
  voucher: any = [];
  voucherfilter = new MatTableDataSource(this.voucher);
  invoice: any = [];
  invoiceColumns: string[] = [
    "invoice",
    "client",
    "status",
    "createdAt",
    "location",
    "totalAmount"
  ];
  invoiceFilter = new MatTableDataSource(this.invoice);
  voucherStatus: any = "all_statuses";
  registerForm: FormGroup;
  displayedColumns: string[] = ["item_type", "count", "amount"];
  dataSource = [
    { itemtype: "Services", salesqty: 0, refundqty: 0, grosstotal: "₹0.00" },
    { itemtype: "Products", salesqty: 0, refundqty: 0, grosstotal: "₹0.00" },
    { itemtype: "Vouchers", salesqty: 0, refundqty: 0, grosstotal: "₹0.00" },
    {
      itemtype: "Cancellation Fees",
      salesqty: 0,
      refundqty: 0,
      grosstotal: "₹0.00"
    },
    { itemtype: "No Show Fees", salesqty: 0, refundqty: 0, grosstotal: "₹0.00" }
  ];
  registerForm2: FormGroup;
  displayedColumns2: string[] = [
    "paymentype",
    "paymentscollected",
    "refundspaid"
  ];
  dataSource2 = [
    { paymentype: "Cash", paymentscollected: "₹0.00	", refundspaid: "₹0.00	" },
    { paymentype: "Other", paymentscollected: "₹0.00	", refundspaid: "₹0.00	" },
    {
      paymentype: "Debit Card",
      paymentscollected: "₹0.00	",
      refundspaid: "₹0.00	"
    },
    {
      paymentype: "Credit Card",
      paymentscollected: "₹0.00	",
      refundspaid: "₹0.00	"
    },
    {
      paymentype: "Voucher Redemptions",
      paymentscollected: "₹0.00	",
      refundspaid: "₹0.00	"
    }
  ];
  invoiceData: any;
  locList: any = [];
  selectedLoc: any;
  date: any;
  dateTimeRange: any = [];
  currencyCode: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private _toast: MessageService,
    private exportFile : ExportService
  ) {}
  pageHeader: Object = { header: "Sales", navigate: false };

  ngOnInit() {
    this.currencyCode = localStorage.getItem("currency");
    this.setPageHeader();
    this.getAllLocationList();
    this.getAllVoucher();
    this.saleDateTimeRange.push(new Date());
    this.saleDateTimeRange.push(new Date());
    this.selectedIndex = parseInt(this._service.selectedIndex);
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  getInvoiceList() {
    this._service.get(`${INVOICE}?${this.selectedLoc}`).subscribe(
      res => {
        this.invoiceData = res.result;
      },
      err => {}
    );
  }
  getAllLocationList() {
    this._service.get(LOC_LIS).subscribe(
      res => {
        this.locList = res;
        if (!this.selectedLoc && this.locList.length != 0) {
          this.selectedLoc = this.locList[0]._id;
          this.locSelectedListener(this.selectedLoc);
          this.getInvoiceList();
        }
        this.getSalesByld();
      },
      err => {}
    );
  }
  locSelectedListener(loc_id) {
    this.selectedLoc = loc_id;
  }
  getAllVoucher() {
    this.spinner.show();
    this._service.get(`${VOUCHER}`).subscribe(
      res => {
        this.voucher = res.result;        
        this.voucherfilter = new MatTableDataSource(this.voucher);
        this.spinner.hide();
      },
      err => {
        this.voucher = [];
        this.voucherfilter = new MatTableDataSource(this.voucher);
        this.spinner.hide();
      }
    );
  }
  voucherStatusChanged(value) {
    this.spinner.show();
    this._service.get(`${VOUCHER}?status=${value.value}`).subscribe(
      res => {
        this.voucher = res.result;
        this.voucherfilter = new MatTableDataSource(this.voucher);
        this.spinner.hide();
      },
      err => {
        this.voucher = [];
        this.voucherfilter = new MatTableDataSource(this.voucher);
        this.spinner.hide();
      }
    );
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue; // MatTableDataSource defaults to lowercase matches
    this.voucherfilter.filter = filterValue;
  }
  getInvoiceByloc() {
    var date_from, date_to;
    if (this.dateTimeRange.length == 2) {
      date_from = this.dateTimeRange[0];
      date_to = this.dateTimeRange[1];
    } else {
      this._toast.add({
        severity: "warn",
        summary: "Service Message",
        detail: "Select the date range"
      });
      return;
    }
    this.spinner.show();
    const params = new HttpParams()
      .set("date_from", date_from)
      .set("date_to", date_to)
      .set("location_id", this.selectedLoc);
    this._service.get(`${INVOICE}`, params).subscribe(
      res => {
        console.log(res)
        this.invoice = res.result;
        this.invoiceFilter = new MatTableDataSource(this.invoice);
        console.log('invoice Filter==>>>',this.invoiceFilter);
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.invoice = [];
      }
    );
  }
  applyFilterInvoice(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue; // MatTableDataSource defaults to lowercase matches
    this.invoiceFilter.filter = filterValue;
  }
  getSalesByld() {
    if (this.saleDateTimeRange.length == 0) {
      this._toast.add({
        severity: "warn",
        summary: "Service Message",
        detail: "Select the date range"
      });
      return;
    }
    var datefrom = this.saleDateTimeRange[0];
    var dateto = this.saleDateTimeRange[1];
    var params = new HttpParams();
    if (this.selectedLoc == "" || this.selectedLoc == undefined) {
      params = params.set("date_from", datefrom).set("date_to", dateto);
    } else {
      params = params
        .set("location_id", this.selectedLoc)
        .set("date_from", datefrom)
        .set("date_to", dateto);
    }
    this._service.get(`${SALEREP}`, params).subscribe(
      res => {
        //
        var data = res.result;
        this.saleData = [];
        this.saleData.push({
          item_type: "Appointment",
          count: data.appointmentCount,
          amount: data.appointmentSale
        });
        this.saleData.push({
          item_type: "Vouchers",
          count: data.voucherCount,
          amount: data.voucherSale
        });
        this.saleData.push({
          item_type: "Total Sales",
          count: data.totalCount,
          amount: data.totalSale
        });
      },
      err => {}
    );
  }
  onOptionSelected(e,tab) {
    if (e == "CSV") this.csvDownload("csv",tab);
    if (e == "Excel") this.csvDownload("xlsx",tab);
    if (e == "Pdf") this.csvDownload("Pdf",tab);
  }  

  csvDownload(type,tab) {   
    if(tab == "invoice"){
      this.exportFile.print(type,
        [{label:"Category",type:'text',value:"category"},
        {label:"Client",type:'text',value:"client"},
         {label:"Invoice",type:'text',value:"invoice"},
          {label:"Location",type:'text',value:"location"},
           {label:"Status",type:'text',value:"status"}],
        ["Category", "Client", "Invoice", "Location", "Status"],
        this.invoice,
        "sales",
        "Sales",
        "Auto-generated sales data")
    }

    if(tab == "voucher"){

      this.exportFile.print(type,
        [{label:"Issue Date",type:'Date', value:"issueDate"},
        {label:"Expiry Date",type:'Date', value:"expiryDate"}, 
        {label:"Invoice No.",type:'text', value:"invoiceNo"}, 
        {label:"Remaining Amount",type:'text', value:"remainingAmount"}, 
        {label:"Redeem Amount",type:'text', value:"redeemAmount"},
        {label:"Status",type:'text', value:"status"},
        {label:"Value",type:'text', value:"value"},
        {label:"Staff First Name",type:'text', value:"staff.firstName"},
        {label:"Staff Last Name",type:'text', value:"staff.lastName"}
      ],
        ["Issue Date", "Expiry Date", "Invoice No.", "Remaining Amount", "Redeem Amount","Status","Value","Staff First Name","Staff Last Name"],
        this.voucher,
        "voucher",
        "Voucher List",
        "Auto-generated voucher data")

    }
    
  
  }

  
}
