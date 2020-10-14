import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BlogAddEditComponent } from '../blog-add-edit/blog-add-edit.component';
import { BlogCommentComponent } from '../../blog-comment/blog-comment.component';

@Component({
  selector: 'app-blog-info-modal',
  templateUrl: './blog-info-modal.component.html',
  styleUrls: ['./blog-info-modal.component.scss']
})
export class BlogInfoModalComponent implements OnInit {
  item: any;
  @ViewChild('content') conent: ElementRef;
  isBlog: boolean = true;
  isComment: boolean = false;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {


  }
  ngOnInit() {
    this.item = this.data.data
    console.log("modal blog info data", this.data);

  }

  delete() {

  }
  openEditModalModal(type,blogData) {
    const dialogRef = this.dialog.open(BlogAddEditComponent, {
      data: {
        edit: type,
        blogData : blogData,
        header: 'Edit Blog'
      },
      width: '600px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCommentDialog(data) {
    this.isComment = true;
    this.isBlog = false
    // const dialogRef = this.dialog.open(BlogCommentComponent, {
    //  data : data,
    //   width: '600px',
    //   maxHeight: '100%',
    //   autoFocus: false,
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

}
