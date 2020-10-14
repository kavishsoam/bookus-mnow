import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-online-booking-settings',
  templateUrl: './online-booking-settings.component.html',
  styleUrls: ['./online-booking-settings.component.scss']
})
export class OnlineBookingSettingsComponent implements OnInit {
  constructor(private _fuseConfigService: FuseConfigService) { }
  pageHeader: Object = { header: " Online booking Settings", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader()
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
}