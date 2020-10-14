import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { LOC_LIS, BRAND, PRODUCT, SUPPLIER } from 'app/services/url';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  tax: FormArray;
  pageView: string = "normal";
  location: any = [];
  submittedError:boolean;
  categoryData: any = [];
  brandData: any = [];
  supplierData: any = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    private spinner: NgxSpinnerService,
    private _toast: MessageService) { }
  ngOnInit() {
    this.getCategoryList();
    this.getBrandList();
    this.getSupplierList();
    this.productForm = this.fb.group({
      // {
      //   "name": "testing101",---
      //   "barcode": "testing123",---
      //   "description": "for testing",---
      //   "commissionEnabled": true,
      //   "brandId":"5c9c8df35019a0417c62f20e",
      //   "categoryId":"5c9c8e235019a0417c62f20f",
      //   "supplierId":"5c9c8e425019a0417c62f210" ,
      //   "supplyPrice": 6000,----
      //   "retailPrice": 4000,----
      //   "salesEnabled": true,
      //   "sku": "testing234",----
      //   "specialPrice": 3500,----
      //   "unlimitedStock": false,
      //   "reorderPoints": [{"threshold": 80, "quantity": 70, "location": "5c9c61823f3018001852e0fe"},{"threshold": 180, "quantity": 170, "location":"5c9c8ed4db405a383dc5330c"}, {"threshold": 380, "quantity": 370, "location": "5c9c8ededb405a383dc53312"}],
      //    "quantities":[{"quantity": 100, "location": "5c9c61823f3018001852e0fe"},{"quantity": 200, "location": "5c9c8ed4db405a383dc5330c"},
      //         {"quantity": 300, "location": "5c9c8ededb405a383dc53312"}],
      //    "taxSetting":[{"taxId": "5c9c8ed4db405a383dc5330c", "location": "5c9c61823f3018001852e0fe", "use_default": false},
      //    {"taxId": "5c9c8ed4db405a383dc5330c","location": "5c9c8ed4db405a383dc5330c", "use_default": false},{"taxId": null, "location": "5c9c8ededb405a383dc53312", "use_default": true}]
      //   }
      name: ['',Validators.compose([Validators.required])],
      category: [''],
      brand: [''],
      retailPrice: ['',Validators.compose([Validators.required])],
      specialPrice: [''],
      beforeTax: ['Default setting'],
      tax: this.fb.array([]),
      acceptNotify: [true],
      barcode: [''],
      sku: [''],
      description: [''],
      supplyPrice: [''],
      supplier: ['']
    });
    this.getLocation();
  }
  createTaxItem(locId = null, locName = null, Val = null): FormGroup {
    return this.fb.group({
      locationId: [locId],
      locationName: [locName],
      value: [Val],
    });
  }
  addTaxItem(locId = null, locName = null, Val = null): void {
    this.tax = this.productForm.get('tax') as FormArray;
    this.tax.push(this.createTaxItem(locId, locName, Val));
  }
  onSubmitProduct(form) {
    //
  if(form.invalid){
    this.submittedError = true;
    return;
  }
//

this._service.post(PRODUCT,form.value).subscribe(res=>{
console.log(res);
},err=>{
console.log(err);
})

  }
  taxModalView() {
    this.pageView = "tax";
    this.dialogRef.updateSize('30vw', '100vh');
  }
  getLocation() {
    this._service.get(LOC_LIS).subscribe(res => {
      this.location = res;
      this.location.forEach(loc => {
        this.addTaxItem(loc._id, loc.name);
      });
    }, err => {
    })
  }
  isDelete(){

  }

  getCategoryList() {
    this._service.get('category').subscribe(res=>{
      let categoryList : any = [];
       categoryList = localStorage.getItem('categoryList').split(',');
      let data = [];
        let category = [];
        category = res.result;
        category.forEach(element => {
            element.category.forEach(innerEle => {
              categoryList.forEach(id => {
                if(innerEle.language == 'english' && element._id == id)
                data.push({id: element._id, name: innerEle.name });
              });
            });
        });
        this.categoryData = data;
        console.log('category data ===>>>',this.categoryData);
    },err=>{
        console.log(err);
    })
}

getBrandList() {
    this._service.get(BRAND).subscribe(res=>{
      console.log(res);
      this.brandData = res['result'];
    },err=>{
      console.error(err);
    })
}

getSupplierList() {
this._service.get(SUPPLIER).subscribe(res=>{
  console.log(res);
  this.supplierData = res['result'];
},err=>{
  console.error(err);
})
}

}
