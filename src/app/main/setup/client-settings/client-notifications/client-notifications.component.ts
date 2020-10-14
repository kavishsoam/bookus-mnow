import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-client-notifications',
  templateUrl: './client-notifications.component.html',
  styleUrls: ['./client-notifications.component.scss']
})
export class ClientNotificationsComponent implements OnInit {
  ifToggleOn: boolean;
  tabLabel: any;
  constructor(private _fuseConfigService: FuseConfigService, private cd: ApplicationRef) { }
  pageHeader: Object = { header: " Client notifications", main: "Setup", navigate: true }
  isFormView: boolean;
  @ViewChild('childR') childR: any;
  @ViewChild('childCO') childCO: any;
  @ViewChild('childRE') childRE: any;
  @ViewChild('childCA') childCA: any;
  @ViewChild('childT') childT: any;
  @ViewChild('childB') childB: any;

  ngOnInit() {
    this.setPageHeader()
  }
  showMenu(e) {
    this.ifToggleOn = !this.ifToggleOn
  }
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  onTabChange(e) {
    this.cd.tick();

    this.tabLabel = e.tab.textLabel;
    if (e.tab.textLabel == "REMINDERS")
      this.childR.fetchRequiredApi(e.tab.textLabel);
    else if (e.tab.textLabel == "CONFIRMATION")
      this.childCO.fetchRequiredApi(e.tab.textLabel);
    else if (e.tab.textLabel == "RESCHEDULES")
      this.childRE.fetchRequiredApi(e.tab.textLabel);
    else if (e.tab.textLabel == "CANCELLATIONS")
      this.childCA.fetchRequiredApi(e.tab.textLabel);
    else if (e.tab.textLabel == "THANK YOUS")
      this.childT.fetchRequiredApi(e.tab.textLabel);
      else if (e.tab.textLabel == "BIRTHDAY")
      this.childB.fetchRequiredApi(e.tab.textLabel);
  }

}

