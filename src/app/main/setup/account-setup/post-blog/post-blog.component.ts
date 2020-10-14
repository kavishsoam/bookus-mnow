import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'app/services/api.service';
import { LOC_LIS, BLOG_LIST } from 'app/services/url';
import { FuseConfigService } from '@fuse/services/config.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material';
import { BlogInfoModalComponent } from './blog-info-modal/blog-info-modal.component';
import { BlogAddEditComponent } from './blog-add-edit/blog-add-edit.component';

@Component({
  selector: 'app-post-blog',
  templateUrl: './post-blog.component.html',
  styleUrls: ['./post-blog.component.scss']
})
export class PostBlogComponent implements OnInit {
  pageHeader: Object = { header: " Blog", main: "Setup", navigate: true }
  locationId : any;
  blogList: any = [

    // {
    //   title: 'Tip To Relax',
    //   viewCount: 100,
    //   date: '15/10/2020',
    //   time: '09:00PM',
    //   blog: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem
    //   Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a
    //   galley of type and scrambled it to make a type specimen book it has?`
    // },
    // {
    //   title: 'Massage',
    //   viewCount: 100,
    //   date: '15/10/2020',
    //   time: '09:00PM',
    //   blog: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem
    //   Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a
    //   galley of type and scrambled it to make a type specimen book it has?`
    // },
  ]
  locationList: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _fuseConfigService: FuseConfigService,
    private _service : ApiService
  ) {
    this.setPageHeader();
  }

  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }




  ngOnInit() {
  this.getLocationList();
  }
  viewBlogInfoModal(data) {
    const dialogRef = this.dialog.open(BlogInfoModalComponent, {
      data: {
        data: data,
        type: 'info',
      },
      width: '600px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }




  onWriterChange(e) {
    console.log(e);
    this._service.get(BLOG_LIST + e.value).subscribe(res=>{
      console.log(res);
      this.blogList = res.result;

    },err=>{
      console.log(err);
    })
  }

  openCreateModal(type) {
    const dialogRef = this.dialog.open(BlogAddEditComponent, {
      data: {
        edit: type,
        header : 'Post Blog'
      },
      width: '600px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getLocationList() {
    this._service.get(LOC_LIS).subscribe(
      res => {
        this.locationList = res;
        this.locationId = res[0]._id;
      },
      err => {
       console.log(err);
      }
    );
  }
  


}
