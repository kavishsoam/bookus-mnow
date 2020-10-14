import { Component, OnInit, Inject, Optional, forwardRef } from "@angular/core";
import { ReplaySubject, Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  FormControl,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { BlockedtimeComponent } from "../blockedtime/blockedtime.component";
import { CalenderDataService } from "../calenderData.service";
import { fuseAnimations } from "@fuse/animations";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { of } from "rxjs";

import { MessageService } from "primeng/api";
import { DataSourceService } from "app/services/data-source.service";
import { startOfDay } from "date-fns";
import * as moment from "moment";
import { ChangeEventArgs } from "@syncfusion/ej2-angular-calendars";
import {
  APPOINTMENT,
  CLIENT,
  STAFF,
  SERVICE,
  GET_STAFF_DROP,
  LOC_LIS,
  STAFF_LIST_LOC,
  CLIENT_INFO,
  STAFF_SCH,
  INVOICE,
  GET_APP,
} from "../../../services/url";

import * as _ from "lodash";
import { ApiService } from "app/services/api.service";
import {
  AddNewClient,
  ClientIntakeForm,
} from "app/main/clients/clients.component";
import { log } from "util";
import { Translator } from "app/services/translator";
import { HttpParams } from "@angular/common/http";
@Component({
  selector: "new-appointment",
  templateUrl: "new-appointment.component.html",
  styleUrls: ["new-appointment.component.scss"],
  animations: fuseAnimations,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => newappointment),
      multi: true,
    },
  ],
})
export class newappointment implements OnInit {
  apt: any;
  minDate: Date;
  ifClicked: Boolean;
  viewDate: Date;
  walkIn: boolean;
  view: string;
  selectedDay: any;
  value: string;
  loader: boolean = false;
  activeDayIsOpen: boolean;
  appointmentForm: FormGroup;
  public interval: number = 1;
  public customFormat: string = "HH:mm";
  serviceList: any = [];
  clients = [];
  _id: any;
  searchClient: string = "";
  location_id: any;
  clientData: any;
  select_Client: string = "";
  staffName: any;
  clientList: boolean = false;
  staff = [];
  appointment: any = [];
  selectedStaff: any = "";
  isAvailable: boolean;
  between: any = undefined;
  clientIntakeFormFilled: boolean = true;
  intakeId: any;
  currencyCode: string;
  selectedService: any;
  clientDetails: any;
  checked: boolean = false;
  profile: boolean;
  clientInvoices: any;
  message: any;
  appoinmentNewClient: boolean = false;
  protected serviceData: any = [];
  public searchService: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public lnt: any = [
    {
      data: new ReplaySubject<any>(1),
    },
  ];
  searchClientEmail: string;
  searchClientPhone: string;
  isDisabledButton: boolean = false;
  staffDetails: any;
  serviceError: boolean;
  showMathint: boolean = false;
  isStaffWorkingValidationMsg: any = new Array(50);
  isWorkingService: any = new Array(50);
  anyErrorPresent: boolean;
  hintColor = "#ff0000";

  constructor(
    @Optional() public dialogRef: MatDialogRef<newappointment>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private data2: DataSourceService,
    public dialog: MatDialog,
    private CalenderData: CalenderDataService,
    public translator: Translator
  ) {
    this.view = "day";
    this.viewDate = new Date();
    this.activeDayIsOpen = true;
    this.selectedDay = {
      date: startOfDay(new Date()),
    };
  }
  ngOnInit() {
    this.location_id = this.data.location_id;
    //("this.location Id", this.location_id);

    this.walkIn = true;
    this.currencyCode = localStorage.getItem("currency");
    this.appointmentForm = this._formBuilder.group({
      day: [""],
      notes: [""],
      client: [""],
      duration: [""],
      booking: this._formBuilder.array([this.addBookingInit()]),
    });
    this.getAllClient();
    this.getAllStaff();
    this.getAllService();
    this.selectedStaff =
      this.data.staff != undefined
        ? this.data.staff.id
        : this.data.cellData.staff[0];

    //service id binding when single or multiple appointment
    this.data.service ? (this.selectedService = this.data.service.id) : "";
    if (
      this.data &&
      this.data.Header &&
      this.data.Header == "Edit Appointment"
    ) {
      this.viewDate = this.data.startTime;
      this.data.startTime != undefined
        ? this.appointmentForm["controls"]["booking"]["controls"][0][
            "controls"
          ]["startTime"].setValue(this.data.startTime)
        : "";

      this.data.startTime != undefined
        ? this.appointmentForm["controls"]["day"].setValue(this.data.startTime)
        : "";

      this.data.endTime != undefined
        ? this.appointmentForm["controls"]["booking"]["controls"][0][
            "controls"
          ]["endTime"].setValue(this.data.endTime)
        : "";

      this.data.location_id != undefined
        ? (this.location_id = this.data.location_id)
        : "";

      this.data && this.data.Id ? (this._id = this.data.Id) : "";

      this.data.Id != undefined ? this.patchAppointment(this.data) : "";
    } else {
      this.viewDate = this.data.cellData.StartTime;
      this.data.cellData.StartTime != undefined
        ? this.appointmentForm["controls"]["booking"]["controls"][0][
            "controls"
          ]["startTime"].setValue(this.data.cellData.StartTime)
        : "";
      this.data.cellData.StartTime != undefined
        ? this.appointmentForm["controls"]["day"].setValue(
            this.data.cellData.StartTime
          )
        : "";
      this.data.cellData.EndTime != undefined
        ? this.appointmentForm["controls"]["booking"]["controls"][0][
            "controls"
          ]["endTime"].setValue(this.data.cellData.EndTime)
        : "";
      this.data.location_id != undefined
        ? (this.location_id = this.data.location_id)
        : "";
    }
    if (
      this.data.clientAppointment ||
      (this.data.Header == "Edit Appointment" && this.data.walkIn == false)
    )
      this.selectClient({
        _id: this.data.client,
      });
  }

  //kavish dev-rahul
  reDirectingSchedular(e) {
    console.log("view appointment", e);
    this.dialogRef.close({ ...e, close: true });
  }

  addBookingEdit(data) {
    let group = this._formBuilder.group({
      staff: [data.staff],
      startTime: [data.startTime],
      endTime: [data.endTime],
      service: [data.service],
      requestedStaff: [data.requested_staff],
      searchService: [""],
    });
    return group;
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  searchElement(txt, index) {
    //
    this.appointmentForm["controls"]["booking"]["controls"][index]["controls"][
      "searchService"
    ].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((txt) => {
        this.filterServicesGroups(txt, index);
      });
  }
  protected filterServicesGroups(txt, index) {
    if (txt == "") {
      this.appointmentForm["controls"]["booking"]["controls"][index] &&
        this.appointmentForm["controls"]["booking"]["controls"][index][
          "controls"
        ]["searchService"].setValue("");
    }
    if (!this.serviceData) {
      return;
    }
    let search = txt;
    const bankGroupsCopy = this.copyServiceGroup(this.serviceData);
    if (!search) {
      this.lnt[index].data.next(bankGroupsCopy);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.lnt[index].data.next(
      bankGroupsCopy.filter((bankGroup) => {
        const showBankGroup =
          bankGroup.serviceGroup.toLowerCase().indexOf(search) > -1;
        if (!showBankGroup) {
          bankGroup.services = bankGroup.services.filter(
            (bank) => bank.name.toLowerCase().indexOf(search) > -1
          );
        }
        return bankGroup.services.length > 0;
      })
    );
  }
  protected copyServiceGroup(serviceData: any) {
    const bankGroupsCopy = [];
    serviceData.forEach((bankGroup) => {
      bankGroupsCopy.push({
        serviceGroup: bankGroup.serviceGroup,
        services: bankGroup.services.slice(),
      });
    });
    return bankGroupsCopy;
  }
  // XXXXXX XXXX XXXXX XXX   {validators: [Validators.required], asyncValidators: [this.vaidationMessage.bind(this)]}
  //  {validators: [Validators.required], asyncValidators: [this.vaidationMessage.bind(this)]}

  addBookingInit(data = null) {
    let group;
    if (!data) {
      group = this._formBuilder.group({
        staff: ["", Validators.required],
        startTime: [""],
        endTime: [""],
        service: ["", Validators.required],
        requestedStaff: [""],
        searchService: [""],
      });
    } else {
      group = this._formBuilder.group({
        staff: [data.staff],
        startTime: [data.startTime],
        endTime: [data.endTime],
        service: [""],
        requestedStaff: [data.requested_staff],
        searchService: [""],
      });
    }
    return group;
  }

  addBooking(data) {
    // //('start time', data.startTime)
    // //('end time', data.endTime)
    if (data && data.service && data.staff && data.startTime && data.endTime) {
      data.startTime = moment(data.endTime);
      let endTime = data.service.duration.split(" ");
      if (endTime.length == 1) {
        endTime = parseInt(endTime[0]);
        data.endTime = moment(data.startTime).add(endTime, "h");
      } else {
        endTime = [parseInt(endTime[0]), parseInt(endTime[1])];
        data.endTime = moment(data.startTime)
          .add(endTime[0], "h")
          .add(endTime[1], "m");
      }
      data.startTime = moment(data.startTime).toDate();
      data.endTime = moment(data.endTime).toDate();
      const control: FormArray = this.appointmentForm.get(
        `booking`
      ) as FormArray;
      control.push(this.addBookingInit(data));
    } else {
      this._toast.add({
        severity: "error",
        summary: "Service Message",
        detail: `Please fill all fields to add another booking`,
      });
    }
  }
  patchAppointment(data) {
    this.appointmentForm["controls"]["day"].setValue(data.day);

    this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
      "requestedStaff"
    ].setValue(data.requested_staff);

    data.service && data.service._id
      ? this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
          "service"
        ].setValue(data.service)
      : "";

    data.staff._id && data.staff
      ? this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
          "staff"
        ].setValue(data.staff)
      : "";

    this.appointmentForm.controls["notes"].setValue(data.notes);

    data.client && data.client._id
      ? this.appointmentForm.controls["client"].setValue(data.client._id)
      : "";

    data.client && data.client._id
      ? (this.searchClient = data.client.firstName + " " + data.client.lastName)
      : "";

    this.appointmentForm.controls["duration"].setValue(data.duration);
  }
  showMenu(e) {
    this.ifClicked = !this.ifClicked;
  }
  viewProfile() {
    this.profile = !this.profile;
  }
  selectClient(item) {
    this.clientList = false;
    this.clientIntakeFormFilled = false;
    this.walkIn = false;
    if (item.firstName)
      this.searchClient = item.firstName + " " + item.lastName;
    else this.ifClicked = true;
    if (item.clientId) {
      this.appointmentForm.controls["client"].setValue(item.clientId);
    }
    if (item._id) {
      this.appointmentForm.controls["client"].setValue(item._id);
    }
    this.getClientDetails(
      item.clientId || item._id._id ? item.clientId || item._id._id : item._id
    );
    this.getClientInfo(
      item.clientId || item._id._id ? item.clientId || item._id._id : item._id
    );
    this.getClientInvoices(
      item.clientId || item._id._id ? item.clientId || item._id._id : item._id
    );
    this.select_Client = "selected";
  }
  submitAppointmentForm(form) {
    if (form.invalid) {
      return;
    }
    form.invalid ? (this.loader = false) : (this.loader = true);
    //to update the appointment
    if (this.data.Header == "Edit Appointment" && this.walkIn == true) {
      this.clientIntakeFormFilled = true;
    }

    if (this.clientIntakeFormFilled || !this.clientIntakeFormFilled) {
      let bookingArr = [];
      var bookedBy = {
        id: localStorage.getItem("id"),
        type: "staff",
        name:
          localStorage.getItem("firstName") +
          " " +
          localStorage.getItem("firstName"),
      };
      form.value.day = this.viewDate;
      form.value.bookedBy = bookedBy;
      form.value.bookedFrom = "platform";
      form.value.intakeId = this.intakeId;
      form.value.location = this.data.location_id;
      form.value.booking.map((b, i) => {
        let val = form.value;
        if (b.service) {
          val.staff = {
            id: b.staff.id,
            firstName: b.staff.firstName,
            lastName: b.staff.lastName,
            gender: b.staff.gender,
          };
          val.startTime = b.startTime;
          val.endTime = b.endTime;
          val["service_pricing_name"] = b.service.pricingName;
          val["price"] = b.service.price;
          val["special_price"] = b.service.specialPrice;
          val["service"] = {
            id: b.service._id ? b.service._id : b.service.id,
            name: b.service.name,
            commissionEnabled: b.service.commissionEnabled,
          };
          val["requested_staff"] =
            b.requestedStaff == "" ? false : b.requestedStaff;

          if (this.walkIn) {
            val.walkIn = true;
            delete val.client;
          } else {
            val.walkIn = false;
          }
          let clone = _.cloneDeep(val);
          // val._id = this._id   Appointement id delete from the backend..
          bookingArr.push(clone);
        }
      });
      if (
        this.data &&
        this.data.multipleAppList &&
        this.data.multipleAppList.length >= 1
      ) {
        this.data.multipleAppList.forEach((elem, index) => {
          bookingArr[index].Id = elem.Id;
        });
      }

      if (bookingArr.length) {
        bookingArr.forEach((item) => {
          item.duration = this.newDurationCalculate(
            item.startTime,
            item.endTime
          );
        });
      }

      let returnType: any;
      returnType = false;
      bookingArr.forEach((element) => {
        if (
          element["staff"] == {} ||
          element["staff"] == null ||
          element["staff"] == undefined
        ) {
          returnType = true;
        }
      });

      if (returnType == true) {
        return;
      }

      if (this._id != undefined) {
        this.updateAppointment(this._id, bookingArr, form.value);
        return;
      }
      this._service.post(`${APPOINTMENT}`, bookingArr).subscribe(
        (res) => {
          setTimeout(() => {
            this.loader = false;
            this.dialogRef.close({
              Type: "refresh",
            });
          }, 1500);
          this._toast.add({
            severity: "success",
            summary: "Service Message",
            detail: `Appointment has been created`,
          });
        },
        (err) => {
          this.loader = false;
        }
      );
    } else {
      this.loader = false;
      this._toast.add({
        severity: "warn",
        summary: "Fill Intake Form to book appointment",
      });
    }
  }
  onNoClick(type) {
    if (type == "cancel") {
      this.dialogRef.close({
        Type: "cancel",
      });
    }
  }
  //drop down
  getAllClient() {
    this._service.get(`${CLIENT}?list=true`).subscribe(
      (res) => {
        this.clients = res;
      },
      (err) => {}
    );
  }
  //drop down
  getAllStaff() {
    //;
    this._service.get(`${STAFF}?type=staff`).subscribe(
      (res) => {
        this.staffDetails = res;
        this.staff = res;
        var staffLoc: any = [];
        this.staff.forEach((rest) => {
          var myres = rest;
          var location: any = rest.location;
          var isAvailable = location.find((x) => x == this.location_id);
          if (isAvailable) {
            staffLoc.push(rest);
          }
        });
        this.staff = staffLoc;
        this.staff = this.staff.map((item) => {
          return {
            id: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            gender: item.gender,
          };
        });

        if (!this.selectedStaff)
          this.selectedStaff = localStorage.getItem("id");
        let objStaff;
        let selStaff = this.staff.filter((x) => x.id == this.selectedStaff);
        objStaff =
          !selStaff || selStaff.length == 0 ? this.staff[0] : selStaff[0];

        this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
          "staff"
        ].setValue({
          id: objStaff.id,
          firstName: objStaff.firstName,
          lastName: objStaff.lastName,
          gender: objStaff.gender,
        });
        this.staffName = objStaff && objStaff.firstName;
        // this.getSchedule();
      },
      (err) => {}
    );
  }
  //drop down
  getAllService() {
    this._service.get(`${SERVICE}/pricing_list`).subscribe(
      (res) => {
        this.serviceList = res.result;
        this.serviceData = res.result;
        this.lnt[0].data.next(this.copyServiceGroup(this.serviceData));
        let groupArr: any = [];
        groupArr = this.serviceList.filter((group) => {
          return group.services.some((service) => {
            return service._id == this.selectedService;
          });
        });

        if (this.selectedService)
          this.selectedService = groupArr[0].services.filter(
            (ser) => ser._id == this.selectedService
          );
        if (
          this.selectedService &&
          this.selectedService.constructor === Array
        ) {
          if (Array.isArray(this.selectedService))
            this.appointmentForm["controls"]["booking"]["controls"][0][
              "controls"
            ]["service"].setValue({
              id: this.selectedService[0]._id,
              name: this.selectedService[0].name,
              commissionEnabled: this.selectedService[0].commissionEnabled,
            });
        }

        if (
          this.data &&
          this.data.Header &&
          this.data.Header == "Edit Appointment" &&
          this.data.multipleAppList
        ) {
          const control: FormArray = this.appointmentForm.get(
            `booking`
          ) as FormArray;
          setTimeout(() => {
            let lastData;
            this.data.multipleAppList.forEach((ele, index) => {
              //saving last index data
              if (this.data.multipleAppList.length - 1 == index) {
                lastData = {
                  staff: ele.staff,
                  startTime: ele.endTime,
                  service: "",
                };
              }
              if (index != 0) {
                let data = {
                  staff: ele.staff,
                  startTime: ele.startTime,
                  endTime: ele.endTime,
                  service: ele.service,
                  requested_staff: ele.requested_staff,
                  searchService: "",
                };
                this.lnt.push({
                  data: new ReplaySubject<any>(1),
                });
                this.lnt[index].data.next(
                  this.copyServiceGroup(this.serviceData)
                );
                control.push(this.addBookingEdit(data));

                let selectedService = ele.service._id;
                let groupArr: any = [];
                groupArr = this.serviceList.filter((group) => {
                  return group.services.some((service) => {
                    return service._id == selectedService;
                  });
                });
                if (selectedService)
                  selectedService = groupArr[0].services.filter(
                    (ser) => ser._id == selectedService
                  );
                if (Array.isArray(selectedService))
                  this.appointmentForm["controls"]["booking"]["controls"][
                    index
                  ]["controls"]["service"].setValue(selectedService[0]);
              }
            });
            //adding extra empty service
            this.lnt.push({
              data: new ReplaySubject<any>(1),
            });
            this.lnt[this.data.multipleAppList.length].data.next(
              this.copyServiceGroup(this.serviceData)
            );
            control.push(this.addBookingEdit(lastData));
          }, 300);
        }
      },
      (err) => {}
    );
  }
  updateAppointment(id, value, form) {
    //for the multiple appointment hit `${APPOINTMENT}`
    //for the single appointment hit `${APPOINTMENT}/${id}`
    this.data.childrenNo;
    let url;
    let data;
    let values = [];
    values = value;
    if (value.length > 1) {
      url = `${APPOINTMENT}`;
      //adding booking reference and childenNo if Id is not there

      value.forEach((ele) => {
        if (!ele.Id) {
          ele.new = true;
          ele.childrenNo =
            this.data && this.data.childrenNo
              ? this.data.childrenNo
              : undefined;
          ele.booking_reference =
            this.data && this.data.booking_reference
              ? this.data.booking_reference
              : undefined;
          ele.status = this.data && this.data.status ? this.data.status : "";
        }
      });
      data = value;
    } else {
      url = `${APPOINTMENT}/${id}`;

      data = form;
    }
    this._service.put(url, data).subscribe(
      (res) => {
        this.loader = false;
        this.CalenderData.changeMessage(true);
        this.dialogRef.close({
          Type: "refresh",
          id: res.result[0].Id,
          children:
            this.data && this.data.childrenNo ? this.data.childrenNo : "",
          bookingRef:
            this.data && this.data.booking_reference
              ? this.data.booking_reference
              : "",
          location: res.result[0].location._id,
        });
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "Appointment updated",
        });
        this._id = undefined;
      },
      (err) => {
        this.loader = false;
      }
    );
  }
  deleteAppointement() {
    this._service.delete(`${APPOINTMENT}/${this._id}`).subscribe(
      (res) => {
        this.dialogRef.close({
          Type: "refresh",
          action: "delete",
        });
      },
      (err) => {}
    );
  }
  onStartTimeSelected(args: ChangeEventArgs, i) {
    this.customStaffScheduleForTimeValidator(i);
    this.minDate = new Date(args.value);
    // this.getSchedule();
  }
  onEndTimeSelected(e, i) {
    setTimeout(() => {
      this.customStaffScheduleForTimeValidator(i);
    }, 500);
    // this.getSchedule();
  }
  getClientDetails(client_id) {
    this._service.get(`${CLIENT_INFO}${client_id}`).subscribe(
      (res) => {
        this.clientDetails = res.clientInfo;
        this.appointment = res.appointment;
      },
      (err) => {}
    );
  }
  getClientInvoices(client_id) {
    this._service.get(`${INVOICE}/client/${client_id}`).subscribe(
      (res) => {
        this.clientInvoices = res.result;
      },
      (err) => {}
    );
  }
  clientOption(type) {
    if (type == "Remove From Appointment") {
      if (this.clientIntakeFormFilled) {
        this._toast.add({
          severity: "warn",
          summary: "Cannot remove Client once Intake form is filled",
        });
      } else {
        this.searchClientEmail = "";
        (this.searchClientPhone = ""), (this.searchClient = "");
        this.select_Client = "";
        this.walkIn = true;
        this.clientIntakeFormFilled = true;
      }
    } else if (type == "Edit Client Details") {
      const dialogRef = this.dialog.open(AddNewClient, {
        width: "100vw",
        height: "100vh",
        panelClass: "pad-Mnow321",
        data: {
          header: "Edit Client",
          data: this.clientData,
          intakeBtn: "Save",
        },
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  getClientInfo(id) {
    //
    this._service.get(`${CLIENT}/${id}`).subscribe((res) => {
      this.clientData = res[0];
      this.searchClient =
        this.clientData &&
        `${this.clientData.firstName} ${this.clientData.lastName}`;
      this.searchClientEmail = this.clientData && `${this.clientData.email}`;
      this.searchClientPhone = this.clientData && `${this.clientData.phone1}`;
    }),
      (err) => {
        console.log(err);
      };
  }
  createNewClient() {
    const dialogRef = this.dialog.open(AddNewClient, {
      width: "100vw",
      height: "100vh",
      panelClass: "pad-Mnow321",
      data: {
        header: "New Client",
        intakeBtn: "Next",
        type: "fromCalendar",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.data2.currentMessage.subscribe((message) => {
        this.message = message;
        this.intakeId = this.message.intakeFormId;
        if (this.message.clientId) {
          this.selectClient(message);
          this.clientIntakeFormFilled = true;
        }
      });
      this.data;
      this.getAllClient();
    });
  }
  dateChange(event) {
    this.selectedDay = event;
    this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
      "startTime"
    ].setValue(this.selectedDay);
    this.appointmentForm["controls"]["booking"]["controls"][0]["controls"][
      "endTime"
    ].setValue(this.selectedDay);
  }
  // getSchedule() {
  //   setTimeout(() => {
  //     var date = this.appointmentForm["controls"]["booking"]["controls"][0][
  //       "controls"
  //     ]["startTime"].value;
  //     var startTime = date;
  //     var endTime = this.appointmentForm["controls"]["booking"]["controls"][0][
  //       "controls"
  //     ]["endTime"].value;
  //     var timeStart = Number(moment(startTime).format("HHmm"));
  //     var timeEnd = Number(moment(endTime).format("HHmm"));

  //     var startTimeCheck = moment(startTime, "h:mm:ss a");
  //     var endTimeCheck = moment(endTime, "h:mm:ss a");
  //     if (moment(startTime).isAfter(endTime)) {
  //       //("Error. Start Time is more than End Time");
  //       this._toast.add({
  //         severity: "error",
  //         summary: "Appointment",
  //         detail: `Start Time should not more than End Time`
  //       });
  //       this.isDisabledButton = true;
  //     } else {
  //       this.isDisabledButton = false;
  //     }

  //     this._service
  //       .get(
  //         `${STAFF_SCH}${date} &id=${this.selectedStaff}&location_id=${this.location_id}`
  //       )
  //       .subscribe(
  //         res => {
  //           var result = res;
  //           if (result.length != 0) {
  //             result.forEach(ele => {
  //               var staff_timeStart = Number(
  //                 moment(ele.time_start).format("HHmm")
  //               );
  //               var staff_timeEnd = Number(moment(ele.time_end).format("HHmm"));
  //               this.between = undefined;
  //               if (timeStart >= staff_timeStart && timeStart < staff_timeEnd) {
  //                 if (timeEnd > staff_timeStart && timeEnd <= staff_timeEnd) {
  //                   this.isAvailable = false;
  //                   this.between = undefined;
  //                 } else {
  //                   this.isAvailable = true;
  //                   this.between = "between";
  //                   return;
  //                 }
  //               } else {
  //                 this.isAvailable = true;
  //                 this.between = undefined;
  //                 return;
  //               }
  //             });
  //           } else {
  //             this.isAvailable = false;
  //           }

  //           // if ()
  //         },
  //         err => { }
  //       );
  //   }, 0);
  // }

  changeInStaff(e, e2, i) {
    //;

    this.customStaffScheduleForTimeValidator(i);
    this.serviceCheck(i);
    if (e2) {
      let staffId = e2.staff.id;
      let serviceId = e2.service._id;
      // let serviceId = control.parent.value.service && control.parent.value.service.id ? control.parent.value.service.location.id : control.parent.value.service._id;
      let staff: any = this.staffDetails.filter((ele) => ele._id == staffId);
      let existService: [] = staff[0].service.filter((it) => it == serviceId);

      if (existService.length > 0) {
        //("yes");
        this.serviceError = false;
        // return of({ 'staffError': false })
      } else {
        this.serviceError = true;
        // return of({ 'staffError': false })
      }
    }

    // var objStaff = this.staff.filter(x => x._id == e);
    this.staffName = e.firstName;
    // this.getSchedule();
  }

  requestedStaff(index) {
    if (
      !this.appointmentForm["controls"]["booking"]["controls"][index][
        "controls"
      ]["requestedStaff"].value
    )
      this.appointmentForm["controls"]["booking"]["controls"][index][
        "controls"
      ]["requestedStaff"].setValue(true);
    else
      this.appointmentForm["controls"]["booking"]["controls"][index][
        "controls"
      ]["requestedStaff"].setValue(false);
  }
  getIntakeByIntakeId() {
    this.intakeForm(this.intakeId || this.data.intakeId);
  }
  getIntakeByClientId() {
    this.intakeForm(this.clientData._id);
  }
  intakeForm(intakedata): void {
    if (this.intakeId || this.data.intakeId) {
      const dialogRef = this.dialog.open(ClientIntakeForm, {
        width: "100vw",
        height: "100vh",
        panelClass: "pad-Mnow321",
        autoFocus: false,
        data: {
          type: "viewIntake",
          intakedata: intakedata,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.type) {
          if (result.type == "close") {
          }
        }
      });
    } else {
      const dialogRef = this.dialog.open(ClientIntakeForm, {
        width: "100vw",
        height: "100vh",
        panelClass: "pad-Mnow321",
        autoFocus: false,
        data: {
          type: "appointment",
          intakedata: intakedata,
          secBtn: false,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.type) {
          if (result.type == "close") {
            this.clientIntakeFormFilled = true;
            this.intakeId = result.intakeId;
          }
        }
      });
    }
  }

  newDurationCalculate(startTime, endTime) {
    //
    var stme = moment(startTime);
    var enme = moment(endTime);
    var duration = moment.duration(enme.diff(stme));
    var remain_hour = duration.hours();
    var remain_min = duration.minutes();
    let x = {};
    x["hour"] = remain_hour;
    x["min"] = remain_min;

    return x;
  }

  durationCalculate(startTime, endTime) {
    var stme = moment(startTime);
    var enme = moment(endTime);
    var duration = moment.duration(enme.diff(stme));
    var remain_hour = duration.hours();
    var remain_min = duration.minutes();
    return `${remain_hour != 0 ? remain_hour + "h" : ""} ${
      remain_min != 0 ? remain_min + "min" : ""
    }`;
  }
  changeEndTime(data, i) {
    this.customStaffScheduleForTimeValidator(i);
    this.serviceCheck(i);

    this.showMathint = true;

    if (data) {
      let staffId = data.staff.id;
      let serviceId = data.service._id;
      // let serviceId = control.parent.value.service && control.parent.value.service.id ? control.parent.value.service.location.id : control.parent.value.service._id;
      let staff: any = this.staffDetails.filter((ele) => ele._id == staffId);
      let existService: [] = staff[0].service.filter((it) => it == serviceId);

      if (existService.length > 0) {
        //("yes");
        this.serviceError = false;
        // this.isDisabledButton = false;

        // return of({ 'staffError': false })
      } else {
        this.serviceError = true;
        // this.isDisabledButton = true;
        // return of({ 'staffError': false })
      }
    }

    let endTime = data.service.duration.split(" ");
    let eT = endTime.some((time) => {
      return time.includes("h");
    });
    if (!eT) endTime = ["0h", endTime[0]];
    if (endTime.length == 1) {
      endTime = parseInt(endTime[0]);
      data.endTime = moment(data.startTime).add(endTime, "h");
    } else {
      endTime = [parseInt(endTime[0]), parseInt(endTime[1])];
      data.endTime = moment(data.startTime)
        .add(endTime[0], "h")
        .add(endTime[1], "m");
    }
    data.endTime = moment(data.endTime).toDate();
    this.appointmentForm["controls"]["booking"]["controls"][i]["controls"][
      "endTime"
    ].setValue(data.endTime);
    if (
      this.appointmentForm["controls"]["booking"]["controls"].length ==
      i + 1
    ) {
      this.lnt.push({
        data: new ReplaySubject<any>(1),
      });
      this.lnt[i + 1].data.next(this.copyServiceGroup(this.serviceData));
      this.addBooking(data);
    } else {
      var listServie = this.appointmentForm["controls"]["booking"]["controls"]
        .length;
      var i;
      for (i; i < listServie - 1; i++) {
        var servicePlus = this.appointmentForm["controls"]["booking"][
          "controls"
        ][i + 1].value;
        if (servicePlus && servicePlus.service == "") {
          var endtimeup = this.appointmentForm["controls"]["booking"][
            "controls"
          ][i]["controls"]["endTime"].value;
          this.appointmentForm["controls"]["booking"]["controls"][i + 1][
            "controls"
          ]["startTime"].setValue(endtimeup);
        } else {
          var endtimeups = this.appointmentForm["controls"]["booking"][
            "controls"
          ][i]["controls"]["endTime"].value;
          this.appointmentForm["controls"]["booking"]["controls"][i + 1][
            "controls"
          ]["startTime"].setValue(endtimeups);
          var starttimeups = this.appointmentForm["controls"]["booking"][
            "controls"
          ][i]["controls"]["endTime"].value;
          var startTimeMody;
          let endTime = servicePlus.service.duration.split(" ");
          let eT = endTime.some((time) => {
            return time.includes("h");
          });
          if (!eT) endTime = ["0h", endTime[0]];
          if (endTime.length == 1) {
            endTime = parseInt(endTime[0]);
            startTimeMody = moment(starttimeups).add(endTime, "h");
          } else {
            endTime = [parseInt(endTime[0]), parseInt(endTime[1])];
            startTimeMody = moment(starttimeups)
              .add(endTime[0], "h")
              .add(endTime[1], "m");
          }
          startTimeMody = moment(startTimeMody).toDate();
          this.appointmentForm["controls"]["booking"]["controls"][i + 1][
            "controls"
          ]["endTime"].setValue(startTimeMody);
        }
      }
    }
  }
  closeView() {
    this.clientList = false;
  }
  client_list_view(value) {
    // true
    this.clientList = value.blur;
  }
  getControls() {
    return (<FormArray>this.appointmentForm.controls["booking"]).controls;
  }
  compareObjectsService(obj1: any, obj2: any) {
    return obj1 && obj2
      ? obj1.id == obj2._id &&
          obj1.name == obj2.name &&
          obj1.commissionEnabled == obj2.commissionEnabled
      : obj1 === obj2;
  }

  compareObjectsStaff(obj1: any, obj2: any) {
    return obj1 && obj2
      ? obj1.id == obj2.id &&
          obj1.firstName == obj2.firstName &&
          obj1.lastName == obj1.lastName
      : obj1 === obj2;
  }

  // vaidationMessage(control: AbstractControl) {
  //   //

  //   //(control);
  // }

  validationMessage(control: AbstractControl) {
    //("staff value::", control.value);

    let staffId = control.value.id;
    let serviceId =
      control.parent.value.service && control.parent.value.service.id
        ? control.parent.value.service.location.id
        : control.parent.value.service._id;
    let staff: any = this.staffDetails.filter((ele) => ele._id == staffId);
    let existService: [] = staff[0].service.filter((it) => it == serviceId);

    if (existService.length > 0) {
      //("yes");
      this.serviceError = false;
      // return of({ 'staffError': false })
    } else {
      this.serviceError = true;
      // return of({ 'staffError': false })
    }

    // existService.length > 0 ?{return of(null)} : return of({'staffError' : true})
    // return of(null)
  }

  serviceValidation(data, i) {
    //;
    this.customStaffScheduleForTimeValidator(i);
    // if (data && data.service._id && this.staffDetails._id) {
    //   let staffId = data.staff.id;
    //   let serviceId = data.service._id;
    //   let staffName = data.staff.firstName;

    //   // let serviceId = control.parent.value.service && control.parent.value.service.id ? control.parent.value.service.location.id : control.parent.value.service._id;
    //   let staff: any = this.staffDetails.filter(ele => ele._id == staffId);
    //   let existService: [] = staff[0].service.filter(it => it == serviceId);

    //   if (existService.length > 0) {
    //     // //("yes");
    //     let validationMessage = '';
    //     return validationMessage;
    //     this.serviceError = false;
    //     // return of({ 'staffError': false })
    //   }
    //   else {
    //     let validationMessage = staffName + ' ' + 'doesnot provide the service.';
    //     return validationMessage;
    //     this.serviceError = true;
    //     // return of({ 'staffError': false })
    //   }
    // } else
    //   return ""
  }

  serviceCheck(i) {
    let staff: any = {};
    let service: any = {};

    staff = this.appointmentForm["controls"]["booking"]["controls"][i][
      "controls"
    ]["staff"].value;
    service = this.appointmentForm["controls"]["booking"]["controls"][i][
      "controls"
    ]["service"].value;

    setTimeout(() => {
      if (service && service._id && this.staffDetails.length > 0) {
        let staffId = staff.id;
        let serviceId = service._id;
        let staffName = staff.firstName;

        // let serviceId = control.parent.value.service && control.parent.value.service.id ? control.parent.value.service.location.id : control.parent.value.service._id;
        let staffFilter: any = this.staffDetails.filter(
          (ele) => ele._id == staffId
        );
        let existService: [] = staffFilter[0].service.filter(
          (it) => it == serviceId
        );

        if (existService.length > 0) {
          this.isWorkingService[i] = ``;
          this.anyErrorPresent = false;
          // return of({ 'staffError': false })
        } else {
          this.isWorkingService[
            i
          ] = `This staff doesn't provide this service                                                                                              `;
          this.anyErrorPresent = true;
          // this._toast.add({ severity: "error", summary: "Appointment", detail: `Staff doesnot provide this service` });
          // return of({ 'staffError': true })
        }
      } else return ``;
    }, 50);
  }

  customStaffScheduleForTimeValidator(i) {
    setTimeout(() => {
      let staff: any = {};
      let timeRange: any = {};
      let service: any = {};

      timeRange.startTime = this.appointmentForm["controls"]["booking"][
        "controls"
      ][i]["controls"]["startTime"].value;
      timeRange.endTime = this.appointmentForm["controls"]["booking"][
        "controls"
      ][i]["controls"]["endTime"].value;
      staff = this.appointmentForm["controls"]["booking"]["controls"][i][
        "controls"
      ]["staff"].value;
      service = this.appointmentForm["controls"]["booking"]["controls"][i][
        "controls"
      ]["service"].value;

      // //("staff", staff);
      // //("timeRange", timeRange);
      // //("services", service)
      // xxxxxxx  API call for checking staff is working for that particular period  xxxxxxxxx
      setTimeout(() => {
        let timeStart: any = moment(timeRange.startTime).format("HH:mm");
        // let timeStart: any = timeRange.startTime.toTimeString().split(':')
        // timeStart = timeStart[0] + ':' + timeStart[1]
        // let timeEnd: any = timeRange.endTime.toTimeString().split(':')
        // timeEnd = timeEnd[0] + ':' + timeEnd[1]
        let timeEnd: any = moment(timeRange.endTime).format("HH:mm");
        timeStart = moment(timeStart, "HH:mm:ss");
        timeEnd = moment(timeEnd, "HH:mm:ss");
        if (moment(timeRange.startTime).isAfter(timeRange.endTime)) {
          this._toast.add({
            severity: "error",
            summary: "Appointment",
            detail: `Start Time should not more than End Time`,
          });
        }
        if (
          timeRange &&
          timeRange.startTime &&
          staff.id &&
          !!this.location_id
        ) {
          let param = new HttpParams()
            .set("date", timeRange.startTime)
            .set("id", staff.id)
            .set("location_id", this.location_id);
          this._service.get("schedule", param).subscribe(
            (res) => {
              // //("response from api", res);
              if (res.length > 0) {
                let isWorking: boolean;
                isWorking = res.some((ele) => {
                  let time_start: any = moment(ele["time_start"]).format(
                    "HH:mm"
                  );
                  let time_end: any = moment(ele["time_end"]).format("HH:mm");
                  time_start = moment(time_start, "HH:mm:ss");
                  time_end = moment(time_end, "HH:mm:ss");
                  //
                  //('app start', moment(timeRange.startTime).format("hh:mm"))
                  //('app end', moment(timeRange.endTime).format("hh:mm"))
                  //('sch start', moment(ele['time_start']).format("hh:mm"))
                  //('sch end', moment(ele['time_end']).format("hh:mm"))
                  if (
                    moment(timeStart).isBetween(
                      time_start,
                      time_end,
                      null,
                      "[]"
                    ) &&
                    moment(timeEnd).isBetween(time_start, time_end, null, "[]")
                  ) {
                    return true;
                  }
                });
                //
                if (!isWorking) {
                  this.isStaffWorkingValidationMsg[
                    i
                  ] = `This staff isn't working at ${moment(
                    timeRange.startTime
                  ).format("hh:mm A")}, but you can still book them `;
                }
                if (isWorking) {
                  this.isStaffWorkingValidationMsg[i] = ``;
                }
              } else {
                this.isStaffWorkingValidationMsg[
                  i
                ] = `This staff isn't working at ${moment(
                  timeRange.startTime
                ).format("hh:mm A")}, but you can still book them`;
              }
            },
            (err) => {}
          );
        }
      }, 0);
    }, 1000);

    // xxxxxxx xxxxxxx xxxxxxx xxxxxxx xxxxxxx xxxxxxxx  xxxxxxx  xxxxxxx  xxxxxxxx  xxxxxxx
  }

  submitButtonValidation(data) {
    //
  }
}
