import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {

  displayedColumns: string[] = ['topClients', 'thismonth', 'lastmonth'];
  dataSource : any = [
    {
      name : 'stephen james',
      thismonthCount : 39,
      count: 21
    },
    {
      name : 'jimmy falcon',
      thismonthCount : 30,
      count: 5
    },
    {
      name : 'barbosa reily',
      thismonthCount : 23,
      count: 13
    },
    {
      name : 'miley fresha',
      thismonthCount : 7,
      count: 1
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
