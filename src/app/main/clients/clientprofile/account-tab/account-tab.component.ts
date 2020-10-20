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
  selectedIndex = 0;
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
  giftCardHistory = [
    { date: '10/14/20 - 7:13 PM', order: 'SJK231U9N21', activeBy: 'Maria Napoles', status: 'Available', value: 100, remainingValue: 150 },
    { date: '10/14/20 - 7:13 PM', order: 'SJK231U9N21', activeBy: 'Janet Napoles', status: 'Available', value: 100, remainingValue: 40 },
    { date: '10/14/20 - 7:13 PM', order: 'SJK231U9N21', activeBy: 'Rudy Bang', status: 'Spent', value: 100, remainingValue: 0 },
  ];
  moneyHistory = [
    { date: '10/14/20 - 7:13 PM', transaction_number: 'SJK231U9N21', addedBy: 'Maria Napoles', via: 'Visa Card', total: 50 },
    { date: '10/14/20 - 7:13 PM', transaction_number: 'SJK231U9N21', addedBy: 'Janet Napoles', via: 'Credit Card', total: 100 },
    { date: '10/14/20 - 7:13 PM', transaction_number: 'SJK231U9N21', addedBy: 'Rudy Bang', via: 'Cashier', total: 300 },
  ];
  transactionHistory = [
    { date: '10/14/20 - 7:13 PM', item_name: 'Remedial Massage', servedBy: 'Maria Napoles', type: 'Equipment', discount: "GTS 10%", amount: 50 },
    { date: '10/14/20 - 7:13 PM', item_name: 'Deep Tissue Massage', servedBy: 'Janet Napoles', type: 'Services', discount: "GTS 10%", amount: 50 },
    { date: '10/14/20 - 7:13 PM', item_name: 'Remedial Massage', servedBy: 'Maria Napoles', type: 'Equipment', discount: "GTS 10%", amount: 500 },
    { date: '10/14/20 - 7:13 PM', item_name: 'Remedial Massage', servedBy: 'Maria Napoles', type: 'Equipment', discount: "GTS 10%", amount: 100 },
  ];
  creditEarnHistory = [
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Maria Napoles', type: 'Equipment', earn: 5 },
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Janet Napoles', type: 'Services', earn: 5 },
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Rudy Bang', type: 'Product', earn: 5 },
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Maria Napoles', type: 'Equipment', earn: 5 },
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Janet Napoles', type: 'Services', earn: 5 },
    { date: '10/14/20 - 7:13 PM', event: 'Valentines Double Massage Promo', addedBy: 'Rudy Bang', type: 'Product', earn: 5 },
  ];
  displayedColumns: string[] = ['date', 'name', 'type', 'serveBy', 'ponit'];
  displayedColumns2: string[] = ['register', 'expire', 'class', 'schedule', 'fee'];
  displayedColumns3: string[] = ['date', 'order', 'activeBy', 'status', 'value', 'remainingValue'];
  displayedColumns4: string[] = ['date', 'transaction_number', 'addedBy', 'via', 'total'];
  displayedColumns5: string[] = ['date', 'item_name', 'servedBy', 'type', 'discount', 'amount'];
  displayedColumns6: string[] = ['date', 'event', 'addedBy', 'type', 'earn'];
  dataSource = new MatTableDataSource(this.pointLabel);
  dataSource2 = new MatTableDataSource(this.membershipHistory);
  dataSource3 = new MatTableDataSource(this.giftCardHistory);
  dataSource4 = new MatTableDataSource(this.moneyHistory);
  dataSource5 = new MatTableDataSource(this.transactionHistory);
  dataSource6 = new MatTableDataSource(this.creditEarnHistory);
  @ViewChild(MatSort) sort: MatSort;


  constructor() { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource2.sort = this.sort;
    // this.dataSource3.sort = this.sort;
    // this.dataSource4.sort = this.sort;
    // this.dataSource5.sort = this.sort;
    // this.dataSource6.sort = this.sort;
  }

  onTabGroupSelect(e) {
    this.selectedIndex = e.index;
    setTimeout(() => {
      switch (e.index) {
        case 0:
          this.dataSource.sort = this.sort;
          break;
        case 1:
          this.dataSource2.sort = this.sort;
          break;
        case 2:
          this.dataSource3.sort = this.sort;
          break;
        case 3:
          this.dataSource4.sort = this.sort;
          break;
        case 4:
          this.dataSource5.sort = this.sort;
          break;
        case 5:
          this.dataSource6.sort = this.sort;
          break;
      }
    }, 1000)
  }
}