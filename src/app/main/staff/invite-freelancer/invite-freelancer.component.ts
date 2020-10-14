import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { FREE_LANC, INVITE_FREE, REHIRE, JOB_LIST } from 'app/services/url';

@Component({
  selector: 'app-invite-freelancer',
  templateUrl: './invite-freelancer.component.html',
  styleUrls: ['./invite-freelancer.component.scss']
})
export class InviteFreelancerComponent implements OnInit {
  newJobInvite: boolean = true;
  jobsListView: any;
  reHireForm: any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<InviteFreelancerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _toast: MessageService,
    private spinner : NgxSpinnerService,
    private formBuilder : FormBuilder,
    private service : ApiService
  ) { 

    this.inviteForm = this.formBuilder.group({
      inviteType : [''],
      verification : [''],
      businessCard : [''],
      gender : [''],
      certificate : ['']
    })

    this.reHireForm = this.formBuilder.group({
      jobId : [''],
      therapistId : this.data._id
    })
  }

  inviteForm : any;
  ngOnInit() {
    console.log(this.data);
    if(this.data == 'newJob'){
      this.newJobInvite = true;
    }
    else if(this.data) {
      this.newJobInvite = false;
    }

    this.getAllJobs(localStorage.getItem('id'))

  }

  submitClicked() {
  }

  getAllJobs(ownerId) {
    this.service.get(JOB_LIST + ownerId).subscribe(res => {
      this.jobsListView = res.result;
    }, err => {
      console.log(err);
    })
  }

  skipClicked() {
    this.spinner.show();
    this.dialogRef.close();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  submitRehireForm(form) {
    this.spinner.show();
    console.log('invite Submitted');

  this.service.get(REHIRE +form.value.jobId +'&therapistId=' + form.value.therapistId).subscribe(res=>{
    console.log(res);
    this._toast.add({ severity: "success",summary: "Inivite Send",detail: "Invitation is send to"+' '+ this.data.firstName +' '+"for Rehire." });  
  },err=>{
    console.log(err);
  })
    this.dialogRef.close();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  cancelInvite() {
    this.dialogRef.close();
  }


  submitInviteForm(form) {
    this.spinner.show();
    console.log(form.value);
    let data = form.value;
    // +data.verification
    this.service.get(INVITE_FREE + data.inviteType + '?' + data.businessCard + '=true&gender=' + data.gender).subscribe(res=>{
      console.log(res);
      this._toast.add({ severity: "success",summary: "Inivite Send",detail: "Invitation are send to the specified people." });  
      this.dialogRef.close();
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this._toast.add({ severity: "error",summary: "Invite not send",detail: "Fill all the fields." });  
      console.log(err);
    })

  }


}