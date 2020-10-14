import { Component, OnInit, AfterViewInit, NgZone, Output, EventEmitter, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";
declare var $: any;
import { LOCATION, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class LinechartComponent implements OnInit, AfterViewInit , OnChanges {

  appointmentList: any;
  private chart: am4charts.XYChart;
  userId: any;
  ownerId: any;
  graphResult: any;
  locationId: any;
  totalAppointment: any;
  appointmentTotalSale: any;
  @Output() appointmentGraphData = new EventEmitter();
  @Input() chartData : any;
  changedGraphJson: any = [{
      "year": "2010",
      "salesValue": 1,
      "appointments": 5,
      "uk": 3
    }, {
      "year": "2011",
      "salesValue": 1,
      "appointments": 2,
      "uk": 6
    }, {
      "year": "2012",
      "salesValue": 2,
      "appointments": 3,
      "uk": 1
    }, {
      "year": "2013",
      "salesValue": 3,
      "appointments": 4,
      "uk": 1
    }, {
      "year": "2014",
      "salesValue": 5,
      "appointments": 1,
      "uk": 2
    }, {
      "year": "2015",
      "salesValue": 3,
      "appointments": 2,
      "uk": 1
    }, {
      "year": "2016",
      "salesValue": 1,
      "appointments": 2,
      "uk": 3
    }, {
      "year": "2017",
      "salesValue": 2,
      "appointments": 1,
      "uk": 5
    }, {
      "year": "2018",
      "salesValue": 3,
      "appointments": 5,
      "uk": 2
    }, {
      "year": "2019",
      "salesValue": 4,
      "appointments": 3,
      "uk": 6
    }, {
      "year": "2020",
      "salesValue": 1,
      "appointments": 2,
      "uk": 4
    }];
    

  constructor(private zone: NgZone, private service: ApiService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.ownerId = localStorage.getItem('owner');
    this.locationId = localStorage.getItem('location_id');

    console.log('',this.chartData)
  }



  // salesByLocationApi() {
  //   //
  //   let userId = localStorage.getItem('id');
  //   let startDate = new Date();
  //   let endDate = moment().subtract(8, 'd').toDate();

  //   this.service.get('analytics/' + userId + '?type=' + LOCATION + '&start_date=' + endDate + '&end_date=' + startDate).subscribe(res => {
  //     //('response of analytics location api ------>>>>>', res);
  //     if (res.result.length <= 0) {
  //       this.appointmentList = res.result;
  //       this.totalAppointment = res['appointmentCount'];
  //       this.appointmentTotalSale = res['appointmentTotal'];
  //     }
  //     else {
  //       this.appointmentList = res.result;
  //     }
  //   }, err => {
  //   })
  // }

  // graphSalesApi() {
  //   //("within graph sale Api")
  //   this.service.get('analytics/therapist_graph/' + this.userId + '?staffId=' + this.userId + '&ownerId=' + this.ownerId + '&start_date=2019-12-02T07:58:49.833Z&end_date=2019-12-26T07:58:49.833Z&locationId=' + this.locationId).subscribe(res => {
  //     if (res) {

  //       setTimeout(() => {
  //         this.appointmentGraphData.emit(res);
  //       }, 5000);

  //       //('Response of graph api===>>>', res);
  //       this.graphResult = res;
  //       setTimeout(() => {
  //         // this.plotGraph();
  //       })
  //     }
  //   }, err => {
  //     //('error', err)
  //   })
  // }

  ngOnChanges() {
    console.log('chart data after response ===>>>> ',this.chartData);
    let arr = [];
    this.chartData.appointment.forEach(item=>{
      let obj = {};
      obj["year"] = moment(item._id).format("MMM Do YYYY");
      obj['salesValue'] = item.totalAmount ;
      obj['appointments'] = item.count;
      arr.push(obj);
    },err=>{
      console.log(err)
    })
    this.changedGraphJson = arr;
    this.showGraph();
  }

  ngAfterViewInit() {

    console.log('chart data after response ===>>>> ',this.chartData);

  }

  showGraph() {

    this.zone.runOutsideAngular(() => {
      am4core.useTheme(am4themes_animated);

      // Create category axis
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data\

      console.log('graph changed response==>>',this.changedGraphJson)
      chart.data = this.changedGraphJson;
      
      chart.colors.list = [
        am4core.color("#352352"),
        am4core.color("#9e2c7b"),
        am4core.color("#ab2e4c"),
        am4core.color("#b85a39"),
        am4core.color("#e3a739"),
        am4core.color("#c9c708"),
        am4core.color("#048F70"),
        // am4core.color('#018591'),
        // am4core.color('#54a102'),
        // am4core.color('#024ca1'),
      
      ];

      // Create category axis
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "year";
      categoryAxis.renderer.opposite = false;

      // Create value axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inversed = false;
      valueAxis.title.text = "count";
      valueAxis.renderer.minLabelPosition = 0.01;

      // Create series
      let series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "salesValue";
      series1.dataFields.categoryX = "year";
      series1.name = "Sales";
      series1.strokeWidth = 3;
      series1.bullets.push(new am4charts.CircleBullet());
      series1.tooltipText = "{name} in {categoryX}: {valueY}$";
      series1.legendSettings.valueText = "{valueY}";
      series1.visible = false;

      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "appointments";
      series2.dataFields.categoryX = "year";
      series2.name = 'Appointments';
      series2.strokeWidth = 3;
      series2.bullets.push(new am4charts.CircleBullet());
      series2.tooltipText = "{name} in {categoryX}: {valueY}";
      series2.legendSettings.valueText = "{valueY}";

      // let series3 = chart.series.push(new am4charts.LineSeries());
      // series3.dataFields.valueY = "uk";
      // series3.dataFields.categoryX = "year";
      // series3.name = 'Services';
      // series3.strokeWidth = 3;
      // series3.bullets.push(new am4charts.CircleBullet());
      // series3.tooltipText = "{name} in {categoryX}: {valueY}";
      // series3.legendSettings.valueText = "{valueY}";

                 // -----------------------------------------------no data
                 var indicator;
                 function showIndicator() {
                   if (indicator) {
                      indicator.show();
                     }
                   else {
                     indicator = chart.tooltipContainer.createChild(am4core.Container);
                     indicator.background.fill = am4core.color("#fff");
                     indicator.background.fillOpacity = 0.8;
                     indicator.width = am4core.percent(100);
                     indicator.height = am4core.percent(100);
       
                     var indicatorLabel = indicator.createChild(am4core.Label);
                     indicatorLabel.text = "No data...";
                     indicatorLabel.align = "center";
                     indicatorLabel.valign = "middle";
                     indicatorLabel.fontSize = 20;
                   }
                 }
       
                 function hideIndicator() {
                   indicator.hide();
                 }
       
                 chart.events.on("beforedatavalidated", function(ev) {
                   // check if there's data
                   if (ev.target.data.length == 0) {
                     showIndicator();
                   }
                   else if (indicator) {
                     hideIndicator();
                   }
                 });

                 //--------------------------------------------no data

      // Add chart cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "zoomX";

      // chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarY = new am4charts.XYChartScrollbar();
      chart.scrollbarY.startGrip.icon.disabled = true;
      chart.scrollbarY.endGrip.icon.disabled = true;
      // chart.scrollbarX.startGrip.icon.disabled = true;
      // chart.scrollbarX.endGrip.icon.disabled = true;

      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      // Add legend
      chart.legend = new am4charts.Legend();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
