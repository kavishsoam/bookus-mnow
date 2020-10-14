import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import * as moment from "moment";
import { ExportService } from 'app/services/export.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-salesby',
  templateUrl: './salesby.component.html',
  styleUrls: ['./salesby.component.scss']
})
export class SalesbyComponent implements OnInit {

  salesByClient: any;
  data: any;
  salesService: any;
  salesStaff: any;
  dataSource: any = [];
  userId: any;
  dataSource1: any;
  dataSource2: any;
  dtRange2 = new Date();
  saleDateTimeRange: any = {};
  displayedColumns2: string[] = ['name', 'discount', 'tax', 'count', 'totalSum', 'grossSale', 'netSale'];
  constructor(public router: Router, public service: ApiService,private exportFile: ExportService, private spinner : NgxSpinnerService) {
    this.userId = localStorage.getItem('id');
    router.events.subscribe((url: any) => {
      //('router url in sales by comp==>>', router.url);
      if (router.url === '/main/analytics/salesby?order=service') {
        this.salesStaff = false;
        this.salesService = true;
      }

      if (router.url === '/main/analytics/salesby?order=staff') {
        this.data = "staff";
        this.salesService = false;
        this.salesStaff = true;
      }

      // if(router.url === '/main/analytics/salesby?order=service'){

      // }

      // if(router.url === '/main/analytics/salesby?order=service'){

      // }
    });
  }
  type: any;

  ngOnInit() {
    this.saleDateTimeRange = [new Date(2019, 11, 12, 10, 30), new Date(2020, 1, 21, 20, 30)];
    // this.saleDateTimeRange.push(new Date(2018, 1, 12, 10, 30));
    // var date = moment().add(8, 'd').toDate(2018, 1, 12, 10, 30);
    // this.saleDateTimeRange.push(date);

    if (this.salesService) {
      this.inputChange(this.saleDateTimeRange);
    }
    if (this.salesByStaff) {
      this.inputChange(this.saleDateTimeRange);
    }

    // this.saleDateTimeRange.push(new Date().setHours(0, 0, 0, 0));
    // var date = moment().add(8, 'd').toDate().setHours(0, 0, 0, 0);
    // this.saleDateTimeRange.push(date);
    // this.inputChange(this.saleDateTimeRange);

  }

  salesByService(data) {
    console.log("date", data);
    this.spinner.show();
    this.service.get('analytics/' + this.userId + '?type=service&start_date=' + data['startDate'] + '&end_date=' + data['endDate']).subscribe(res => {
      this.spinner.hide();
      if (res) {
        //('analytics service===>>>>', res);
        this.dataSource = res.result;
      }
    }, err => {
      this.dataSource = [];
      this.spinner.hide();
      //(err);
    })

  }

  salesByStaff(data) {
    this.spinner.show();

    this.service.get('analytics/' + this.userId + '?type=staff&start_date=' + data['startDate'] + '&end_date=' + data['endDate']).subscribe(res => {
      this.spinner.hide();
      if (res) {
        //('analytics staff===>>>>', res);
        this.dataSource = res.result;
      }
    }, err => {
      this.dataSource = [];
      this.spinner.hide();
      //(err);
    })
  }

  inputChange(event) {
    let time = {}

    time['startDate'] = event[0];
    time['endDate'] = event[1];

    if (this.salesService)
      this.salesByService(time);
      
    if (this.salesStaff)
      this.salesByStaff(time);
  }


  onOptionSelected(e, tab) {
    if (e == "CSV") this.csvDownload("csv", tab);
    if (e == "Excel") this.csvDownload("xlsx", tab);
    if (e == "Pdf") this.csvDownload("Pdf", tab);
  }
  csvDownload(type, tab) {
    if (tab == "closeDate") {
      this.exportFile.print(
        type,
        [
          { label: "Name", type: "text", value: "name" },
          { label: "Discount", type: "text", value: "discount" },
          { label: "Tax", type: "text", value: "tax" },
          { label: "Count", type: "text", value: "count" },
          { label: "Total_Sum", type: "text", value: "totalSum" },
          { label: "Gross_Sale", type: "text", value: "grossSale" },
          { label: "Net_Sale", type: "text", value: "netSale" }
        ],
        ["Name", "Discount", "Tax", "Count", "Total_Sum", "Gross_Sale", "Net_Sale"],
        this.dataSource,
        "closeDate",
        "Close Date List",
        "Auto-generated close date data"
      );
    }

    // if (tab == "staff") {
    //   this.exportFile.print(
    //     type,
    //     [
    //       { label: "First Name", type: "text", value: "firstName" },
    //       { label: "Last Name", type: "text", value: "lastName" },
    //       { label: "Email", type: "text", value: "email" },
    //       { label: "Title", type: "text", value: "staffTitle" },
    //       {
    //         label: "Service Commission",
    //         type: "text",
    //         value: "service_commission"
    //       },
    //       {
    //         label: "Specific Commission",
    //         type: "text",
    //         value: "specific_commission"
    //       },
    //       { label: "Phone", type: "text", value: "phone" }
    //     ],
    //     [
    //       "First Name",
    //       "Last Name",
    //       "Email",
    //       "Title",
    //       "Service Commission",
    //       "Specific Commission",
    //       "Phone"
    //     ],
    //     this.staffList,
    //     "staff",
    //     "Staff List",
    //     "Auto-generated staff data"
    //   );
    // }
  }

}
