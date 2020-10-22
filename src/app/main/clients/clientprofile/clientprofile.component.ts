import { Component, OnInit, Optional, Input, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import {
  CLIENT,
  APPOINTMENT,
  STAFF_LIST_LOC,
  STAFF,
  GET_STAFF_DROP,
} from "app/services/url";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTableDataSource,
  Sort,
} from "@angular/material";
import { FuseConfigService } from "@fuse/services/config.service";
import { AddNewClient, ClientIntakeForm } from "../clients.component";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { MessageService } from "primeng/api";
import { FormControl, FormBuilder } from "@angular/forms";
import { FamilyandfriendComponent } from "../familyandfriend/familyandfriend.component";
import { ImageUploaderOptions } from "ngx-image-uploader";
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  rubberBandAnimation,
  collapseAnimation,
  bounceOutDownOnLeaveAnimation,
  fadeInLeftOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
} from "angular-animations";
import * as moment from "moment";

interface serviceGroup {
  value: string;
  viewValue: string;
}

interface serviceGrouped {
  disabled?: boolean;
  name: string;
  service: serviceGroup[];
}

@Component({
  selector: "app-clientprofile",
  templateUrl: "./clientprofile.component.html",
  styleUrls: ["./clientprofile.component.scss"],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    // rubberBandAnimation(),
    // collapseAnimation(),
    fadeInLeftOnEnterAnimation({
      anchor: "enter",
      duration: 1000,
      delay: 100,
      translate: "30px",
    }),
    fadeOutLeftOnLeaveAnimation({
      anchor: "leave",
      duration: 800,
      delay: 50,
      translate: "30px",
    }),
  ],
})
export class ClientprofileComponent implements OnInit {
  @Optional() public dialogRef: MatDialogRef<ClientprofileComponent>;
  @Optional() @Inject(MAT_DIALOG_DATA) public data: any;
  @Input("name") name: string;
  public id: string;
  display: boolean;
  clientInfo: any;
  clientProfile: boolean;
  appointment: any = [];
  currencyCode: string;
  clientDetails: any;
  profileInfo: any;
  dataSource: any;
  clientList: any;
  clientAppointmentList: any = [];
  clientEditForm: any;
  animate: boolean = false;
  selectedInd = 0;
  message: string;
  imagePath: any;
  imgURL: any;
  staffDropList: any = [];
  staffDrop = new FormControl("");
  serviceDrop = new FormControl("");
  statusDrop = new FormControl("allStatus");
  allDrop = new FormControl("");
  moment = moment;

  transactionHisroty = [
    { date: '12 Feb - 6:00 PM', name: 'Relaxation Massage', type: 'Service', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Massage Oil', type: 'Equipment', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Relaxation Massage', type: 'Service', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Relaxation Massage', type: 'Service', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Massage Oil', type: 'Equipment', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Massage Towel', type: 'Equipment', serveBy: 'Eilyn', price: 100 },
    { date: '12 Feb - 6:00 PM', name: 'Relaxation Massage', type: 'Completed', serveBy: 'Eilyn', price: 100 },
  ];

  treamentNotes = [
    { date: '12 Feb - 6:00 PM', noteBy: 'Mark', item: 'Deep Tissue Massage', decription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', soapNote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' },
    { date: '12 Feb - 6:00 PM', noteBy: 'Eilynnn', item: 'Deep Tissue Massage', decription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', soapNote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' },
    { date: '12 Feb - 6:00 PM', noteBy: 'Wendy', item: 'Deep Tissue Massage', decription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', soapNote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' },
    { date: '12 Feb - 6:00 PM', noteBy: 'Jacob', item: 'Remedial', decription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', soapNote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' },
  ];
  sortedtransactionHisroty: any;
  sortedtreamentNotes: any;
  toggleAnimate() {
    this.animate = !this.animate;
  }

  saleDateTimeRange: any;
  noline = [
    {
      viewValue: "All Status",
      value: "allStatus",
    },
    {
      viewValue: "Accepted",
      value: "accepted",
    },
    {
      viewValue: "New",
      value: "new",
    },
    {
      viewValue: "Show",
      value: "show",
    },
    {
      viewValue: "No Show",
      value: "noShow",
    },
    {
      viewValue: "Service in Progress",
      value: "serviceInProgress",
    },
    {
      viewValue: "Service Completed",
      value: "completed",
    },
    {
      viewValue: "Cancelled",
      value: "cancelled",
    },
    {
      viewValue: "Need Acceptance",
      value: "needAcceptance",
    },
    {
      viewValue: "Denied",
      value: "denied",
    },
    {
      viewValue: "Awaiting Confirmation",
      value: "awaitingConfirmation",
    },
    {
      viewValue: "Confirmed",
      value: "confirmed",
    },
    {
      viewValue: "Deleted",
      value: "Deleted",
    },
  ];

  serviceValues = [
    {
      value: "Tengh",
      viewValue: "staff111",
    },
    {
      value: "yan",
      viewValue: "staff12",
    },
    {
      value: "Lindan",
      viewValue: "staff123",
    },
    {
      value: "Leechown",
      viewValue: "staff234",
    },
    {
      value: "Weeng",
      viewValue: "staff1234",
    },
  ];

  serviceControl = new FormControl();

  serviceGroups: serviceGrouped[] = [
    {
      name: "Grass",
      service: [
        { value: "bulbasaur-0", viewValue: "Bulbasaur" },
        { value: "oddish-1", viewValue: "Oddish" },
        { value: "bellsprout-2", viewValue: "Bellsprout" },
      ],
    },
    {
      name: "Water",
      service: [
        { value: "squirtle-3", viewValue: "Squirtle" },
        { value: "psyduck-4", viewValue: "Psyduck" },
        { value: "horsea-5", viewValue: "Horsea" },
      ],
    },
    {
      name: "Fire",
      disabled: true,
      service: [
        { value: "charmander-6", viewValue: "Charmander" },
        { value: "vulpix-7", viewValue: "Vulpix" },
        { value: "flareon-8", viewValue: "Flareon" },
      ],
    },
    {
      name: "Psychic",
      service: [
        { value: "mew-9", viewValue: "Mew" },
        { value: "mewtwo-10", viewValue: "Mewtwo" },
      ],
    },
  ];
  showProfile: boolean = true;
  friendsList: any = [
    {
      _id: "5e7c5ff458cc2c507c3f512d",
      relationship: "mother",
      firstName: "Saroj",
      lastName: "tomer",
      email: "nihfd@gmia.com",
      phone: "937198461",
      gender: "female",
    },
    {
      _id: "5e7c8a0a869b3852cd96583e",
      relationship: "father",
      firstName: "Nepal",
      lastName: "Soam",
      email: "nihfd@gmia.com",
      phone: "9371wd98461",
      gender: "male",
    },
    {
      _id: "5e7c8a0a869b3852cd96583f",
      relationship: "sister",
      firstName: "Hema",
      lastName: "tomer",
      email: "nihafd@gmia.com",
      phone: "937187651",
      gender: "female",
    },
    {
      _id: "5e8316ea25341f001aaf68fa",
      relationship: "father",
      firstName: "god",
      lastName: "vastu",
      email: "nihfd@gmia.com",
      phone: "9371wd98461",
      gender: "male",
    },
    {
      _id: "5e8316fefaaa81001a03589b",
      relationship: "Sibling",
      firstName: "aashish",
      lastName: "soam",
      email: "nihfd@gmia.com",
      phone: "9371wd98461",
      gender: "male",
    },
  ];

  sendClientId(id): void {
    this._fuseConfigService.sendClientId(id);
  }
  constructor(
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private _fuseConfigService: FuseConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _service: ApiService,
    private _toast: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.clientEditForm = this.formBuilder.group({
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      gender: "",
      address: "",
      apartmentNo: "",
    });

    moment.updateLocale("en", {
      relativeTime: {
        s: "seconds",
        m: "a min",
        mm: "%d mins",
        h: "an hour",
        hh: "%d hrs",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      }
    });

  }

  clientListColumn: string[] = [
    "status",
    "startTime",
    "price",
    "service",
    "staff",
  ];
  imageOptions: ImageUploaderOptions = {
    uploadUrl:
      "https://fancy-image-uploader-demo.azurewebsites.net/api/demo/upload",
    cropEnabled: false,
    thumbnailResizeMode: "fill",
    autoUpload: false,
    resizeOnLoad: true,
    thumbnailWidth: 220,
    thumbnailHeight: 200,
  };
  pageHeader: Object = {
    header: " Client Profile",
    main: "Clients",
    navigate: true,
  };
  ngOnInit() {
    this.clientProfile = false;
    this.spinner.show();
    let locationId = localStorage.getItem("location_id");
    this.currencyCode = localStorage.getItem("currency");
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.setPageHeader();
    this.getOneClient();
    this.getAppointmentById(this.id);
    this.getAllClients();
    this.getAllService();
    this.getAllStaffLoc(locationId);
    this.getAppointmentByStatus();
    this.getAllStaffList();
    this.sortedtransactionHisroty = this.transactionHisroty.slice();
    this.sortedtreamentNotes = this.treamentNotes.slice();
  }

  getAppointmentByStatus() {
    //  this.service.get('');
  }

  getAllStaffList() {
    this._service.get(GET_STAFF_DROP).subscribe((res) => {
      console.log(res);
      this.staffDropList = res;
    });
  }

  clearFiler() {
    this.saleDateTimeRange = [];
    this.staffDrop.setValue('');
    this.serviceDrop.setValue('');
    this.statusDrop.setValue('');
    this.allDrop.setValue('');
  }

  appointmentSearch() {
    this.spinner.show();

    if (this.saleDateTimeRange && this.saleDateTimeRange.length > 1) {
      this.saleDateTimeRange[0] =
      this.saleDateTimeRange && this.saleDateTimeRange[0]
        ? moment(this.saleDateTimeRange[0]).format("YYYY-MM-DD")
        : "";
    this.saleDateTimeRange[1] =
      this.saleDateTimeRange && this.saleDateTimeRange[0]
        ? moment(this.saleDateTimeRange[1]).format("YYYY-MM-DD")
        : "";
    }   

    console.log(this.staffDrop.value);
    console.log(this.serviceDrop.value);
    console.log(this.statusDrop.value);
    // let form : any = {};
    // form = {
    //   client : this.id,
    //   service  : this.serviceDrop.value,
    //   status : this.statusDrop.value,
    //   staff : this.staffDrop.value,
    //   startDate : this.saleDateTimeRange[0],
    //   endDate : this.saleDateTimeRange[1]
    // };

    let form: any = {};

    if (this.serviceDrop.value) {
      form.service = this.serviceDrop.value;
    }
    if (this.statusDrop.value) {
      form.status = this.statusDrop.value;
    }
    if (this.staffDrop.value) {
      form.staff = this.staffDrop.value;
    }
    if (this.saleDateTimeRange && this.saleDateTimeRange[0]) {
      form.startDate = this.saleDateTimeRange[0];
    }
    if (this.saleDateTimeRange && this.saleDateTimeRange[1]) {
      form.endDate = this.saleDateTimeRange[1];
    }
    if (this.id) {
      form.client = this.id;
    }

    // if( ){
    this._service.get("appointment/appointment_detail", form).subscribe(
      (res) => {
        //  this._service.get('appointment/appointment_detail?client='+form.clientId+ '&service='+form.service + '&status=' + form.status + '&staff=' +form.staff + '&startDate='+form.startDate + '&endDate='+ form.endDate).subscribe(res=>{
        console.log(res);
        this.clientAppointmentList = res.appointment;

        this._toast.add({
          severity: "success",
          summary: "Filter applied successfully",
          detail: "appointment list after filter",
        });
        this.spinner.hide();
      },
      (err) => {
        this._toast.add({
          severity: "error",
          summary: "something went wrong",
          detail: "something went wrong",
        });
        console.log(err);
        this.spinner.hide();
      }
    );
    //   }else {
    //     this.spinner.hide();
    //     this._toast.add({ severity: 'error', summary: 'something went wrong', detail: 'select every single one available filters' });    }
    //  }
  }

  setClientFormData() {
    this.clientEditForm.setValue({
      firstName: this.profileInfo.firstName,
      lastName: this.profileInfo.lastName,
      email: this.profileInfo.email,
      confirmEmail: this.profileInfo.email,
      gender: this.profileInfo.gender,
      address: this.combineAddress(this.profileInfo.address),
      apartmentNo: this.profileInfo.address.area,
    });
  }

  combineAddress(data) {
    return (
      data.area +
      " " +
      data.street +
      " " +
      data.city +
      " " +
      data.state +
      " " +
      data.country
    );
  }

  uploadImage(image) {
    console.log(image);
    let uploadedImage: File;
    uploadedImage = image.fileToUpload;
    const formdata = new FormData();
    formdata.append("photos", uploadedImage);

    this._service.post("assets/uploadImages", formdata).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  getOneClient() {
    this._service.get(`${CLIENT}/${this.id}`).subscribe((res) => {
      this.profileInfo = res[0];

      // set verifiled user
      this.profileInfo.isverifiled = this.profileInfo.firstName === "naina";
      this.setClientFormData();
      this.getAllFriendsList();
      let clone = _.cloneDeep(res);
      this.clientInfo = clone[0];
      clone.map((data) => {
        data.address = [
          data.address && data.address.street,
          data.address && data.address.area,
          data.address && data.address.city,
          data.address && data.address.state,
          data.address && data.address.country,
          data.address && data.address.zip,
        ];
        data.address = data.address.filter(Boolean).join(", ");
        return data;
      });
    }),
      (err) => {};
  }

  onOptionSelected(value) {
    if (value == "Edit") {
      // this.showProfile = false;
      this.editClient({
        header: "Edit Client",
        data: this.profileInfo,
        intakeBtn: "Save",
      });
    }
    if (value == "delete") {
      this.editClient({
        header: "Delete Client",
        data: this.profileInfo,
        intakeBtn: "Save",
      });
    }
    if (value == "Merge") {
      this._toast.add({
        severity: "success",
        summary: "Service Message",
        detail: "",
      });
    }
  }
  editClient(data) {
    const dialogRef = this.dialog.open(AddNewClient, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getOneClient();
    });
  }
  getIntakeByBookingReference(id) {
    this.intakeForm(id);
  }
  intakeForm(intakedata): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      width: "100vw",
      height: "100vh",
      autoFocus: false,
      data: { type: "bookingRefer", intakedata: intakedata },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  getAppointmentById(client_id) {
    this._service.get(`${APPOINTMENT}/client?id=${client_id}`).subscribe(
      (res) => {
        this.clientDetails = res.clientInfo;
        this.appointment = res.appointment;
        this.clientProfile = true;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  newAppointment() {
    this.router.navigate(["main/calendar"]);
    setTimeout(() => {
      this.sendClientId(this.clientInfo._id);
    }, 0);
  }

  getAllClients() {
    this.spinner.show();
    this._service.get(CLIENT).subscribe(
      (res) => {
        if (!res) this.clientList = [];
        else this.clientList = res;

        this.dataSource = new MatTableDataSource(this.clientList);
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getAllService() {
    let data = [];
    this._service.get("services/pricing_list").subscribe(
      (res) => {
        // console.log(res);
        res.result.forEach((ele) => {
          let innerData = [];
          ele.services.forEach((element) => {
            innerData.push({ value: element._id, viewValue: element.name });
            // data.service.push({ value : element._id, viewValue : element.name })
          });
          data.push({ name: ele.serviceGroup, service: innerData });
          // data['service'].push(innerData);
        });
        console.log(data);
        this.serviceGroups = data;
      },
      (err) => {
        console.log(err);
      }
    );
    // this.serviceGroups = data;
  }

  getAllStaffLoc(id) {
    this._service.get(`${STAFF_LIST_LOC}${id}`).subscribe(
      (res) => {
        console.log(res);
        // this.serviceValues = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  familyAndFriend() {
    const dialogRef = this.dialog.open(FamilyandfriendComponent, {
      width: "54vw",
      height: "71vh",
      autoFocus: false,
      data: this.profileInfo,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllFriendsList();
      console.log(result);
    });
  }

  editCancel() {
    this.showProfile = true;
  }

  submitClientForm(formData) {
    console.log(formData);
    this.showProfile = true;
  }

  getAllFriendsList() {
    this._service.get("client/relationships/" + this.profileInfo._id).subscribe(
      (res) => {
        console.log(res);
        this.friendsList = res.ClientRelations[0].relations;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
  sortData(sort: Sort) {
    const data = this.transactionHisroty.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedtransactionHisroty = data;
      return;
    }

    this.sortedtransactionHisroty = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'serveBy': return compare(a.serveBy, b.serveBy, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }
  sortTreatmentData(sort: Sort) {
    const data = this.treamentNotes.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedtreamentNotes = data;
      return;
    }

    this.sortedtreamentNotes = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        case 'noteBy': return compare(a.noteBy, b.noteBy, isAsc);
        case 'item': return compare(a.item, b.item, isAsc);
        case 'decription': return compare(a.decription, b.decription, isAsc);
        case 'soapNote': return compare(a.soapNote, b.soapNote, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
