import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-referral-sources',
  templateUrl: './referral-sources.component.html',
  styleUrls: ['./referral-sources.component.scss']
})
export class ReferralSourcesComponent implements OnInit {
  constructor(private _fuseConfigService: FuseConfigService) { }
  pageHeader: Object = { header: " Referral sources", main: "Setup", navigate: true }
  ngOnInit() {
    this.setPageHeader()
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
}