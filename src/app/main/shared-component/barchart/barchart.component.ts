import { Component, OnInit, NgZone, AfterViewInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";
declare var $: any;
import { LOCATION, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class BarchartComponent implements  OnChanges {
  userId: any;
  ownerId: any;
  locationId: any;
  appointmentList: any;
  graphResult: any;
  @Input() chartData : any;
  changedGraphJson: any[];
  
  constructor(private zone: NgZone, private service: ApiService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.ownerId = localStorage.getItem('owner');
    this.locationId = localStorage.getItem('location_id');
  }

  ngOnChanges() {
    console.log('chart data after response ===>>>> ',this.chartData);
    let arr = [];
    this.chartData.serviceResult.forEach(item=>{
      let obj = {};
      obj["country"] = moment(item._id).format("MMM Do YYYY");
      obj['litres'] = item.totalAmount ;
      // obj['appointments'] = item.count;
      arr.push(obj);
    },err=>{
      console.log(err)
    })
    this.changedGraphJson = arr;
    this.showGraph();
  }


  salesByLocationApi() {
    //
    let userId = localStorage.getItem('id');
    let startDate = new Date();
    let endDate = moment().subtract(8, 'd').toDate();

    this.service.get('analytics/' + userId + '?type=' + LOCATION + '&start_date=' + endDate + '&end_date=' + startDate).subscribe(res => {
      //('response of analytics location api ------>>>>>', res);
      if (res.result.length <= 0) {
        this.appointmentList = res.result;
      }
      else {
        this.appointmentList = res.result;
      }
    }, err => {
    })
  }

  graphSalesApi() {
    //("within graph sale Api")
    this.service.get('analytics/therapist_graph/' + this.userId + '?staffId=' + this.userId + '&ownerId=' + this.ownerId + '&start_date=2019-12-02T07:58:salesByLocationApi49.833Z&end_date=2019-12-26T07:58:49.833Z&locationId=' + this.locationId).subscribe(res => {
      if (res) {
        //('Response of graph api===>>>', res);
        this.graphResult = res;
        setTimeout(() => {
          // this.plotGraph();
        })
      }

    }, err => {
      //('error', err)
    })
  }

  showGraph() {

    this.zone.runOutsideAngular(() => {
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      // var chart = am4core.create("barchart", am4charts.XYChart);
      // chart.scrollbarX = new am4core.Scrollbar();

      // Add data
      let chart = am4core.create("barchart", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.fontSize = 10;
      // chart.legend = new am4charts.Legend();

      chart.data = this.changedGraphJson;
      // [
      //   {
      //     country: "Head-massage",
      //     litres: 44.9
      //   },
      //   {
      //     country: "Body-massage",
      //     litres: 11.9
      //   },
      //   {
      //     country: "Face-massage",
      //     litres: 45.1
      //   },
      //   {
      //     country: "Foot-massage",
      //     litres: 89.8
      //   },
      //   {
      //     country: "Spa",
      //     litres: 67.9
      //   },
      //   {
      //     country: "Skin-massage",
      //     litres: 90.3
      //   },
      //   {
      //     country: "Thy-massage",
      //     litres: 45
      //   },
      //   {
      //     country: "Hand-massage",
      //     litres: 22
      //   },
      //   {
      //     country: "Nail-massage",
      //     litres: 34
      //   }
      // ];


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


      chart.innerRadius = am4core.percent(10);

      let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.labels.template.text = "{category}";
// pieSeries.slices.template.tooltipText = "";

// Put a thick white border around each Slice
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;
pieSeries.slices.template
  // change the cursor on hover to make it apparent the object can be interacted with
  .cursorOverStyle = [
    {
      "property": "cursor",
      "value": "pointer"
    }
  ];

// pieSeries.alignLabels = false;
// pieSeries.labels.template.bent = false;
// pieSeries.labels.template.radius = 3;
// pieSeries.labels.template.padding(0,0,0,0);

// pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
shadow.opacity = 0;

// Create hover state
let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
hoverShadow.opacity = 0.7;
hoverShadow.blur = 5;


      // let series = chart.series.push(new am4charts.PieSeries3D());
      // series.dataFields.value = "litres";
      // series.dataFields.category = "country";

      // end am4core.ready()


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


      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      // Cursor
      // chart.cursor = new am4charts.XYCursor();

    }); // 


  }


}
