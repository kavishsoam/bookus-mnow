import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LOCATION, JOB_APP_OWN, JOB_ID, HIRE } from "app/services/url";
import { ApiService } from "app/services/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-appliedjobs",
  templateUrl: "./appliedjobs.component.html",
  styleUrls: ["./appliedjobs.component.scss"],
})
export class AppliedjobsComponent implements OnInit {
  localJobList = [
    {
      photo: "132",
      name: "John cena",
      gender: "Male",
      phone: "9874512456",
      email: "john@gmail.com",
      level: "2.0",
      customerRating: "4.5(25)",
      businessRating: "2.0 (13)",
    },
    {
      photo: "132",
      name: "Cenrela georgie",
      gender: "Female",
      phone: "9874512456",
      email: "cendrela@gmail.com",
      level: "   1.0",
      customerRating: "4.5(25)",
      businessRating: "2.0 (13)",
    },
    {
      photo: "132",
      name: "Nirmun patel",
      gender: "Male",
      phone: "9874512456",
      email: "nirmun@gmail.com",
      level: "2.0",
      customerRating: "4.5(25)",
      businessRating: "2.0 (13)",
    },
  ];

  jobListColumn: string[] = [
    "photo",
    "name",
    "gender",
    "phone",
    "email",
    "level",
    "customerRating",
    "businessRating",
    "hire",
  ];

  constructor(
    private service: ApiService,
    private spinner: NgxSpinnerService,
    private toast: MessageService
  ) {}
  @Input() jobData: any;
  @Output() backNavigate: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    console.log(this.jobData);
    this.getAllJobAppliant(this.jobData);
  }

  getBackToStaff() {
    this.backNavigate.emit("true");
  }

  getAllJobAppliant(data) {
    this.localJobList = [];
    let id = localStorage.getItem("id");
    this.service.get(JOB_APP_OWN + id + JOB_ID + data._id).subscribe(
      (res) => {
        this.localJobList = res.result[0].applicants;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // {
  //   "ownerId" : ["5de50317e9127641e56725c0"],
  //   "therapistId": "5dd65fdfa13b7f32903d3c26",
  //         "status": "selected
  // }

  HireClicked(value) {
    this.spinner.show();
    console.log(value);
    let data = {
      ownerId: [localStorage.getItem("id")],
      therapistId: value.therapistId._id,
      jobId: this.jobData._id,
      // status : 'selected'
    };
    this.service.post(HIRE, data).subscribe(
      (res) => {
        console.log(res);
        setTimeout(() => {
          this.spinner.hide();
          this.toast.add({
            severity: "success",
            summary: value.therapistId.firstName + "is Hired",
            detail:
              value.therapistId.firstName +
              value.therapistId.lastName +
              "is been hired for the job",
          });
        }, 400);
        this.ngOnInit();
      },
      (err) => {
        console.log(err);
        setTimeout(() => {
          this.spinner.hide();
        }, 400);
      }
    );
  }

  addStaff() {
    this;
  }
}
