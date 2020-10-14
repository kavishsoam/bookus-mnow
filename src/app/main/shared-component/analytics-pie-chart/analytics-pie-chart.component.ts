import { Component, OnInit } from '@angular/core';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";


@Component({
  selector: 'app-analytics-pie-chart',
  templateUrl: './analytics-pie-chart.component.html',
  styleUrls: ['./analytics-pie-chart.component.scss']
})
export class AnalyticsPieChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
this.plotPieChart();
  }

  plotPieChart() {
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("analyticsPie", am4charts.PieChart);

// Add data
chart.data = [{
  "country": "Company sales",
  "litres": 501.9
}, {
  "country": "Service Sales",
  "litres": 301.9
}, {
  "country": "Client Sales",
  "litres": 201.1
}, {
  "country": "Category Sales",
  "litres": 165.8
}, {
  "country": "Staff Sales",
  "litres": 139.9
}, {
  "country": "Inventory Sales",
  "litres": 128.3
}, {
  "country": "Locations Sales",
  "litres": 99
}];

// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.innerRadius = am4core.percent(50);
pieSeries.ticks.template.disabled = true;
pieSeries.labels.template.disabled = true;

let rgm = new am4core.RadialGradientModifier();
rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
pieSeries.slices.template.fillModifier = rgm;
pieSeries.slices.template.strokeModifier = rgm;
pieSeries.slices.template.strokeOpacity = 0.4;
pieSeries.slices.template.strokeWidth = 0;

//label
// chart.innerRadius = 10;
let label = chart.seriesContainer.createChild(am4core.Label);
label.text = "2020";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fontSize = 30;

chart.legend = new am4charts.Legend();
chart.legend.position = "right";
  }

}
