import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  review: any = [];
  reviewDataSource : any = [];

  paramId: any;

  constructor(
    private route: ActivatedRoute,
    private service: ApiService
  ) { }

  reviewDisplayedColumns: string[] = ['RATED_BY', 'REVIEW',  'STAR'];
  dataSource: any;
  ngOnInit() {
    //
    this.route.params.subscribe(params => {
      this.paramId = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.service.getdata(this.paramId).subscribe(data => {
        this.reviewDataSource = data['result'];
        // this.reviewDataSource = new MatTableDataSource(this.review);
      })
    });
  }
}
