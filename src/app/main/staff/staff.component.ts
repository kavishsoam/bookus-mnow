import { Router } from "@angular/router";
import { MainModule } from "./../main.module";
import { Component, OnInit, Input } from "@angular/core";
import { FuseConfigService } from "@fuse/services/config.service";
import * as moment from "moment";
import { MatDialog } from "@angular/material";
import { ApiService } from "app/services/api.service";
import {
  STAFF,
  WORK_SCH,
  LOC_LIS,
  STAFF_LIST_LOC,
  SALE,
  JOB_LIST,
  LOCATION,
  DEL_JOB,
  DEACT_STAFF,
  INACTIVE_STAFF,
} from "app/services/url";
import { MessageService } from "primeng/api";
import { HttpParams } from "@angular/common/http";
import { enableRipple } from "@syncfusion/ej2-base";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material";
import { StaffModal } from "./staffModel/staffModal.component";
import { staffEditorProfile } from "./staffEditProfile/staffEditProfile.component";
import { staffSalary } from "./staffSalary/staffSalary.component";
import { CloseDateComponent } from "./close-date/close-date.component";
import { ExportService } from "app/services/export.service";
import { NewjobComponent } from "./newjob/newjob.component";
import { fadeInLeftOnEnterAnimation } from "angular-animations";
import { InviteFreelancerComponent } from "./invite-freelancer/invite-freelancer.component";
import { SalaryConfirmComponent } from "./salary-confirm/salary-confirm.component";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
enableRipple(true);
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.scss"],
  animations: [
    fadeInLeftOnEnterAnimation({
      anchor: "enter",
      duration: 1000,
      delay: 100,
      translate: "30px",
    }),
  ],
})
export class StaffComponent implements OnInit {
  selected = "Options";
  Sun_date: Date; //calculated with logic
  Mon_date: Date;
  Tue_date: Date;
  Wed_date: Date;
  Thu_date: Date;
  Fri_date: Date;
  Sat_date: Date; //calculated with logic
  dateArr: [
    "Sun_date",
    "Mon_date",
    "Tue_date",
    "Wed_date",
    "Thu_date",
    "Fri_date",
    "Sat_date"
  ];
  work: any = [];
  locList: any = [];
  selectedLoc: any;
  currentDate = new Date();
  staff: any = [];
  commissionList: any = [];
  commissionListCpy: any = [];
  selectedStaff: any = "";
  selectedService: any;
  displayedColumnsStaff: string[] = [
    "Name",
    "Mobile",
    "Email",
    "Appointment",
    "userPermission",
  ];
  staffList: any = [];
  staffListColumn: string[] = [
    "firstName",
    "lastName",
    "email",
    "notes",
    "phone",
    "staffTitle",
    "Reviews",
    "action",
  ];
  id: String;
  type: String;
  currencyCode: String;
  displayedColumns: string[] = [
    "booking_reference",
    "commission_amount",
    "sales_amount",
  ];
  ownerDisplayedColumns: string[] = [
    "staffName",
    "commissionAmt",
    "salesAmt",
    "action",
  ];
  dataSource: any;
  staffComm: any;
  selectedDate: any;
  optionSelected: any;
  closedDateList: any = [];
  closeDisplayColumn: string[] = [
    "startDate",
    "days",
    "locationName",
    "description",
  ];
  // reviewDisplayedColumns: string[] = ['RATED_BY', 'EMAIL', 'REVIEW', 'STAR'];
  // reviewDataSource: any;
  closedDate: any = [];

  userId: any;
  reviewList: any = [];
  reviewRow: string[] = ["name", "review", "star"];
  selectedReviewLoc: any;
  createAJobClicked: boolean = false;
  showJobs: boolean = false;
  jobData: any = [];
  showJobDropDown: boolean = false;
  jobsListView: any = [];
  locationData: any;
  pastStaffList: any = [];
  saleDateTimeRange: any;
  isCreateJobButton: any = true;
  constructor(
    private _fuseConfigService: FuseConfigService,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private spinner: NgxSpinnerService,
    private exportFile: ExportService,
    private router: Router
  ) {}
  pageHeader: Object = { header: "Staff", navigate: false };
  ngOnInit() {
    this.currencyCode = localStorage.getItem("currency");
    this.dataSource = new MatTableDataSource(this.staffComm);
    this.id = localStorage.getItem("id");
    this.type = localStorage.getItem("type");
    this.setPageHeader();
    this.onDate({ value: this.currentDate });
    this.getAllStaff();
    this.getAllLocationList();
    this.getStaffComission();
    this.getClosedDateList();
    this.reviewApi();
    this.getLocationApiCall();
    this.pastStaffApi();
  }

  newJob() {
    this.createAJobClicked = true;
  }

  newJobModal() {
    this.showJobDropDown = false;
    const dialogRef = this.dialog.open(NewjobComponent, {
      maxWidth: "50vw",
      maxHeight: "99vh",
      autoFocus: false,
      data: {
        _id: "",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  reviewApi() {
    this._service.get("rating/shop_review/" + this.selectedReviewLoc).subscribe(
      (res) => {
        //('reviews api response =======>>>>>', res);
        // let data = res.result;
        // this.reviewList = res.result;
        this.reviewList = res.result;
        let customer = res.customer_detail;
        let customerId;
        // reviewData.forEach(element => {
        //   // let customerDetail = customer.filter((ele)=>ele._id == element.customerId);
        //   // if(customerDetail.length > 0)
        //   element['name'] = customerDetail[0].userName

        // });
        // this.reviewList = reviewData;
      },
      (err) => {
        console.log(err);
        this.reviewList = [];
      }
    );
  }

  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  public onDate(event): void {
    // const event = { value: this.currentDate };
    this.selectedDate =
      event && event.value && event.value._d ? event.value._d : event.value;
    var dayIndex =
      event && event.value && event.value._d
        ? event.value._d.getDay()
        : event.value.getDay();
    // this.selectedDate = new Date(this.selectedDate);
    // var dayIndex = event.value.getDay();
    if (dayIndex > 0 && dayIndex < 6) {
      this.Sun_date = moment(this.selectedDate)
        .subtract(dayIndex, "d")
        .toDate();
      this.Sat_date = moment(this.selectedDate)
        .add(6 - dayIndex, "d")
        .toDate();
    } else if (dayIndex == 0) {
      this.Sun_date = event.value;
      this.Sat_date = moment(this.selectedDate).add(6, "d").toDate();
    } else if (dayIndex == 6) {
      this.Sat_date = event.value;
      this.Sun_date = moment(this.selectedDate).subtract(6, "d").toDate();
    }
    this.Mon_date = moment(this.Sun_date).add(1, "d").toDate();
    this.Tue_date = moment(this.Sun_date).add(2, "d").toDate();
    this.Wed_date = moment(this.Sun_date).add(3, "d").toDate();
    this.Thu_date = moment(this.Sun_date).add(4, "d").toDate();
    this.Fri_date = moment(this.Sun_date).add(5, "d").toDate();
    if (this.selectedLoc && !this.selectedStaff) {
      this.getAllStaffWorking(this.selectedLoc);
    } else {
      if (this.selectedStaff) {
        this.getStaffWorkingById(this.selectedStaff);
      }
    }
  }
  AddingHoursToEmployee(allData, schedule, date) {
    //;

    const dialogRef = this.dialog.open(StaffModal, {
      width: "50%",
      height: "60%",
      autoFocus: false,
      data: {
        alldata: allData,
        schedule: schedule,
        date: date,
        selectedLoc: this.selectedLoc,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.type) {
        if (result.type == "refresh") {
          this.onDate({ value: this.selectedDate });
          this.getAllStaff();
          this.getAllLocationList();
        }
      }
    });
  }
  getAllStaff() {
    const params = new HttpParams();
    this._service.get(`${STAFF}?type=staff`).subscribe(
      (res) => {
        this.staffList = res.filter((item) => item.active == true);
      },
      (err) => {}
    );
  }
  totalComm: any = 0;
  totalSale: any = 0;
  getStaffComission() {
    this._service.get(`${SALE}/staff/${this.id}`).subscribe(
      (res) => {
        this.commissionList = res.result;
        this.commissionListCpy = res.result;
        this.staffComm = this.commissionList.find((value) => {
          if (value.staff._id == this.id) {
            return value;
          }
        });
        this.totalComm =
          this.staffComm &&
          this.staffComm.income
            .map((t) => t.commission_amount)
            .reduce((acc, value) => acc + value, 0);
        this.totalSale =
          this.staffComm &&
          this.staffComm.income
            .map((t) => t.sales_amount)
            .reduce((acc, value) => acc + value, 0);
      },
      (err) => {}
    );
  }
  //to add new staff
  addStaff() {
    var data = { header: "New Staff" };
    const dialogRef = this.dialog.open(staffEditorProfile, {
      width: "100vw",
      height: "100vh",
      panelClass: "pad-Mnow321",
      data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.type) {
        if (result.type == "refresh") {
          this.getAllStaff();
        }
      }
    });
  }
  //to edit staff
  editStaffProfile(value) {
    let data = {};
    if (value.active) {
      data = { header: "Edit Staff", staff: value };
    }
    if (!value.active) {
      data = { header: "View Staff", staff: value };
    }

    const dialogRef = this.dialog.open(staffEditorProfile, {
      width: "94vw",
      height: "98vh",
      panelClass: "pad-Mnow321",
      data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.type) {
        if (result.type == "refresh") {
          this.getAllStaff();
        }
      }
    });
  }
  staffSalary(value) {
    const dialogRef = this.dialog.open(staffSalary, {
      width: "70vw",
      height: "70vh",
      data: { specificStaffCommission: value },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  getAllStaffWorking(loc_id) {
    // this.Sun_date
    // this.Sat_date
    this.spinner.show();
    var startDate = moment(this.Sun_date).format("YYYY-MM-DD");
    var endDate = moment(this.Sat_date).format("YYYY-MM-DD");
    this._service
      .get(`${WORK_SCH}${startDate}&end_date=${endDate}&location_id=${loc_id}`)
      .subscribe(
        (res) => {
          Array.isArray(res.result.all_workschedule)
            ? (this.work = res.result.all_workschedule)
            : (this.work = []);
          this.spinner.hide();
          this.closedDate = res.result.closedDates;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  getStaffWorkingById(id) {
    this.spinner.show();
    var startDate = moment(this.Sun_date).format("YYYY-MM-DD");
    var endDate = moment(this.Sat_date).format("YYYY-MM-DD");
    this._service
      .get(
        `schedule?start_date=${startDate}&end_date=${endDate}&id=${id}&location_id=${this.selectedLoc}`
      )
      .subscribe(
        (res) => {
          //;
          var data = [];
          data.push(res);
          this.work = data;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  getAllLocationList() {
    this.spinner.show();
    this._service.get(LOC_LIS).subscribe(
      (res) => {
        this.locList = res;
        if (!this.selectedLoc && this.locList.length != 0) {
          this.selectedLoc = this.locList[0]._id;
          this.selectedReviewLoc = this.locList[0]._id;
          this.locSelectedListener(this.selectedLoc);
        } else {
          this.spinner.hide();
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  locSelectedListener(loc_id) {
    this.selectedStaff = "";
    this.selectedLoc = loc_id;
    this.getStaffByLoc(loc_id);
    this.reviewApi();
  }

  locSelectedListenerReview(loc_id) {
    this.selectedReviewLoc = loc_id;
    this.reviewApi();
  }

  getStaffByLoc(id) {
    this._service.get(`${STAFF_LIST_LOC}${id}`).subscribe(
      (res) => {
        this.staff = res;
        if (this.staff.length == 0) {
          this.work = [];
          this.spinner.hide();
          this._toast.add({
            severity: "success",
            summary: "Service Message",
            detail: "No staff found",
          });
        } else {
          this.getAllStaffWorking(this.selectedLoc);
        }
      },
      (err) => {}
    );
  }
  StaffSelectedListener(id) {
    this.selectedStaff = id;
    if (this.selectedStaff != "") {
      this.getStaffWorkingById(this.selectedStaff);
    } else {
      this.getAllStaffWorking(this.selectedLoc);
    }
  }
  onTabChange(e) {
    if (e.tab.textLabel == "WORKING HOURS") {
      this.onDate({ value: this.currentDate });
      this.getAllStaff();
      this.getAllLocationList();
      this.getStaffComission();
    }
    if (e.tab.textLabel == "HIRING") {
      this.getAllJobs(localStorage.getItem("id"));
    }
  }

  hiringTabChange(e) {
    if (e.tab.textLabel == "MY FREELANCERS") {
      this.isCreateJobButton = !this.isCreateJobButton;
    }
    if (e.tab.textLabel == "MY JOB") {
      this.isCreateJobButton = !this.isCreateJobButton;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    if (filterValue == "") {
      this.commissionList = this.commissionListCpy;
      return;
    }
    this.commissionList = this.commissionList.filter(function (item) {
      var firstName = item.staff.firstName;
      var lastName = item.staff.lastName;
      if (firstName.match(filterValue) || lastName.match(filterValue)) {
        return firstName.match(filterValue) &&
          firstName.match(filterValue).length > 0
          ? true
          : item.staff.lastName.match(filterValue) &&
            item.staff.lastName.match(filterValue).length > 0
          ? true
          : false;
      }
    });
  }

  //add new closed date
  newClosedDate() {
    this.openCloseDate("New Closed Date");
  }

  //edit close date
  editCloseDate(data) {
    //;
    data.selectAll =
      this.locList.length == data.locationId.length ? true : false;
    this.openCloseDate("Edit Closed Date", data);
  }

  //to open the close date modal.
  openCloseDate(header, tableDatas = null) {
    const dialogRef = this.dialog.open(CloseDateComponent, {
      width: "650px",
      data: { location: this.locList, header: header, tableData: tableDatas },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //("The dialog was closed");
      this.getClosedDateList();
    });
  }

  //to get the closed date list.
  getClosedDateList() {
    this._service.get(`closed`).subscribe(
      (res) => {
        this.closedDateList = res.result;
        this.closedDateList = this.closedDateList.map((it) => {
          return {
            ...it,
            locationName: this.locationNameCollector(it.location),
            locationId: this.locationIdCollector(it.location),
          };
        });
      },
      (err) => {
        this.closedDateList = [];
        console.error("closed date api err::", err);
      }
    );
  }

  locationNameCollector(addArr): string {
    let locName = "";
    addArr.forEach((it) => {
      locName = (locName != "" ? locName + ", " : "") + it.name;
    });
    return locName;
  }

  locationIdCollector(addArr): any[] {
    let locId = [];
    addArr.forEach((it) => {
      locId.push(it._id);
    });
    return locId;
  }

  // name finder from location id
  // locationName(AddArr){
  //   //("running");
  //   let locName = "";
  //   AddArr.forEach(ele => {
  //    this.locList.forEach(it => {
  //       if (it._id == ele) {
  //        locName = (locName != "" ? locName + ', ' : '')  + it.name;
  //        return
  //       }
  //     });
  //   });
  //   return locName;
  // }

  //closedDate finder

  isCloseDateEnable(d) {
    let isOpen: boolean;
    this.closedDate.forEach((ele) => {
      isOpen = moment(d).isBetween(ele.startDate, ele.endDate, null, "[]"); //true
      if (isOpen) return;
    });
    return isOpen;
  }
  onOptionSelected(e, tab) {
    if (e == "CSV") this.csvDownload("csv", tab);
    if (e == "Excel") this.csvDownload("xlsx", tab);
    if (e == "Pdf") this.csvDownload("Pdf", tab);
  }
  csvDownload(type, tab) {
    if (tab == "closeDate") {
      this.exportFile.print(
        type,
        [
          { label: "Start Date", type: "Date", value: "startDate" },
          { label: "End Date", type: "Date", value: "endDate" },
          { label: "Location Name", type: "text", value: "locationName" },
          { label: "Description", type: "text", value: "description" },
          { label: "Days", type: "text", value: "days" },
        ],
        ["Start Date", "End Date", "Location Name", "Description", "Days"],
        this.closedDateList,
        "closeDate",
        "Close Date List",
        "Auto-generated close date data"
      );
    }

    if (tab == "staff") {
      this.exportFile.print(
        type,
        [
          { label: "First Name", type: "text", value: "firstName" },
          { label: "Last Name", type: "text", value: "lastName" },
          { label: "Email", type: "text", value: "email" },
          { label: "Title", type: "text", value: "staffTitle" },
          {
            label: "Service Commission",
            type: "text",
            value: "service_commission",
          },
          {
            label: "Specific Commission",
            type: "text",
            value: "specific_commission",
          },
          { label: "Phone", type: "text", value: "phone" },
        ],
        [
          "First Name",
          "Last Name",
          "Email",
          "Title",
          "Service Commission",
          "Specific Commission",
          "Phone",
        ],
        this.staffList,
        "staff",
        "Staff List",
        "Auto-generated staff data"
      );
    }
  }

  check(_id) {
    this.router.navigate(["main/reviews", _id]);
  }

  backClick() {
    this.createAJobClicked = false;
    this.getAllJobs(localStorage.getItem("id"));
  }

  navigateToJob(data) {
    this.jobData = data;
    this.showJobs = true;
  }

  copyPreviousJob() {
    this.showJobDropDown = true;
  }

  getAllJobs(ownerId) {
    this._service.get(JOB_LIST + ownerId).subscribe(
      (res) => {
        this.getLocationDetails(res.result);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLocationDetails(data) {
    this.jobsListView = data.map((element) => {
      return {
        ...element,
        locationDetails: this.getLocation(element.locationId),
      };
    });
    console.log(this.jobsListView);
  }

  getLocation(id) {
    let returnedData: any;
    this.locationData.forEach((element) => {
      if (id == element._id) {
        returnedData = element;
      }
    });
    return returnedData != undefined ? returnedData : {};
  }

  getLocationApiCall() {
    this._service.get(LOCATION).subscribe(
      (res) => {
        this.locationData = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  backNavigate(e) {
    // (e == true) ?
    this.showJobs = !this.showJobs;
    // : this.showJobs = false ;
  }

  deleteJob(job) {
    this.spinner.show();
    setTimeout(() => {
      this.showJobs = false;
      this.getAllJobs(localStorage.getItem("id"));
    }, 500);
    this._service.delete(DEL_JOB + job._id).subscribe(
      (res) => {
        setTimeout(() => {
          this.spinner.hide();
          this._toast.add({
            severity: "success",
            summary: "Job Deleted",
            detail: res.message,
          });
        }, 800);
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
        this._toast.add({
          severity: "error",
          summary: "something went wrong",
          detail: err.message,
        });
      }
    );
  }

  openCreateJob(e) {
    const dialogRef = this.dialog.open(NewjobComponent, {
      maxWidth: "50vw",
      maxHeight: "100%",
      autoFocus: false,
      data: e.value,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  pastStaffApi() {
    let id = localStorage.getItem("id");
    this._service
      .get(INACTIVE_STAFF + id + "&inactive=true")
      .subscribe((res) => {
        console.log(res);
        this.pastStaffList = res.result;
      });
  }

  deactivateStaff(obj) {
    obj["isWorking"] = false;
    this._service.put(`users?staffId=${obj._id}`, obj).subscribe(
      (res) => {
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "Staff update successfully",
        });
      },
      (err) => {
        this._toast.add({
          severity: "error",
          summary: "Service Message",
          detail: err.error,
        });
      }
    );
  }

  confirmSalary(data) {
    const dialogRef = this.dialog.open(SalaryConfirmComponent, {
      width: "600px",
      height: "300px;",
      data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.type) {
        if (result.type == "refresh") {
          this.getAllStaff();
        }
      }
    });
  }

  salaryinputDateRange(e) {
    console.log("salary startDate", e[0]);
    console.log("salary end Date", e[1]);
  }
}
