import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.component.html',
  styleUrls: ['./products-tab.component.scss']
})
export class ProductsTabComponent implements OnInit {
  productsList = [
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 3, tax: 'GTS 10%', discount: 'None', price: 150, total: 150 },
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 3, tax: 'GTS 10%', discount: 'None', price: 50, total: 150 },
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 5, tax: 'GTS 10%', discount: 'None', price: 50, total: 150 },
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 3, tax: 'GTS 10%', discount: 'None', price: 50, total: 150 },
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 3, tax: 'GTS 10%', discount: 'None', price: 50, total: 100 },
    { date: '10/14/20 - 3:30 PM', name: 'Massage Oil', paidBy: 'Cash', quantity: 3, tax: 'GTS 10%', discount: 'None', price: 50, total: 150 },
  ];
  dataSource = new MatTableDataSource(this.productsList);
  displayedColumns: string[] = ['date', 'name', 'paidBy', 'quantity', 'tax', 'discount', 'price', 'total'];
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
