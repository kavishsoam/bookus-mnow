import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-account-tab',
  templateUrl: './account-tab.component.html',
  styleUrls: ['./account-tab.component.scss']
})
export class AccountTabComponent implements AfterViewInit {
  @Input() selectedInd: any;

  pointLabel = [
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Massage Oil', type: 'Product', serveBy: 'Jennifer', ponit: 5 },
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Massage Oil', type: 'Product', serveBy: 'Jennifer', ponit: 5 },
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Luxury Massage', type: 'Service', serveBy: 'Andrew', ponit: 10 },
    { date: '10/14/20 - 7:13 PM', name: 'Massage Oil', type: 'Product', serveBy: 'Jennifer', ponit: 5 },
  ];
  membershipHistory = [
    { register: '10/14/20 - 7:13 PM', expire: '10/14/20 - 7:13 PM', class: 'Service', schedule: 'MWF - 5:00 PM - 6:00 PM', fee: 100 },
    { register: '10/14/20 - 7:13 PM', expire: '10/14/20 - 7:13 PM', class: 'Service', schedule: 'MWF - 5:00 PM - 6:00 PM', fee: 100 },
    { register: '10/14/20 - 7:13 PM', expire: '10/14/20 - 7:13 PM', class: 'Product', schedule: 'MWF - 5:00 PM - 6:00 PM', fee: 100 },
  ];
  displayedColumns: string[] = ['date', 'name', 'type', 'serveBy', 'ponit'];
  displayedColumns2: string[] = ['register', 'expire', 'class', 'schedule', 'fee'];
  dataSource = new MatTableDataSource(this.pointLabel);
  dataSource2 = new MatTableDataSource(this.membershipHistory);
  @ViewChild(MatSort) sort: MatSort;


  constructor() { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort;
  }
}