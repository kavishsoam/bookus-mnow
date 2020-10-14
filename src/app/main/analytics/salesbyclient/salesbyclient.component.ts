import { Component, OnInit } from '@angular/core';
import { ExportService } from 'app/services/export.service';
import { ApiService } from 'app/services/api.service';
import { CLIENT, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-salesbyclient',
  templateUrl: './salesbyclient.component.html',
  styleUrls: ['./salesbyclient.component.scss']
})



export class SalesbyclientComponent implements OnInit {

  clientList: any = [];
  userId: any;
  dataSource: any = [];
  displayedColumns: string[] = ['name', 'discount', 'tax', 'TotalSum', 'NetSale', 'GrossSale', 'count'];
  saleDateTimeRange: any = [];

  constructor(
    private exportFile: ExportService,
    private _service: ApiService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.saleDateTimeRange = [new Date(2019, 11, 12, 10, 30), new Date(2020, 1, 21, 20, 30)];
    this.inputChange(this.saleDateTimeRange)
  }


  getAllClients(data) {
    this.spinner.show();
    this._service.get('analytics/' + this.userId + '?type=' + CLIENT + '&start_date=' + data['startDate'] + '&end_date=' + data['endDate']).subscribe(res => {
      //("res==>", res);
      this.spinner.hide();
      if (res.result.length == 0)
        this.dataSource = res.result;
      else
        this.dataSource = res.result;
    }, err => {
      this.dataSource = [];
      this.spinner.hide();
    })
  }


  onOptionSelected(e) {
    if (e == "CSV") this.csvDownload("csv");
    if (e == "Excel") this.csvDownload("xlsx");
    if (e == "Pdf") this.csvDownload("Pdf");
  }
  csvDownload(type) {
    this.exportFile.print(type,
      [{ label: "Name", value: "name" },
      { label: "Discount", value: "discount" },
      { label: "Tax", value: "tax" },
      { label: "Total Sum", value: "totalSum" },
      { label: "Net Sale", value: "NetSale" },
      { label: "Gross Sale", value: "GrossSale" },
      { label: "Count", value: "count" }
      ],
      ["Name", "Discount", "Tax", "Total Sum", "Net Sale", "Gross Sale", "Count"],
      this.dataSource,
      "client",
      "Client List",
      "Auto-generated client data")
  }

  applyFilter() {
  }


  inputChange(event) {
    //(event);
    //(this.saleDateTimeRange);

    if (event && this.saleDateTimeRange) {
      let time = {}
      // this.saleDateTimeRange[0] = 
      time['startDate'] = event[0];
      time['endDate'] = event[1];
      this.getAllClients(time);
    }

  }

}
