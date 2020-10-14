import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";

@Component({
  selector: 'app-analytics-line-chart',
  templateUrl: './analytics-line-chart.component.html',
  styleUrls: ['./analytics-line-chart.component.scss']
})
export class AnalyticsLineChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.plotChart();
  }

  plotChart() {

    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("analyticsLine", am4charts.XYChart);
chart.paddingRight = 20;

// Add data
chart.data = [{
  "year": "jan",
  "value": 1
}, {
  "year": "feb",
  "value": 12
}, {
  "year": "mar",
  "value": 14
}, {
  "year": "apr",
  "value": 12
}, {
  "year": "may",
  "value": 25
}, {
  "year": "jun",
  "value": 30
}, {
  "year": "july",
  "value": 28
}, {
  "year": "aug",
  "value": 40
}, {
  "year": "sep",
  "value": 46
}, {
  "year": "oct",
  "value": 43
}, {
  "year": "nov",
  "value": 55
}, {
  "year": "dec",
  "value": 69
}];

// Create axes
let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "year";
categoryAxis.renderer.minGridDistance = 50;
categoryAxis.renderer.grid.template.location = 0.5;
categoryAxis.startLocation = 0.5;
categoryAxis.endLocation = 0.5;

// Create value axis
let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.baseValue = 0;

// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.categoryX = "year";
series.strokeWidth = 2;
series.tensionX = 0.77;



// bullet is added because we add tooltip to a bullet for it to change color
let bullet = series.bullets.push(new am4charts.Bullet());
bullet.tooltipText = "{valueY}";

bullet.adapter.add("fill", function(fill, target){
  //@ts-ignore
    if(target.dataItem.valueY < 0){
        return am4core.color("#FF0000");
    }
    return fill;
})
let range = valueAxis.createSeriesRange(series);
range.value = 0;
range.endValue = -1000;
range.contents.stroke = am4core.color("#FF0000");
range.contents.fill = range.contents.stroke;

// // Add scrollbar
// let scrollbarX = new am4charts.XYChartScrollbar();
// scrollbarX.series.push(series);
// chart.scrollbarX = scrollbarX;

chart.cursor = new am4charts.XYCursor();

  }

}
