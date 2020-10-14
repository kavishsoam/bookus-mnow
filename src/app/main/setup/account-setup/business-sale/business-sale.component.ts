import { Component, OnInit } from "@angular/core";
import { ApiService } from "app/services/api.service";
import { COMP, COMPANY_DETAILS, SALE_BUSINESS } from "app/services/url";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";
import { FuseConfigService } from "@fuse/services/config.service";

@Component({
  selector: "app-business-sale",
  templateUrl: "./business-sale.component.html",
  styleUrls: ["./business-sale.component.scss"],
})
export class BusinessSaleComponent implements OnInit {
  getCompanydetails: any;
  constructor(
    private service: ApiService,
    private _toast: MessageService,
    private _fuseConfigService: FuseConfigService
  ) {}

  pageHeader: Object = {
    header: "Sale Business",
    main: "Setup",
    navigate: true,
  };

  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }

  sellingReason: any;
  ngOnInit() {
    this.setPageHeader();
    this.getCompanydetailsFunc();
  }

  getCompanydetailsFunc() {
    this.service.get(COMPANY_DETAILS).subscribe(
      (res) => {
        console.log(res);
        this.getCompanydetails = res[0];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  /**
   * 
   * {{url}}/api/company/sale_business ===> PUT


Payload
{
    "saleBusiness" : true,
    "reasonForSelling": "moving from states",
    "salePrice": 10,
    "yearlyTurnOver": 10000,
    "totalEmployees": 10
}
   * 
   */
  saleBussiness() {
    if (
      this.sellingReason == undefined ||
      this.sellingReason == "" ||
      this.sellingReason == null ||
      this.sellingReason == NaN
    ) {
      this._toast.add({
        severity: "error",
        summary: "Service Message",
        detail: "Fill reason for selling",
      });
      return;
    }
    let data = {
      saleBusiness: true,
      reasonForSelling: this.sellingReason,
      salePrice: 10,
      yearlyTurnOver: 10000,
      totalEmployees: 10,
    };
    this.service.put(SALE_BUSINESS, data).subscribe(
      (res) => {
        console.log(res);
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: res.message,
        });
      },
      (err) => {
        console.log(err);
        this._toast.add({
          severity: "error",
          summary: "Service Message",
          detail: err.error,
        });
      }
    );
  }
}
