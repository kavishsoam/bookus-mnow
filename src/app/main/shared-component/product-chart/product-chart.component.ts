import { Component, OnInit, NgZone, AfterViewInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";
declare var $: any;
import { LOCATION, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { ApiService } from 'app/services/api.service';


@Component({
  selector: 'app-product-chart',
  templateUrl: './product-chart.component.html',
  styleUrls: ['./product-chart.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ProductChartComponent implements OnInit, OnChanges {

  @Input() chartData : any;
  changedGraphJson: any[];
  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('chart data after response ===>>>> ',this.chartData);
    let arr = [];
    this.chartData.appointment.forEach(item=>{
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


  showGraph() {

    this.zone.runOutsideAngular(() => {
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      // var chart = am4core.create("barchart", am4charts.XYChart);
      // chart.scrollbarX = new am4core.Scrollbar();

      // Add data
      let chart = am4core.create("prodChart", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.fontSize = 10;
      // chart.legend = new am4charts.Legend();

      chart.data = this.changedGraphJson
      
      // [
      //   {
      //     country: "Head-massage",
      //     litres: 501.9
      //   },
      //   {
      //     country: "Body-massage",
      //     litres: 301.9
      //   },
      //   {
      //     country: "Face-massage",
      //     litres: 201.1
      //   },
      //   {
      //     country: "Foot-massage",
      //     litres: 165.8
      //   },
      //   {
      //     country: "Spa",
      //     litres: 139.9
      //   },
      //   {
      //     country: "Skin-massage",
      //     litres: 128.3
      //   },
      //   {
      //     country: "Thy-massage",
      //     litres: 99
      //   },
      //   {
      //     country: "Hand-massage",
      //     litres: 60
      //   },
      //   {
      //     country: "Nail-massage",
      //     litres: 50
      //   }
      // ];

      chart.innerRadius = am4core.percent(10);

      let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.labels.template.text = "{category}";
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
  // fillChart();

  // function fillChart() {
  //   for(let i = 0; i< list.length;i++)
  //   pieSeries.slices.template.propertyFields.fill = list[i];
  // }

// pieSeries.alignLabels = false;
// pieSeries.labels.template.bent = true;
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
