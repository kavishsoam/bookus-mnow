import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { LOC_LIS, CASH_DRAW, CASH_DRAW_PUT, CASH_GET } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-cash-drawer',
  templateUrl: './cash-drawer.component.html',
  styleUrls: ['./cash-drawer.component.scss']
})
export class CashDrawerComponent implements OnInit {
  @ViewChild('showMenuRef')
  showMenuRef : any;
  cashDrawer: boolean = false;
  startingCashValue: any = 0;
  closingCashValue: any = 0;
  locationList: any = [];
  location_id : any = '';
  currencyCode: any;
  cashDrawerList: any = [];
  isPatchCashDrawer: any = false;
  cashDrawerData: any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<CashDrawerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder : FormBuilder,
    private service : ApiService,
    private toast : MessageService,
    private spinner: NgxSpinnerService
  ) { }

  startShiftForm : any;
  endShiftForm: any;

  ngOnInit() {
    this.createForm();
    this.allLocationApi();
    this.currencyCode = localStorage.getItem("currency");
  }

  showMenu(data) {
    if(this.location_id == ''){
      // console.log(this.showMenuRef);
      this.showMenuRef.checked = false;
      this.toast.add({severity: 'error',summary : 'Location Error', detail: 'Please select a location first to proceed further' })
    }
    if(this.location_id != ''){
      if(data.checked) {
        this.getShiftData();
        this.cashDrawer = !this.cashDrawer;
    } else if(!data.checked){
        this.cashDrawer = false;
    }
    }
  }

  getShiftData() {
    let date = new Date().toISOString();
    let ownerId = localStorage.getItem('owner');
    this.service.get(CASH_GET+ date+ '&ownerId='+ ownerId).subscribe(res=>{
      console.log(res);
      this.cashDrawerList = res.result;
    },err=>{
      console.log(err);
    })
    this.checkForCashDrawer();
  }

  checkForCashDrawer() {
    if(!this.cashDrawerList.length){
      this.isPatchCashDrawer = this.isPatchCashDrawer;             //!cash-drawer should be posted first
    }
    if(this.cashDrawerList.length){
      this.cashDrawerList.forEach(element => {
        if(this.location_id == element.location ){
          this.isPatchCashDrawer = true;                   //!cash drawer is already posted, need to put data
          this.cashDrawerData = element;
        }
      });
      this.patchFromValue();
    }

    if(!this.isPatchCashDrawer) {
      this.createForm();
    }
  }

  allLocationApi() {
      this.service.get(LOC_LIS).subscribe(res => {
          this.locationList = res;
      }),
        err => {
          console.log(err);
        };
  }

  selectedLocation(loc) {
    this.isPatchCashDrawer = false;
    console.log(loc);
    this.getShiftData();
  }

  createForm() {
    this.startShiftForm = this.formBuilder.group({
      key: new FormControl(false),
      dollar100 : new FormControl(0),
      dollar50 : new FormControl(0),
      dollar20 : new FormControl(0),
      cent1 : new FormControl(0),
      startingCash : new FormControl(0),
      closingCash : new FormControl(0),
      differenceValue : new FormControl(0),
      differenceAccept : new FormControl(false),
      withDraw : new FormControl(0),
      deposit : new FormControl(0),
      total : new FormControl(0),
    })

    this.endShiftForm = this.formBuilder.group({
      key : new FormControl(false),
      dollar100 : new FormControl(0),
      dollar50 : new FormControl(0),
      dollar20 : new FormControl(0),
      cent1 : new FormControl(0),
      startingCash : new FormControl(0),
      closingCash : new FormControl(0),
      recievedCash : new FormControl(0),
      expectedCash : new FormControl(0),
      differenceValue : new FormControl(0),
      differenceAccept : new FormControl(false),
      withDraw : new FormControl(0),
      deposit : new FormControl(0),
      total : new FormControl(0),
    })
  }

  closeCashDrawer() {
    this.dialogRef.close({ close: true });
  }

    startShiftCurrency(e) {
      this.calculateStartingCash();
    }
 
    cashFromYesterdayFunc(e) {
      this.calcuateStartingDiff();
    }

    startShiftChange(e) {
      this.calculateStartingCash();
    }

    // startShiftAccept() {
    // this.startShiftForm.controls['differenceAccept'].setValue(true);
    // }

    calculateStartingCash() {
      let dollar100 =this.startShiftForm.value.dollar100 ;
      let dollar50 =  this.startShiftForm.value.dollar50;
      let dollar20 = this.startShiftForm.value.dollar20;
      let cent1 =this.startShiftForm.value.cent1;
      this.startingCashValue = (100 * dollar100) + (50 * dollar50) + (20 * dollar20) + (1 * cent1)
      this.startShiftForm.controls['startingCash'].setValue(this.startingCashValue);
      this.calcuateStartingDiff();
      this.calculateStartingTotal();
    }

    calcuateStartingDiff() {
      let closingCash = this.startShiftForm.value.closingCash;
      let startingCash = this.startShiftForm.value.startingCash
      let calculatedValue =  startingCash - closingCash ;
      this.startShiftForm.controls['differenceValue'].setValue(calculatedValue);
    }

    calculateStartingTotal() {
      let withDraw = this.startShiftForm.value.withDraw 
      let deposit =  this.startShiftForm.value.deposit 
      let calculatedValue = ((Number(this.startingCashValue) + Number(deposit)) - Number(withDraw))
      this.startShiftForm.controls['total'].setValue(calculatedValue);
      this.endShiftForm.controls['startingCash'].setValue(calculatedValue);
    }


    // ! END SHIFT  -_________________________________________________________________________________________-

    endShiftCurrency(e) {
      console.log(e);
      this.calculateEndingCash();
    }
    
    expectedCashChange(e) {
      this.calculateEndingCash();
    }

    endShiftChange(e) {
      this.calculateEndingCash();
    }

    // endShiftAccept() {
    //   this.endShiftForm.controls['differenceAccept'].setValue(true);
      
    //   }

    calculateEndingCash() {
      let dollar100 = this.endShiftForm.value.dollar100 ;
      let dollar50 =  this.endShiftForm.value.dollar50;
      let dollar20 =  this.endShiftForm.value.dollar20;
      let cent1 = this.endShiftForm.value.cent1;
      this.closingCashValue = (100 * dollar100) + (50 * dollar50) + (20 * dollar20) + (1 * cent1);
      this.endShiftForm.controls['closingCash'].setValue(this.closingCashValue);
      this.calcuateEndingDiff();
      this.calculateEndingTotal();
    }

    calcuateEndingDiff() {
      let expectedCash =  this.endShiftForm.value.expectedCash
      let closingCash =  this.endShiftForm.value.closingCash
      let calculatedValue =    expectedCash - closingCash ;
      this.endShiftForm.controls['differenceValue'].setValue(calculatedValue);
    }

    calculateEndingTotal() {
      let withDraw = this.endShiftForm.value.withDraw 
      let deposit =  this.endShiftForm.value.deposit 
      let calculatedValue = ((Number(this.closingCashValue) + Number(deposit)) - Number(withDraw))
      this.endShiftForm.controls['total'].setValue(calculatedValue);
    }


// ! _____________________________________________SUBMIT FORM________________________________________________//

    submitStartShift(form) {
      console.log(form);
      localStorage.setItem('startShift',JSON.stringify(form.value))
      setTimeout(() => {
        !(this.isPatchCashDrawer) ? this.postStartShift() : this.putStartShift();        
      }, 1000);
    }

    startShiftObj() {
      let diffObj = {}
       diffObj = {
        amount : this.startShiftForm.value.differenceValue,
        accept : this.startShiftForm.value.differenceAccept
      }
      let form;
      form  = this.startShiftForm.value;
      form.difference = diffObj;
    //TODO
    // form.key = true;
      return form;
    }

    endShiftObj() {
      let diffObj = {}
      diffObj = {
        amount : this.endShiftForm.value.differenceValue,
        accept : this.endShiftForm.value.differenceAccept
      }
      let form;
      form  = this.endShiftForm.value;
      form.difference = diffObj;
    //TODO
    // form.key = true;
      return form;
    }

    submitEndShift() {
      this.spinner.show()
      let id;
      let date = new Date().toISOString();
      id = localStorage.getItem('owner');
      let data = {
        "ownerId": id,
        "location": this.location_id,
      "startShift": this.startShiftObj(),
        "endShift": this.endShiftObj(),
        "date": this.cashDrawerData.date
    }
    this.service.put(CASH_DRAW_PUT,data).subscribe(res=>{
      setTimeout(() => {
        this.spinner.hide();
        this.toast.add({severity:'success', summary:'End Shift Cashdrawer', detail: 'Shop\'s end shift cash drawer has been updated.'})
      }, 300);
      console.log(res);
    },err=>{
      console.log(err);
    })
    }

    postStartShift() {
      this.isPatchCashDrawer = true;
      this.spinner.show();
      let id;
      let date = new Date().toISOString();
      id = localStorage.getItem('owner');
      let data = {
        "ownerId": id,
        "location": this.location_id,
      "startShift": this.startShiftObj(),
        "endShift": this.endShiftObj(),
        "date": new Date().toISOString()
    }
    this.service.post(CASH_DRAW+ date + '&ownerId='+ id,data).subscribe(res=>{
      setTimeout(() => {
        this.spinner.hide();
        this.toast.add({severity:'success',summary:'Shift start cash', detail:'Shop\'s start shift cash drawer has been updated.'})
      }, 300);
      console.log(res);
    },err=>{
      console.log(err); 
    })
    }

    putStartShift() {
          this.spinner.show();
          let id;
          let date = new Date().toISOString();
          id = localStorage.getItem('owner');
          let data = {
            "ownerId": id,
            "location": this.location_id,
          "startShift": this.startShiftObj(),
            "endShift": this.endShiftObj(),
            "date": this.cashDrawerData.date
        }
        this.service.put(CASH_DRAW_PUT,data).subscribe(res=>{
          setTimeout(() => {
            this.spinner.hide();
            this.toast.add({severity:'success',summary:'Shift start cash', detail:'Shop\'s start shift cash drawer has been updated.'})
          }, 300);
          console.log(res);
        },err=>{
          console.log(err);
        })
    }

    
    //!--------------------------------------------------------------------patch From Value ---------------------------------------------------------------------------------//

    patchFromValue() {
      this.startShiftForm.patchValue({
        key : this.cashDrawerData.startShift.key,
        dollar100 : this.cashDrawerData.startShift.dollar100,
        dollar50 : this.cashDrawerData.startShift.dollar50,
        dollar20 : this.cashDrawerData.startShift.dollar20,
        cent1 : this.cashDrawerData.startShift.cent1,
        startingCash : this.cashDrawerData.startShift.startingCash,
        closingCash : this.cashDrawerData.startShift.closingCash,
        differenceValue : this.cashDrawerData.startShift.difference.amount,
        differenceAccept : this.cashDrawerData.startShift.difference.accept,
        withDraw : this.cashDrawerData.startShift.withDraw,
        deposit : this.cashDrawerData.startShift.deposit,
        total : this.cashDrawerData.startShift.total,
      })

      this.endShiftForm.patchValue({
        key: this.cashDrawerData.endShift.key,
        dollar100 : this.cashDrawerData.endShift.dollar100,
        dollar50 : this.cashDrawerData.endShift.dollar50,
        dollar20 : this.cashDrawerData.endShift.dollar20,
        cent1 : this.cashDrawerData.endShift.cent1,
        startingCash : this.cashDrawerData.endShift.startingCash,
        closingCash : this.cashDrawerData.endShift.closingCash,
        recievedCash : this.cashDrawerData.endShift.recievedCash,
        expectedCash : this.cashDrawerData.endShift.expectedCash,
        differenceValue : this.cashDrawerData.endShift.difference.amount,
        differenceAccept : this.cashDrawerData.endShift.difference.accept,
        withDraw : this.cashDrawerData.endShift.withDraw,
        deposit : this.cashDrawerData.endShift.deposit,
        total : this.cashDrawerData.endShift.total,
      })
    }


}