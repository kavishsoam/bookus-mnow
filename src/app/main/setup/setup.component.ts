import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CopyBusinessComponent } from './point-of-sale/copy-business/copy-business.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'app/services/api.service';
import { COMPANY_DETAILS, LOCATION } from 'app/services/url';
import { EditLocations } from './account-setup/locations/locations.component';
import { Router } from '@angular/router';
import { PremiumComponent } from './account-setup/premium/premium.component';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  subHeader: any;
  innerSettings: boolean = false;
  companyList: any = [];
  locationList: any = [];

  constructor(
              private _fuseConfigService: FuseConfigService,
              private dialog : MatDialog,
              private spinner : NgxSpinnerService,
              private service : ApiService,
              private router : Router
  ) {
  }
  pageHeader: Object = { header: "Setup", navigate: false }
  ngOnInit() {
    this.setPageHeader()
    this.getCompanyDetails();
    this.getAllLocations();
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }

  openCopyBusinessModal() {
    const dialogRef = this.dialog.open(CopyBusinessComponent, {
      width: "40vw",
      height: "33vh",
      data : this.companyList
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result ==>>',result);
    })
  }

  viewInnerSettings(data) {
    this.spinner.show();
    setTimeout(() => {
      this.innerSettings = !this.innerSettings;
      this.subHeader = data;  
      this.spinner.hide();
    }, 1500);
  }

  navigatBack() {
    this.spinner.show();
    setTimeout(() => {
      this.innerSettings = !this.innerSettings;
      this.spinner.hide();
    }, 1500);
  }

  getCompanyDetails() {
    this.service.get(COMPANY_DETAILS).subscribe(res=>{
    this.companyList = res;
    },err=>{
      console.log(err)
    })
  }

  getAllLocations() {
    this.spinner.show();
  this.service.get(LOCATION).subscribe(res=>{
    this.locationList = res;
    setTimeout(() => {
      this.spinner.hide();      
    }, 200);
  },err=>{
    console.log(err);
  })
  }



  locationSelect(row) {
    // this.rowSelected = true;
    this.router.navigate([`/main/setup/locations/${row._id}`]);
        // const dialogRef = this.dialog.open(EditLocations, {
    //   width: '576px',
    //   // height: '100%',
    //   autoFocus: false,
    //   data: { isvisible: true, header: "Edit Location", locations: row, locList: this.locationList.length }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.type) {
    //     if (result.type == 'refresh') {
    //       this.getAllLocations();
    //     }
    //   }
    // });
  }

openPremium() {
  const dialogRef = this.dialog.open(PremiumComponent,{
    width: "50vw",
    height: "50vh",
    panelClass: 'pad-Mnow321',
  })

  dialogRef.afterClosed().subscribe(res=>{
    console.log(res);
  })
}

}
