import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InviteFreelancerComponent } from '../invite-freelancer/invite-freelancer.component';
import { ApiService } from 'app/services/api.service';
import { FREE_LANC, ACTIVE, INACTIVE } from 'app/services/url';
import { MessageService } from "primeng/api";
@Component({
  selector: 'app-applied-freelancers',
  templateUrl: './applied-freelancers.component.html',
  styleUrls: ['./applied-freelancers.component.scss']
})
export class AppliedFreelancersComponent implements OnInit {

  activeJobList = [
    {
      "photo": '132',
      "name": 'John cena',
      "gender": 'Male',
      "phone": '9874512456',
      "email": 'john@gmail.com',
      "level": '2.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    },
    {
      "photo": '132',
      "name": 'Cenrela georgie',
      "gender": 'Female',
      "phone": '9874512456',
      "email": 'cendrela@gmail.com',
      "level": '   1.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    },
    {
      "photo": '132',
      "name": 'Nirmun patel',
      "gender": 'Male',
      "phone": '9874512456',
      "email": 'nirmun@gmail.com',
      "level": '2.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    }
  ]

  activeJobListColumn: string[] = [
    "photo",
    "name",
    "gender",
    "phone",
    "email",
    'Working'
  ];


  pastJobList = [
    {
      "photo": '132',
      "name": 'John cena',
      "specialist": 'Head',
      "phone": '9874512456',
      "email": 'john@gmail.com',
      "level": '2.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    },
    {
      "photo": '132',
      "name": 'Cenrela georgie',
      "specialist": 'Full',
      "phone": '9874512456',
      "email": 'cendrela@gmail.com',
      "level": '   1.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    },
    {
      "photo": '132',
      "name": 'Nirmun patel',
      "specialist": 'Arm',
      "phone": '9874512456',
      "email": 'nirmun@gmail.com',
      "level": '2.0',
      "customerRating": '4.5(25)',
      "businessRating": '2.0 (13)'
    }
  ]

  pastJobListColumn: string[] = [
    "photo",
    "name",
    "specialist",
    "phone",
    "email",
    "level",
    'Reviews',
    'Working'
  ];


  constructor(
    private dialog: MatDialog,
    private service: ApiService,
    private toast : MessageService
  ) { }
  // @Input() jobsList : any = this.activeJobList;


  ngOnInit() {
    this.getActiveFreelancers();
    this.getPastFreelancers()
  }

  reHireClicked(item) {
    
    const dialogRef = this.dialog.open(InviteFreelancerComponent, {
      width: '40vw',
      maxHeight: '100%',
      autoFocus: false,
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getActiveFreelancers() {
    let id = localStorage.getItem('owner')
    this.service.get(FREE_LANC + id).subscribe(res => {
      this.activeJobList = res.result;
      console.log(res);
    }, err => {
      console.log(err);
    })
  }

  getPastFreelancers() {
    //!PAST FREELANCER
    let id = localStorage.getItem('owner')
    this.service.get(FREE_LANC + id + INACTIVE).subscribe(res => {
      this.pastJobList = res.result;
      console.log(res);
    }, err => {
      console.log(err);
    })
  }

 
  deactivateStaff(obj) {
    obj['isWorking'] = false;
    this.service.put(`users?staffId=${obj._id}`, obj).subscribe(res => {
      this.toast.add({ severity: 'success', summary: 'Service Message', detail: 'Staff update successfully' });
    }, err => {
      this.toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }

}
