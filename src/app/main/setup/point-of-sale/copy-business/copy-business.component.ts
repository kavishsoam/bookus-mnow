import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { NewBusinessComponent } from '../new-business/new-business.component';


@Component({
  selector: 'app-copy-business',
  templateUrl: './copy-business.component.html',
  styleUrls: ['./copy-business.component.scss']
})
export class CopyBusinessComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CopyBusinessComponent>,
    public dialog : MatDialog
  ) { }

  ngOnInit() {
  }

  createBusiness() {
    const dialogRef = this.dialog.open(NewBusinessComponent, {
      width: '100vw',
      height: '100vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result ==>>',result);
    })
  }
}
