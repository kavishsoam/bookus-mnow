import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { ApiService } from 'app/services/api.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  userId: any;
  dataSource: any = [];
  displayedColumns: string[] = ['name', 'review', 'communication_star', 'massage_star', 'ratedto'];
  constructor(private _fuseConfigService: FuseConfigService, private service: ApiService) { }
  pageHeader: Object = { header: "Reviews", navigate: false }
  ngOnInit() {
    this.userId = localStorage.getItem('id');
    // this.userId = '5dde30b917683700184ab5bb';
    this.setPageHeader()
    this.reviewApi();
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }


  reviewApi() {
    this.service.get('rating/staff_review/' + this.userId).subscribe(res => {
      //('reviews api response =======>>>>>', res);
      // let data = res.result;
      this.dataSource = res.result;
    }, err => {
      //(err);
    })
  }


}
