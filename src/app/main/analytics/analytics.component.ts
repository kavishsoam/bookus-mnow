import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  salesByClient: any = false;
  analytics: any = true;
  snapshotParam = "initial value";
  subscribedParam = "initial value";
  pageHeader: Object = { header: "Analytics", navigate: false };
  constructor(private _fuseConfigService: FuseConfigService, public router: Router, public route: ActivatedRoute) {

    router.events.subscribe((url: any) => {
      (router.url == '/main/analytics') ? this.salesByClient = true : this.salesByClient = false;
      // //(router.url)
      // //(this.salesByClient)
    });

  }


  ngOnInit() {
    this.setPageHeader();
    // No Subscription
    this.snapshotParam = this.route.snapshot.paramMap.get("id");

    // Subscribed
    this.route.paramMap.subscribe(params => {
      this.subscribedParam = params.get("id");
    });

    /*
     * Exmple for query parameters is relatively the same as above.
     *  
     * this.snapshotQueryParam = this.route.snapshot.queryParamMap.get("queryName");
     * this.route.queryParamMap.subscribe(queryParams => {
     *   this.subscribedQueryParam = queryParams.get("queryName");
     * });
     */
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }

  salesByNavigate(id) {
    // this.router.navigate(['/salesby']);
    // this.router.navigate(['/salesby'])
    this.router.navigate(['/main/analytics/salesby'], { queryParams: { order: id } })
  }
}