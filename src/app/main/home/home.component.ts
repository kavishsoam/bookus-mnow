import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOCATION, INTAKE } from '../../services/url';
import { ApiService } from 'app/services/api.service';
import * as moment from "moment";
import { FormControl } from '@angular/forms';
import { array } from '@amcharts/amcharts4/core';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { TranslatePipe } from 'app/translate/translate.pipe';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userId: any;
  ownerId: any;
  locationId: any;
  graphResult: any;
  multi: any;
  appointmentList: any;
  sendData : any;
  startDt : any;
  endDt : any;
  filterForm : any;
  currencyCode : any;
  sales : any = 'SALES'

  displayedColumns: string[] = ['topservice', 'thismonth', 'lastmonth'];
  dataSource : any = [];
  totalAppointments: any;
  totalAppointmentSales: any;
  totalSales: any;
  isSpinner: boolean = true;
  // [
  //   { topservice: 'Swedish Massage', thismonth: 5, lastmonth: 2 },
  //   { topservice: 'Aromatherapy Massage', thismonth: 4, lastmonth: 1 },
  //   { topservice: 'Hot Stone Massage', thismonth: 6, lastmonth: 7 },
  //   { topservice: 'Deep Tissue Massage', thismonth: 1, lastmonth: 0 },
  //   { topservice: 'Shiatsu Massage', thismonth: 3, lastmonth: 2 },
  // ];

  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  viewData: any = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  locations = new FormControl();
  viewsValues = new FormControl();
  itemsValues = new FormControl();
  yearsValues = new FormControl();
  topServiceData = [];
  filterDataType = [{
    locationId : '',
    items : '',
    views : '',
    years : '',
    startDate : '',
    endDate : ''
  }]
  saleDateTimeRange: any;
  locationDrop: any = [
    {
      value: 'noida',
      viewValue: 'Noida'
    },
    {
      value: 'delhi',
      viewValue: 'Delhi'
    },
    {
      value: 'ghaziabad',
      viewValue: 'Ghaziabad'
    },
    {
      value: 'haryana',
      viewValue: 'Haryana'
    }
  ]

  viewDrop: any = [
    {
      value: 'week',
      viewValue: 'Weekly'
    },
    {
      value: 'month',
      viewValue: 'Monthly'
    },
    {
      value: 'year',
      viewValue: 'Yearly'
    }
  ]

  itemDrop: any = [
    {
      value: 'services',
      viewValue: 'Services'
    },
    // {
    //   value: 'products',
    //   viewValue: 'Products'
    // },
    {
      value: 'giftcard',
      viewValue: 'Gift Card'
    }
  ]

  yearsVal: any = [
    {
      value: '2018',
      viewValue: '2018'
    },
    {
      value: '2019',
      viewValue: '2019'
    },
    {
      value: '2020',
      viewValue: '2020'
    }]
    pageHeader: Object = { header: "Home", navigate: false }




  constructor(private _fuseConfigService: FuseConfigService,
    private changeRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _service: ApiService,
  ) { 

    this.saleDateTimeRange = [new Date(new Date().getTime() - (8 * 24 * 60 * 60 * 1000)), new Date()];
    this.startDt = this.saleDateTimeRange[0];
    this.endDt = this.saleDateTimeRange[1];
  }

  ngOnInit() {

    //
    this.getAllLocationList();
    this.currencyCode = localStorage.getItem('currency')
    this.userId = localStorage.getItem('id');
    this.ownerId = localStorage.getItem('owner');
    this.locationId = localStorage.getItem('location_id');
    this.setPageHeader();
    this.spinner.show();
    this.isSpinner = true;
    // this.changeRef.detectChanges();
    this.topService();
    this.viewsValues.setValue('week');
    this.itemsValues.setValue(['services','giftcard']);
  }

  topService() {
    this._service.get('analytics/top_services/'+ this.ownerId).subscribe(res=>{
      console.log('top services ===>>',res);
      let pastMonth = res['result']['pastMonth'];
      let thisMonth = res['result']['thisMonth'];
      //
        pastMonth.forEach(element => {

        thisMonth.forEach(ele => {
          if(ele.id == element.id){
            element['thismonthCount'] = ele.count;
            this.topServiceData.push(element);
          }
            // ele.count = 0;
            // element['thismonthCount'] = 0;
            // this.topServiceData.push(ele);
        });

      });
      this.dataSource = this.topServiceData;
    },err=>{
      console.log(err);
    })

    // setTimeout(() => {
    //   console.log('this.topServiceData ==>>> ',this.topServiceData);
    //   this.dataSource = this.topServiceData;
    // }, 500);
    
  }

  getAllLocationList() {
    this._service.get(LOCATION+'?list=true').subscribe(res=>{
      let arr = [];

      res.forEach(element => {
        let obj;
        obj = {value : element._id, viewValue : element.name}
        arr.push(obj);
      });
      this.locationDrop = arr;
      this.locationId = res[0]['_id'];
        this.filterData();
        this.locations.setValue(res[0]['_id']);

    },err=>{
      console.log(err);
    })
  }


  graphApi(data) {
    //
    if(!data[0].locationId)
    data[0].locationId = this.locationId;
    
    if(!data[0].startDate && !data[0].endDate){
      data[0].startDate = this.startDt;
      data[0].endDate = this.endDt;
    }


      if(data[0].views){
        // this.apiChangeFunc();
        this._service.get('analytics/therapist_graph/'+ this.userId + '?ownerId=' + this.userId + '&start_date=' + data[0].startDate.toISOString() + '&end_date=' + data[0].endDate.toISOString() + '&locationId=' + data[0].locationId + '&'+data[0].views + '=true').subscribe(res=>{
          console.log(res);
          this.isSpinner = false;
          this.totalAppointments = res.appointmentCount;
          this.totalAppointmentSales = res.salesTotal;
          this.totalSales = res.salesTotal;
          this.sendData = res;
        },err=>{
          this.isSpinner = false;
          console.log(err);
        })
      }
      else{
        // this.apiChangeFunc2();

        this._service.get('analytics/therapist_graph/'+ this.userId + '?ownerId=' + this.userId + '&start_date=' + data[0].startDate.toISOString() + '&end_date=' + data[0].endDate.toISOString() + '&locationId=' + data[0].locationId).subscribe(res=>{
          this.isSpinner = false;
          this.totalAppointments = res.appointmentCount;
          this.totalAppointmentSales = res.salesTotal;
          this.totalSales = res.salesTotal;
          console.log(res);
          this.sendData = res;
        },err=>{
          this.isSpinner = false;
          console.log(err);
        })
      }
    


 
  }

  apiChangeFunc() {

  }

  apiChangeFunc2() {

  }


  inputChange(e) {
    this.startDt = 0;
    this.endDt = 0;
    this.startDt = e[0];
    this.endDt = e[1];
  }


  filterData() {
    this.isSpinner = true;
    this.filterDataType.map(item=>{
      item.locationId = this.locations.value;
      item.views = this.viewsValues.value;
      item.items = this.itemsValues.value;
      item.years = this.yearsValues.value;
      item.startDate = this.startDt;
      item.endDate = this.endDt;
    })

    this.graphApi(this.filterDataType)
  }


  plotGraph() {
    //;
    let appointmentObj = { "name": "appointment", "series": [] };
    let salesObj = { "name": "sales", "series": [] };
    let innerObj = { "name": "", "value": "" }
    let appointments = this.graphResult.appointment;
    let sales = this.graphResult.sales;
    // let i = -1;
    for (let i = 0; i < appointments.length; i++) {
      let id = appointments[i]["_id"].split('-')[2] + "00";
      let value = appointments[i]["totalAmount"];
      var con = +value;
      var fon = +id
      let obj = {};
      obj["name"] = fon;
      obj["value"] = con;
      appointmentObj["series"][i] = obj;
    }
    this.multi[0] = appointmentObj;

    for (let j = 0; j < sales.length; j++) {
      let id = sales[j]["_id"].split('-')[2] + "00";
      let value = sales[j]["totalAmount"];
      var con = +value;
      var fon = +id;
      let obj = {};
      obj["name"] = fon;
      obj["value"] = con;
      salesObj["series"][j] = obj;
    }
    this.multi[1] = salesObj;
    //("[results]=>>>>", JSON.stringify(this.multi));
  }

  appointmentGraphDatas(event) {
    //('data passed from graph @Output==>>', event);
  }

   // salesByLocationApi() {

  //   let userId = localStorage.getItem('id');
  //   let startDate = new Date();
  //   let endDate = moment().subtract(8, 'd').toDate();

  //   this._service.get('analytics/' + userId + '?type=' + LOCATION + '&start_date=' + endDate + '&end_date=' + startDate).subscribe(res => {
  //     //('response of analytics location api ------>>>>>', res);
  //     if (res.result.length <= 0) {
  //       this.appointmentList = res.result;
  //     }
  //     else {
  //       this.appointmentList = res.result;
  //     }
  //   }, err => {
  //   })
  // }

  // graphSalesApi(data) {

  //   this._service.get('analytics/therapist_graph/?staffId=' + this.userId + '&ownerId=' + this.ownerId + '&start_date=2019-12-02T07:58:49.833Z&end_date=2019-12-26T07:58:49.833Z&locationId=' + this.filterDataType['locations']).subscribe(res => {
  //     if (res) {
  //       //('Response of graph api===>>>', res);
  //       this.graphResult = res;
  //       setTimeout(() => {
  //         this.plotGraph();
  //       })
  //     }

  //   }, err => {
  //     //('error', err)
  //   })
  // }

}
