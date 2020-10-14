import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
// import { SuppliersComponent } from './suppliers/suppliers.component';
import { ProductComponent } from './product/product.component';
import { TransferComponent } from './order/transfer/transfer.component';
import { OrderCreateComponent } from './order/order-create/order-create.component';
import { CreateBrandComponent } from './brand/create-brand/create-brand.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ApiService } from 'app/services/api.service';
import { INVENTORY } from 'app/services/url';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  // { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort) sort: MatSort;
  pageHeader: Object = { header: "Inventory", navigate: false }
  supplierColumns: string[] = ['fullName', 'name','phone', 'weight', 'symbol', 'updated'];
  productColumns: string[] = ['position', 'name', 'weight', 'symbol', 'updated'];
  orderColumns: string[] = ['position', 'name', 'weight', 'symbol', 'updated'];
  brandColumns : string[] = ['name', 'productsCount', 'createdAt'];
  supplierData : any = [];
  productData : any = [];
  orderData : any = [];
  brandData : any = [];
  constructor(
    private _fuseConfigService: FuseConfigService, 
    public dialog: MatDialog,
    private _service : ApiService,
    private ref : ChangeDetectorRef
    ) { }
  
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.setPageHeader();
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  suppliersDialog() {
    const dialogRef = this.dialog.open(SuppliersComponent, {
      width: '100vw',
      height: '100vh',
      autoFocus: false,
      data: { header: "Add Supplier" }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  newOrder() {
    const orderRef =  this.dialog.open(OrderCreateComponent,{
      width: '100vw',
      height: '100vh',
      data : '' 
    })
    orderRef.afterClosed().subscribe(res=>{
      console.log(res);
    })
  }

  applyFilter(e) {

  }

  product() {
    const dialogRef = this.dialog.open(ProductComponent, {
      width: '100vw',
      height: '100vh',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  newTransfer() {
    const dialogRef = this.dialog.open(TransferComponent, {
      width: '100vw',
      height: '100vh',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    });
  }

  newBrand() {
    const brandDialog = this.dialog.open(CreateBrandComponent, {
      width: '40vw',
      height: '47vh',
      data : ''
    })
    brandDialog.afterClosed().subscribe(result=>{
      console.log(result);
    })
  }

  onTabGroupSelect(e) {
  switch(e.index){
    case 0 : 
      this.productData  = this.getData('products');
      break;
      case 1 : 
    this.orderData = this.getData('orders');
    break;
    case 2 :
    //  this.brandData = 
     let data : any = this.getData('brands');
     console.log(this.brandData);
     this.ref.detectChanges();
     break;
    case 3 :
     this.supplierData =  this.getData('suppliers');
     console.log(this.supplierData);
     break;
  }
  }

getData(type){
this._service.get(INVENTORY+type).subscribe(res=>{
  switch(type){
    case 'brands':
      this.brandData = res['result']
      this.ref.detectChanges();
      break;
      case 'orders':
      this.orderData = res['result']
      this.ref.detectChanges();
      break;
      case 'suppliers' :
        this.supplierData = res['result'];
        this.ref.detectChanges();
        break;
        case 'products':
          this.productData = res['result'];
          this.ref.detectChanges();
          break;
  }
  // return res['result'];
},err=>{
  console.error(err);
  return [];
})
}
}
