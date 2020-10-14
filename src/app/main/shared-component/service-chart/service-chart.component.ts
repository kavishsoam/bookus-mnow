import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/spiritedaway";
declare var $: any;
import { LOCATION, INTAKE } from '../../../services/url';
import * as moment from "moment";
import { ApiService } from 'app/services/api.service';


@Component({
  selector: 'app-service-chart',
  templateUrl: './service-chart.component.html',
  styleUrls: ['./service-chart.component.scss']
})
export class ServiceChartComponent implements OnInit {

  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      // var chart = am4core.create("barchart", am4charts.XYChart);
      // chart.scrollbarX = new am4core.Scrollbar();

      // Add data
      let chart = am4core.create("saleChart", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      // chart.legend = new am4charts.Legend();

      chart.data = [
        {
          country: "Head-massage",
          litres: 12.9
        },
        {
          country: "Body-massage",
          litres: 32.9
        },
        {
          country: "Face-massage",
          litres: 68.1
        },
        {
          country: "Foot-massage",
          litres: 22.8
        },
        {
          country: "Spa",
          litres: 46.9
        },
        {
          country: "Skin-massage",
          litres: 90.3
        },
        {
          country: "Thy-massage",
          litres: 29
        },
        {
          country: "Hand-massage",
          litres: 90
        },
        {
          country: "Nail-massage",
          litres: 44
        }
      ];

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

      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "litres";
      series.dataFields.category = "country";

      // end am4core.ready()




      // $(document).ready(function () {
      //   $('g[aria-labelledby]').hide();
      // });
      // Cursor
      // chart.cursor = new am4charts.XYCursor();

    }); // 


  }
}
