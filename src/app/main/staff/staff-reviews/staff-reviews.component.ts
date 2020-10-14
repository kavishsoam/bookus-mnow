import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { ALLREVIEW } from 'app/services/url';

@Component({
  selector: 'app-staff-reviews',
  templateUrl: './staff-reviews.component.html',
  styleUrls: ['./staff-reviews.component.scss']
})
export class StaffReviewsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rating', 'review'];
  dataSource: any;
  reviewDataForModal: any;

  reviewsList = [
    {
      name: 'John Doe',
      rating: 5,
      review: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?`
    },
    {
      name: 'Jason Roy',
      rating: 5,
      review: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?`
    }, {
      name: 'Jason Roy',
      rating: 5,
      review: `What is Lorem Ipsum Lorem Ipsum`
    },
  ];
  saleDateTimeRange : any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('ReviewTemplateModal') ReviewTemplateModal: TemplateRef<any>;
  private reviewDialogRef: MatDialogRef<TemplateRef<any>>;
  constructor(
    public dialog: MatDialog,
    public service : ApiService,
    private detectChange : ChangeDetectorRef
     ) { 
      this.getAllReviews();
     }

  ngOnInit() {
    this.dataSource.sort = this.sort;
   
  }



  viewReviewModal(data) {
    this.reviewDataForModal = data;
    this.reviewDialogRef = this.dialog.open(this.ReviewTemplateModal, {
      width: '600px',
      data: {
        prescription: data
      }
    });
    this.reviewDialogRef.afterClosed().subscribe(comment => {
      console.log(comment);
    });
  }

  getAllReviews() {

this.service.get(ALLREVIEW).subscribe(res=>{
  console.log(res)
  this.reviewsList  = res.result;
  this.dataSource = new MatTableDataSource(this.reviewsList);
  this.detectChange.detectChanges();
},err=>{
  console.log(err);
})

  }
 
}
