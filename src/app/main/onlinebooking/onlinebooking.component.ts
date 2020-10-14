import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-onlinebooking',
  templateUrl: './onlinebooking.component.html',
  styleUrls: ['./onlinebooking.component.scss']
})
export class OnlinebookingComponent implements OnInit {
  constructor(private _fuseConfigService: FuseConfigService
  ) {
  }
  pageHeader: Object = { header: "Online Booking", navigate: false }
  ngOnInit() {
    this.setPageHeader()
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
}
