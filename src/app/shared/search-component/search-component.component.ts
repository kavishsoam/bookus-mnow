import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.scss']
})
export class SearchComponentComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SearchComponentComponent>
  ) { }
  list: any = [{ name: 'rahul', last: 'kumar', dob: '15/aug/2000' },
  { name: 'rahul', last: 'kumar', dob: '15/aug/2000' },
  { name: 'rahul', last: 'kumar', dob: '15/aug/2000' },
  { name: 'rahul', last: 'kumar', dob: '15/aug/2000' },
  { name: 'rahul', last: 'kumar', dob: '15/aug/2000' }]
  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
