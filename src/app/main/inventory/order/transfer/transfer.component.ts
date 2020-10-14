import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { LOC_LIS } from "app/services/url";
import { ApiService } from "app/services/api.service";
@Component({
  selector: "app-transfer",
  templateUrl: "./transfer.component.html",
  styleUrls: ["./transfer.component.scss"]
})
export class TransferComponent implements OnInit {
  header: any = "Select Source Location";
  location: any = [];
  isFirstList:boolean = true;
  label:string = "location"

  constructor(
    public dialogRef: MatDialogRef<TransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService) {}
  ngOnInit() {
    this.getLocation();
    }

  //get all location.
  getLocation = ()=> {
    this._service.get(LOC_LIS).subscribe(
      res => {        
        this.location = res;
       this.location.map((it)=>{
                 it.disabled=false,
                it.checked=false,
                it.selectedFirst=false,
                it.selectedSecond=false           
        })
      },
      err => {}
    );
  }


  selectLocFirst(it){
    this.location.map((it)=>{it.selectedFirst = false})
    it.selectedFirst=true;
    this.isFirstList = false;
   
}
selectLocSecond(it){
  it.selectLocSecond = true;
  this.label = "slip";
}

}
