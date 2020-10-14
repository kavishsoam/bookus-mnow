import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { AddTaxComponent } from './add-tax/add-tax.component'
import { MatDialogRef, MatDialog } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { MessageService } from 'primeng/api';
import { TAX, DEFAULT_TAX, SETUP } from 'app/services/url';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
];
@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit {
  taxesListColumns: string[] = ['name', 'taxRate'];
  dataSource = ELEMENT_DATA;
  defaultTaxList: any = [];
  defaultTaxListColumns: string[] = ['location', 'defaultServiceTax'];
  taxesList: any = [];
  taxGroupList: any = [];
  changeText: any;
  constructor(
    @Optional() public dialogRef: MatDialogRef<TaxesComponent>,
    private _fuseConfigService: FuseConfigService,
    private _service: ApiService,
    public dialog: MatDialog,
    private _toast: MessageService,
  ) {
    let x = localStorage.getItem('taxSelected');
    if(x == undefined || x == null){
      this.changeText = true;
    }else{
      this.changeText = x;
    }

   }
  pageHeader: Object = { header: " Taxes", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader();
    this.getTaxDefaults();
    this.getTax();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  addNewTax() {
    const dialogRef = this.dialog.open(AddTaxComponent, {
      width: '400px',
      position: { top: '20px' },
      data: { header: 'New Tax', }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTaxDefaults();
    this.getTax();
    })
  }
  editTax(row) {
    let header, data
    if (row.taxGroup) {
      header = 'Edit Tax Group'
      data = this.taxGroupList
    }
    else {
      header = 'Edit Tax'
      data = this.taxesList
    }
    const dialogRef = this.dialog.open(AddTaxComponent, {
      width: '400px',
      position: { top: '20px' },
      data: { header: header, tax: row, taxesList: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type == 'refresh') {
        this.getTax();
      }
    })
  }
  addNewTaxGroup() {
    if (this.taxGroupList.length >= 2) {
      const dialogRef = this.dialog.open(AddTaxComponent, {
        width: '400px',
        position: { top: '20px' },
        data: { header: 'New Tax Group', taxesList: this.taxGroupList }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.type == 'refresh') {
          this.getTax();
        }
      })
    }
    else this._toast.add({ severity: 'warn', summary: 'Service Message', detail: 'There must be at least 2 taxes defined to create a group' });
  }
  changeSetting() {
    const dialogRef = this.dialog.open(AddTaxComponent, {
      width: '400px',
      position: { top: '20px' },
      data: { header: 'Change Tax Calculation', }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('modal closed result ==>>',result);
      this.changeText = result.selectedOption;
      localStorage.setItem('taxSelected',this.changeText);
    })
  }
  editTaxDefaults(row) {
    //
    const dialogRef = this.dialog.open(AddTaxComponent, {
      width: '400px',
      position: { top: '20px' },
      data: { header: 'Edit Tax Defaults', defaultServiceTax: row.defaultServiceTax,taxesList: this.taxesList ,location:row.location }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTaxDefaults();
    })
  }
  getTaxDefaults() {
    this._service.get(`${SETUP}defaultTax`).subscribe(res => {
      //
      this.defaultTaxList = res.result;
    }), err => {
    }
  }
  getTax() {
    this._service.get(`${SETUP}taxRates`).subscribe(res => {
      this.taxesList = res.result;
      this.taxesList.map((value, i, array) => {
        if (value.taxGroup) {
          var str = '';
          value.taxGroup.map(v => str = v.taxRate + '%, ' + str);
          if (str) array[i].tax = str.slice(0, -2)
        }
      })
      this.getTaxDropdown();
    })
  }
  getTaxDropdown() {
    this._service.get(`${SETUP}taxRates?list=true`).subscribe(res => {
      this.taxGroupList = res.result;
    })
  }
  addNewService() {
  }
}
