import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.scss']
})
export class BlogCommentComponent implements OnInit {

  modalData: any = {};
  
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.modalData['header'] = 'Comments';
  }

  ngOnInit() {
  }

}
