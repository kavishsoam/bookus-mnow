import { Component, OnInit } from '@angular/core';
import { ExportService } from 'app/services/export.service';
import { ApiService } from 'app/services/api.service';
import { LOCATION, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-salesbylocation',
  templateUrl: './salesbylocation.component.html',
  styleUrls: ['./salesbylocation.component.scss']
})
export class SalesbylocationComponent implements OnInit {


  clientList: any = [];
  userId: any;
  dataSource: any = [];
  displayedColumns: string[] = ['street', 'tax', 'TotalSum', 'NetSale', 'GrossSale', 'count'];
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
    this._service.get('analytics/' + this.userId + '?type=' + LOCATION + '&start_date=' + data['startDate'] + '&end_date=' + data['endDate']).subscribe(res => {
      //(res);
      this.spinner.hide()
      if (res.result.length <= 0) {
        this.dataSource = res.result;
      }
      else {
        this.dataSource = res.result;
      }
    }, err => {
      this.dataSource = [];
      console.log(err);
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
      [{ label: "Street", value: "street" },
      { label: "Discount", value: "discount" },
      { label: "Tax", value: "tax" },
      { label: "Total Sum", value: "TotalSum" },
      { label: "Net Sale", value: "NetSale" },
      { label: "Gross Sale", value: "GrossSale" },
      { label: "count", value: "count" }

      ],
      ["Street", "Discount", "Tax", "Total Sum", "Net Sale", "Gross Sale", "count"],
      this.dataSource,
      "client",
      "Client List",
      "Auto-generated client data")
  }

  applyFilter() {
  }


  inputChange(event) {
    if (event && this.saleDateTimeRange) {
      let time = {}
      time['startDate'] = event[0];
      time['endDate'] = event[1];
      this.getAllClients(time);
    }

  }

}
