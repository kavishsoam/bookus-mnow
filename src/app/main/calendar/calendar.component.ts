import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import * as moment from "moment";
import { FuseConfigService } from "@fuse/services/config.service";
import {
  ScheduleComponent,
  GroupModel,
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  DragAndDropService,
  ResizeService,
  ResourceDetails,
  EventRenderedArgs,
  PopupOpenEventArgs,
  WorkHoursModel,
} from "@syncfusion/ej2-angular-schedule";
import { MessageService } from "primeng/api";
import {
  APPOINTMENT,
  SERVICE,
  GET_STAFF_DROP,
  LOC_LIS,
  STAFF_LIST_LOC,
  GET_APP,
} from "../../services/url";
import { ViewAppointmentComponent } from "./view-appointment/view-appointment.component";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { NgxSpinnerService } from "ngx-spinner";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { browserRefresh } from "../../app.component";
import { DataSharing } from "app/services/message-service";
import { CalenderDataService } from "./calenderData.service";
import { BlockedtimeComponent } from "./blockedtime/blockedtime.component";
import { newappointment } from "./new-appointment/new-appointment.component";
import { ApiService } from "app/services/api.service";
import { fuseAnimations } from "@fuse/animations";
import { getCurrencySymbol } from "@angular/common";
import { CashDrawerComponent } from "./cash-drawer/cash-drawer.component";
import { RequestedItemsComponent } from "./requested-items/requested-items.component";
import {CalendarSettingModalComponent} from './calendar-setting-modal/calendar-setting-modal.component'

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations,
  providers: [
    DayService,
    ResizeService,
    DragAndDropService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
  ],
})
export class CalendarComponent implements OnInit {
  public browserRefresh: boolean;
  public startHour: string;
  public endHour: string;
  public workHours: WorkHoursModel = {
    highlight: true,
    start: "11:00",
    end: "20:00",
  };
  public datas: string[] = ["Day", "Week", "WorkWeek", "Month"];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  subscription: Subscription;
  dropDownValue: any = "";
  location_id: any;
  locationList: any;
  isStaffVisible: boolean;
  pageHeader: Object = { header: "Calendar", navigate: false };
  clientAppointment: boolean;
  clientId: string;
  public checkoutColor: string = "#dee3e7";
  public blockColor: string = "#a4adba";
  calendarSettings: any;
  calendar: boolean;
  workingStaffCheck: boolean = true;
  locationDropdown: any;
  calendarStaffDropdown: string;
  defaultView: string;
  selectedDateLocal: string;
  blockedTime: boolean = false;
  workingNil: boolean = false;
  newDate: string;
  noLocationView: boolean = false;
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  currencySymbol: any;
  setPageHeader(): void {
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }
  public allowDragAndDrop: boolean = true;
  @ViewChild("scheduleObj")
  scheduleObj: ScheduleComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef,
    private _fuseConfigService: FuseConfigService,
    public dialog: MatDialog,
    private _service: ApiService,
    private _toast: MessageService,
    private changeRef: ChangeDetectorRef,
    private dataSharing: DataSharing,
    private CalenderData: CalenderDataService
  ) {
    this.subscription = this._fuseConfigService
      .getClientSubject()
      .subscribe((clientId) => {
        if (clientId) {
          this.clientAppointment = true;
          this.clientId = clientId;
        }
      });
    this.subscription = this.dataSharing.getMessage().subscribe((res) => {
      if (res) {
        if (res.value.rebook) {
          this.rebook = true;
          this.patchData = res.value.apt;
        }
      }
    });
  }
  public template: string =
    '<div class="appointment-wrapper">' +
    '<div style="display: flex; flex-flow: row wrap;">' +
    '<div class="timing">${startTimeTT} - ${endTimeTT}</div>' +
    '<div class="client">${client_Name}</div></div>' +
    '<div class="subject">${Subject}</div>' +
    '<div class="drag"><img src="../../../assets/icons/drag-handle.png"></div>' +
    "</div>";
  public temp: string =
    '${if(type==undefined)}<div class="tooltip-wrap">' +
    ' <div class="image"></div>' +
    '<div class="content-area"> <div class="name" style="margin: 2px 0">${client_Name}</><span style="color: ${statusColor}" class="status"> ${status}</span></div>' +
    '<div class="tool-pad"></div>' +
    '<div class="draw-line"></div>' +
    '<div class="tool-pad-bottom"></div>' +
    '<div class="font-stru" style="margin: 1px 0"><span class="service">${Subject}</span></div>' +
    '<div class="font-stru" style="margin: 1px 0">${startTimeTT} - ${endTimeTT}</div>' +
    '<div class="font-stru" style="margin: 1px 0">${durationCal} with ${staff_first}&nbsp;${staff_last}</></div>' +
    "<div></div>" +
    '<div class="font-stru-amount float-right" style="margin: 1px 0">${currencySymbol}${amount}</div>' +
    ' ${if (notes !== undefined)} <div class="font-stru">${notes}</div> ${/if} </div> ${/if}' +
    "</div>" +
    '${if (type!=undefined)}<div class="block"><div class="tooltip-wrap">' +
    "<div>${blockStartTime} - ${blockEndTime}</div> ${/if}</div></div>";
  resource: Object[] = [{}]; //which hold all the the appointment
  collection: any = [{}]; // which hold the all staff and identification ID
  public resourceDataSource: Object[] = [this.collection[0]];
  public group: GroupModel = { resources: ["Owners"] };
  public allowMultiple: Boolean = true;
  public selectedDate: any = new Date();
  public eventSettings: EventSettingsModel;
  public viewSet: any;
  allServiceList: any = [];
  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      if (localStorage.getItem("defaultView") != null) {
        this.viewSet = localStorage.getItem("defaultView");
      }
      if (localStorage.getItem("selectedDateLocal") != null) {
        var tempDate = localStorage.getItem("selectedDateLocal");
        this.selectedDate = moment(tempDate).format("YYYY-MM-DD");
      }
    }
    this.calendar = false;
    this.spinner.show();
    this.calendarSettings = localStorage.getItem("calendarSettings");
    if (this.calendarSettings != "undefined") {
      this.calendarSettings = JSON.parse(this.calendarSettings);
      if (this.calendarSettings.startHour)
        this.startHour = moment(this.calendarSettings.startHour).format(
          "HH:mm"
        );
      if (this.calendarSettings.endHour)
        this.endHour = moment(this.calendarSettings.endHour).format("HH:mm");
      this.viewSet = this.calendarSettings.default_view;
    }
    this.setPageHeader();
    this.getAllService();
    this.CalenderData.currentMessage.subscribe((bool) => {
      if (bool) {
        this.plotSchedule({ value: this.dropDownValue });
      }
    });
    this.getCurrencySymbol();
  }

  getCurrencySymbol() {
    let cur = localStorage.getItem("currency");
    var currency_symbols = {
      USD: "$", // US Dollar
      EUR: "€", // Euro
      CRC: "₡", // Costa Rican Colón
      GBP: "£", // British Pound Sterling
      ILS: "₪", // Israeli New Sheqel
      INR: "₹", // Indian Rupee
      JPY: "¥", // Japanese Yen
      KRW: "₩", // South Korean Won
      NGN: "₦", // Nigerian Naira
      PHP: "₱", // Philippine Peso
      PLN: "zł", // Polish Zloty
      PYG: "₲", // Paraguayan Guarani
      THB: "฿", // Thai Baht
      UAH: "₴", // Ukrainian Hryvnia
      VND: "₫", // Vietnamese Dong
      AUD: "$",
    };

    var currency_name = "INR";

    if (currency_symbols[cur] !== undefined) {
      this.currencySymbol = currency_symbols[cur];
      // alert(currency_symbols[cur]);
    }
  }

  getEmployeeName(value: ResourceDetails): string {
    return (
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      ((value as ResourceDetails).resourceData[
        (value as ResourceDetails) &&
          (value as ResourceDetails).resource &&
          (value as ResourceDetails).resource.textField
      ] as string)
    );
  }

  getEmployeeDesignation(value: ResourceDetails): string {
    return (
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      (value as ResourceDetails).resourceData.Designation &&
      ((value as ResourceDetails).resourceData.Designation as string)
    );
  }

  getEmployeeImage(value: ResourceDetails): string {
    let resourceName: string =
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      ((value as ResourceDetails).resourceData[
        (value as ResourceDetails) &&
          (value as ResourceDetails).resource &&
          (value as ResourceDetails).resource["textField"]
      ] as string);
    return (
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      (value as ResourceDetails).resourceData.image &&
      ((value as ResourceDetails).resourceData.image as string)
    );
  }

  getEmployeeGender(value: ResourceDetails): string {
    let resourceName: string =
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      ((value as ResourceDetails).resourceData[
        (value as ResourceDetails) &&
          (value as ResourceDetails).resource &&
          (value as ResourceDetails).resource.textField
      ] as string);
    return (
      (value as ResourceDetails) &&
      (value as ResourceDetails).resourceData &&
      (value as ResourceDetails).resourceData.gender &&
      ((value as ResourceDetails).resourceData.gender as string)
    );
  }

  openBlockedTime() {
    this.blockedTime = true;
  }
  plotSchedule(e) {
    this.workingNil = false;
    //to clear the calender (** to remove fluctuation)
    this.resource = [];
    this.eventSettings = {
      dataSource: this.resource,
      enableTooltip: true,
      tooltipTemplate: this.temp,
    };
    if (!this.browserRefresh) {
      localStorage.setItem("selectedDateLocal", this.selectedDate);
      localStorage.setItem("defaultView", this.viewSet);
      localStorage.setItem("location_id", this.location_id);
      localStorage.setItem("dropDownValue", this.dropDownValue);
    }
    this.workingStaffCheck = true;
    let scrollTo = moment().format("HH:mm");
    if (e.value == "") {
      this.getAppointmentX().subscribe(
        (res) => {
          localStorage.setItem("defaultView", "Day");
          this.scheduleObj.changeView("Day");
          this.collection.forEach((obj: { [key: string]: Object }) => {
            let value = obj.unid;
            this.scheduleObj.removeResource(String(value), "Owners");
          });
          this.resource = [];
          let resourceData: Object[] = this.collection.filter(
            (calendar: { [key: string]: Object }) => calendar.unid != undefined
          );
          for (var i = 0; i < resourceData.length; i++) {
            this.scheduleObj.addResource(resourceData[i], "Owners", i);
            this.scheduleObj.views["Day"];
          }
          return;
        },
        (err) => {}
      );
    } else if (e.value == "working") {
      this.workingNil = false;
      this.getAppointmentX(null, "Day").subscribe(
        (res) => {
          localStorage.setItem("defaultView", "Day");
          if (res.staffId && res.staffId.length == 0) {
            this.workingStaffCheck = false;
            this.workingNil = true;
            let date = localStorage.getItem("selectedDateLocal");
            return;
          }
          if (res.staffId && res.staffId.length > 0) {
            res.staffId.forEach((element) => {
              if (element == undefined) {
                this.workingStaffCheck = false;
                this.workingNil = true;
                let date = localStorage.getItem("selectedDateLocal");
                this.newDate = date;
                return;
              }
            });
          }
          this.scheduleObj.changeView("Day");
          this.collection.forEach((obj: { [key: string]: Object }) => {
            let value = obj.unid;
            this.scheduleObj.removeResource(String(value), "Owners");
          });
          let resourceData: any = [];
          res.staffId.forEach((ele) => {
            let fndStaff = this.collection.find(
              (calendar: { [key: string]: Object }) => calendar.unid == ele
            );
            if (fndStaff != undefined) {
              resourceData.push(fndStaff);
            }
          });
          for (var i = 0; i < resourceData.length; i++) {
            this.scheduleObj.addResource(resourceData[i], "Owners", i);
            this.scheduleObj.views["Day"];
          }
          return;
        },
        (err) => {}
      );
    } else {
      this.getAppointmentX().subscribe(
        (res) => {
          if (
            res.completed &&
            res.completed == true &&
            res.staffId == undefined
          ) {
            this.resource = [];
            let index = undefined;
            this.collection.forEach((item, ind) => {
              if (this.dropDownValue == item.unid) {
                index = ind;
              }
            });
            if (index != undefined) {
              this.resourceDataSource = [this.collection[index]];
            }
            this.eventSettings = {
              dataSource: this.resource,
              enableTooltip: true,
              tooltipTemplate: this.temp,
            };
            this.changeRef.detectChanges();
            this.calendar = true;
            this.viewSet = localStorage.getItem("defaultView");
            this.scheduleObj.views[this.viewSet];
            return;
          }
          let value = String(e.value);
          let resourceData: Object[] = this.collection.filter(
            (calendar: { [key: string]: Object }) => calendar.unid == value
          );
          this.collection.forEach((obj: { [key: string]: Object }) => {
            let value = obj.unid;
            this.scheduleObj.removeResource(String(value), "Owners");
          });
          this.scheduleObj.addResource(resourceData[0], "Owners", 0);
        },
        (err) => {
          this.collection.forEach((obj: { [key: string]: Object }) => {
            let value = obj.unid;
            this.scheduleObj.removeResource(String(value), "Owners");
          });
        }
      );
    }
  }
  oneventRendered(args: EventRenderedArgs): void {
    let workingDuration = this.workingDuration(args.data.staff);
    let startTimeT = moment(args.data.StartTime).format("HH:mm");
    let endTimeT = moment(args.data.EndTime).format("HH:mm");
    if (
      moment({
        hour: Number(startTimeT.split(":")[0]),
        minute: Number(startTimeT.split(":")[1]),
      }).isBetween(
        {
          hour: Number(workingDuration[0].startHour.split(":")[0]),
          minute: Number(workingDuration[0].startHour.split(":")[1]),
        },
        {
          hour: Number(workingDuration[0].endHour.split(":")[0]),
          minute: Number(workingDuration[0].endHour.split(":")[1]),
        }
      ) &&
      moment({
        hour: Number(endTimeT.split(":")[0]),
        minute: Number(endTimeT.split(":")[1]),
      }).isBetween(
        {
          hour: Number(workingDuration[0].startHour.split(":")[0]),
          minute: Number(workingDuration[0].startHour.split(":")[1]),
        },
        {
          hour: Number(workingDuration[0].endHour.split(":")[0]),
          minute: Number(workingDuration[0].endHour.split(":")[1]),
        }
      )
    ) {
      let categoryColor: string;
      categoryColor = args.data.CategoryColor as string;
      args.data.checkout ? (categoryColor = this.checkoutColor) : "";
      args.data.type == "blocked" ? (categoryColor = this.blockColor) : "";
      args.data.status == "NEW"
        ? (args.element.style.backgroundColor = "lightblue")
        : "";
      args.data.status == "CONFIRMED"
        ? (args.element.style.backgroundColor = "lightgreen")
        : "";
      args.data.status == "ARRIVED"
        ? (args.element.style.backgroundColor = "#52C11E")
        : "";
      args.data.status == "STARTED"
        ? (args.element.style.backgroundColor = "pink")
        : "";
      args.data.status == "NO SHOW"
        ? (args.element.style.backgroundColor = "red")
        : "";
      args.data.status == "CANCELLED"
        ? (args.element.style.backgroundColor = "orange")
        : "";
      // args.data.status == 'CONFIRMD' ? args.element.style.backgroundColor = 'violet' : '';
      // args.data.status == '' ? args.element.style.backgroundColor = 'violet' : '';

      if (!args.element || !categoryColor) {
        return;
      }
      if (this.scheduleObj.currentView === "Agenda") {
        (args.element
          .firstChild as HTMLElement).style.borderLeftColor = categoryColor;
      } else {
        args.element.style.backgroundColor = categoryColor;
      }
    } else {
      let categoryColor: string;
      args.element.style.backgroundColor = "lightblue";
      // ! Production
      args.data.type == "blocked" ? (categoryColor = this.blockColor) : "";
      args.data.status == "NEW"
        ? (args.element.style.backgroundColor = "lightblue")
        : "";
      args.data.status == "CONFIRMED"
        ? (args.element.style.backgroundColor = "lightgreen")
        : "";
      args.data.status == "ARRIVED"
        ? (args.element.style.backgroundColor = "#52C11E")
        : "";
      args.data.status == "STARTED"
        ? (args.element.style.backgroundColor = "pink")
        : "";
      args.data.status == "NO SHOW"
        ? (args.element.style.backgroundColor = "red")
        : "";
      args.data.status == "CANCELLED"
        ? (args.element.style.backgroundColor = "orange")
        : "";
      // !Production
      categoryColor = args.data.CategoryColor as string;
      args.data.checkout ? (categoryColor = this.checkoutColor) : "";
      args.data.type == "blocked" ? (categoryColor = this.blockColor) : "";
      if (!args.element || !categoryColor) {
        return;
      }
      if (this.scheduleObj.currentView === "Agenda") {
        (args.element
          .firstChild as HTMLElement).style.borderLeftColor = categoryColor;
      } else {
        args.element.style.backgroundColor = categoryColor;
      }
    }
  }

  onActionBegin(e) {
    if (
      e.requestType == "viewNavigate" &&
      (this.dropDownValue == "" || this.dropDownValue == "working")
    ) {
      e.cancel = true;
    }
    if (e.requestType == "eventChange") {
      let data = e.data;
      let update = {
        startTime: data.StartTime,
        endTime: data.EndTime,
        staff: {
          id: data.staff,
          firstName: data.staff_first,
          lastName: data.staff_last,
        },
        day: data.StartTime,
      };
      this.dragEventAppointment(data.Id, update, "single-drag");
    }
  }
  onActionComplete(e: { [key: string]: Object }) {}
  onActionFailure(e) {}
  afterDataBound(e: any) {
    let current_time = moment().format("HH:mm");
    let current_time1 = moment().subtract(2400, "seconds").format("HH:mm");
    setTimeout(() => {
      if (!this.workingNil) this.scheduleObj.scrollTo(current_time1);
    }, 0);
  }

  rebookAppointment(data) {
    let booking_Ref = data.booking_reference;
    delete data.booking_reference;
    delete data.Id;
    delete data.status;
    delete data.checkout;
    delete data.status_color;
    if (this.rebook) {
      this.rebook = false;
      let multipleAppointment;
      if (booking_Ref) {
        let urlGenerator = `${APPOINTMENT}/search?booking_reference=${booking_Ref}&location_id=${data.location_id}`;
        this._service.get(`${urlGenerator}`).subscribe(
          (res) => {
            multipleAppointment = res;
            let tempEndTime;
            multipleAppointment.forEach((ele, index) => {
              if (index == 0) {
                ele.duration = this.durationCalculate(
                  ele.startTime,
                  ele.endTime
                );
                ele.startTime = data.startTime;
                ele.day = ele.startTime;
                ele.endTime = this.changeEndTime({
                  duration: ele.duration,
                  startTime: ele.startTime,
                  endTime: ele.endTime,
                });
                tempEndTime = ele.endTime;
              } else {
                ele.duration = this.durationCalculate(
                  ele.startTime,
                  ele.endTime
                );
                ele.startTime = tempEndTime;
                ele.day = ele.startTime;
                ele.endTime = this.changeEndTime({
                  duration: ele.duration,
                  startTime: ele.startTime,
                  endTime: ele.endTime,
                });
                tempEndTime = ele.endTime;
              }
              delete ele.booking_reference;
              delete ele._id;
              delete ele.status;
              delete ele.checkout;
              delete ele.status_color;
              ele.staff = this.patchData.staff;
            });
            data = multipleAppointment;
            this._service.post(`${APPOINTMENT}`, data).subscribe((res) => {
              this._toast.add({
                severity: "success",
                summary: "Service Message",
                detail: `Appointment has been rebooked`,
              });
              this.getAppointmentX().subscribe();
            });
          },
          (err) => {}
        );
      } else {
        data = [data];
        this._service.post(`${APPOINTMENT}`, data).subscribe((res) => {
          this._toast.add({
            severity: "success",
            summary: "Service Message",
            detail: `Appointment has been rebooked`,
          });
          this.getAppointmentX().subscribe();
        });
      }
    }
  }
  changeEndTime(data) {
    let endTime = data.duration.split(" ");
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
    return (data.endTime = moment(data.endTime).toDate());
  }
  onDataBinding(e) {}
  onCellClick(e) {
    let index = 0;
    if (
      (this.dropDownValue == "" || this.dropDownValue == "working") &&
      this.viewSet == "Day"
    ) {
      index = e.element.cellIndex;
    } else if (
      (this.dropDownValue == "" || this.dropDownValue == "working") &&
      this.viewSet == "Week"
    ) {
      this.viewSet = "Day";
      index = e.element.cellIndex;
      index = index / 7;
    }
    // let { unid, firstName, lastName } = this.scheduleObj.resources[0]['properties'].dataSource[index]
    // let {unid , firstName, lastName } = this.scheduleObj.activeView.colLevels[0];
    let {
      unid,
      firstName,
      lastName,
    } = this.scheduleObj.resourceCollection[0].dataSource[index];
    if (this.reschedule || this.rebook) {
      let startTime = moment(this.patchData.startTime);
      let endTime = moment(this.patchData.endTime);
      this.patchData.startTime = moment(e.startTime);
      let duration = moment.duration(endTime.diff(startTime));
      this.patchData.endTime = moment(this.patchData.startTime).add(
        duration["_milliseconds"],
        "milliseconds"
      );
      this.patchData.startTime = moment(this.patchData.startTime).toDate();
      this.patchData.endTime = moment(this.patchData.endTime).toDate();
      this.patchData.day = this.patchData.startTime;
      this.patchData.staff = {
        id: unid,
        firstName: firstName,
        lastName: lastName,
      };
      if (this.patchData.location_id) {
        this.patchData.location = this.patchData.location_id;
      }
      if (this.patchData.location) {
        this.patchData.location_id = this.patchData.location;
      }
      this.reschedule
        ? this.dragEventAppointment(this.patchData.Id, this.patchData)
        : this.rebookAppointment(this.patchData);
    } else if (this.blockedTime) {
      const dialogRef = this.dialog.open(BlockedtimeComponent, {
        width: "35vw",
        height: "80vh",
        panelClass: "pad-Mnow321",
        data: {
          header: "New Blocked Time",
          staff: { id: unid, firstName: firstName, lastName: lastName },
          selectedStaff: this.dropDownValue || unid,
          startTime: e.startTime,
          endTime: e.endTime,
          location: this.location_id,
        },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.reschedule = false;
        this.rebook = false;
        this.clientAppointment = false;
        this.blockedTime = false;
        if (result != undefined && result.Type == "refresh") {
          this.plotSchedule({ value: this.dropDownValue });
        }
      });
    } else {
      let data = {};
      data["StartTime"] = e.startTime;
      data["EndTime"] = e.endTime;
      data["staff"] = [unid];
      let Scheduledata = Object.assign(data);
      let personId = Scheduledata.personID;
      let StartDate = new Date(Scheduledata.StartTime);
      let EndDate = new Date(Scheduledata.EndTime);
      let StartTime = StartDate.toLocaleTimeString();
      let EndTime = EndDate.toLocaleTimeString();
      let newData = {
        Header: "New Appointment",
        Id: Math.floor(Math.random() * 2000),
        Subject: "New Appointment",
        StartDate: StartDate,
        EndDate: EndDate,
        StartTime: StartTime,
        EndTime: EndTime,
        personID: personId,
        CategoryColor: Scheduledata.CategoryColor,
        cellData: data,
        location_id: this.location_id,
      };
      this.openDialog(newData);
    }
  }
  onCellDoubleClick(e) {}
  onDestroyed() {
    //called when you changed the page from 'calender component' to another.
  }
  onNavigating() {
    this.resource = [];
    this.eventSettings = {
      dataSource: this.resource,
      enableTooltip: true,
      tooltipTemplate: this.temp,
    };
    setTimeout(() => {
      if (this.dropDownValue == "" && this.viewSet == "Day") {
        this.scheduleObj.changeView("Day");
        this.plotSchedule({
          value: this.dropDownValue,
        });
      } else {
        this.plotSchedule({
          value: this.dropDownValue,
        });
      }
    }, 0);
    let scrollTo = moment().format("HH:mm");
    this.scheduleObj && this.scheduleObj.scrollTo(scrollTo);
  }
  onItemDrag(e) {}
  onRenderCell(e) {}
  onEventClick(args: any) {
    let Scheduledata = Object.assign(args.event);
    let appointmentId = Scheduledata.Id;
    args.cancel = true;
    let data = {
      Header: "Edit Appointment",
      Id: appointmentId,
      startTime: Scheduledata.StartTime,
      endTime: Scheduledata.EndTime,
      location_id: this.location_id,
      isChild: Scheduledata && Scheduledata.isChild ? Scheduledata.isChild : "",
      bookingRef:
        Scheduledata && Scheduledata.bookingRef ? Scheduledata.bookingRef : "",
    };
    let data2 = {
      startTime: args.event.StartTime,
      endTime: args.event.EndTime,
      date: moment(args.event.day).format("YYYY-MM-DD"),
      staff: {
        id: args.event.staff,
        firstName: args.event.staff_first,
        lastName: args.event.staff_last,
      },
      notes: args.event.notes,
      location_id: this.location_id,
      id: args.event.Id,
      bookingRef:
        Scheduledata && Scheduledata.bookingRef ? Scheduledata.bookingRef : "",
    };
    args.event.type
      ? this.editBlockedTime(data2)
      : this.openViewAppointmentPage(data);
  }
  editBlockedTime(data) {
    const dialogRef = this.dialog.open(BlockedtimeComponent, {
      width: "35vw",
      height: "80vh",
      panelClass: "pad-Mnow321",
      data: { header: "Edit Blocked Time", details: data },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.reschedule = false;
      this.rebook = false;
      this.clientAppointment = false;
      this.blockedTime = false;
      if (result != undefined && result.Type == "refresh") {
        this.plotSchedule({ value: this.dropDownValue });
      }
    });
  }
  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === "QuickInfo" || args.type == "Editor") {
      args.cancel = true;
    }
  }
  openDialog(data): void {
    if (this.clientAppointment) {
      this.clientAppointment = false;
      data.client = this.clientId;
      data.clientAppointment = true;
    }
    const dialogRef = this.dialog.open(newappointment, {
      width: "100vw",
      height: "100vh",
      panelClass: "pad-Mnow321",
      data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.Type == "refresh") {
        this.getAppointmentX().subscribe();
      }
      if (result.staffId && result.date && result.location) {
        this.dropDownValue = result.staffId;
        this.location_id = result.location;
        this.selectedDate = new Date(result.date);
        this.plotSchedule({ value: this.dropDownValue });
      }
    });
  }
  openNewDialog(): void {
    let newDateObj = moment(new Date()).add(30, "m").toDate();
    let staffId = localStorage.getItem("id");
    const dialogRef = this.dialog.open(newappointment, {
      width: "100vw",
      height: "100vh",
      panelClass: "pad-Mnow321",
      data: {
        Header: "New Appointment",
        location_id: this.location_id,
        cellData: {
          StartTime: new Date(),
          EndTime: newDateObj,
        },
        staff: staffId,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.Type == "refresh") {
        this.plotSchedule({ value: this.dropDownValue });
      }
      if (result.staffId && result.date && result.location) {
        this.dropDownValue = result.staffId;
        this.location_id = result.location;
        this.selectedDate = new Date(result.date);
        this.plotSchedule({ value: this.dropDownValue });
      }
    });
  }
  openVoucherDialog(): void {
    const dialogRef = this.dialog.open(CreateInvoiceComponent, {
      width: "500px",
      height: "90vh",
      panelClass: "pad-Mnow321",
      position: { top: "20px" },
      data: { Header: "Vouchers", location_id: this.location_id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.Type == "refresh") {
        this.plotSchedule({
          value: this.dropDownValue,
        });
      }
    });
  }
  //to create your own event AND it will called by child comp. or dialog box.
  createNewEvent(value) {
    var data = {
      Id: value.Id,
      Subject: value.Subject,
      StartTime: value.StartDate,
      EndTime: value.EndDate,
      IsAllDay: false,
      personID: value.personID,
      CategoryColor: value.CategoryColor,
    };
    if (value.Header == "New Appointment") {
      this.scheduleObj.addEvent(data);
    } else {
      this.scheduleObj.saveEvent(data);
    }
  }

  durationCalculate(startTime, endTime) {
    let stme = moment(startTime);
    let enme = moment(endTime);
    let duration = moment.duration(enme.diff(stme));
    let remain_hour = duration.hours();
    let remain_min = duration.minutes();
    return `${remain_hour != 0 ? remain_hour + "h" : ""} ${
      remain_min != 0 ? remain_min + "min" : ""
    }`;
  }
  getAllService() {
    this._service.get(SERVICE).subscribe(
      (res) => {
        this.allServiceList = res;
        this.dropDownValue = "";
        if (this.allServiceList.length != 0) {
          this.cdRef.detectChanges();
          setTimeout(() => {
            if (this.scheduleObj) {
              let scrollTo = moment().format("HH:mm");
              this.scheduleObj && this.scheduleObj.scrollTo(scrollTo);
              if (this.calendarSettings != "undefined") {
                this.scheduleObj.timeScale.interval = parseInt(
                  this.calendarSettings.time_interval as string,
                  10
                );
                this.scheduleObj.firstDayOfWeek = parseInt(
                  <string>this.calendarSettings.week_start_day,
                  10
                );
              }
              this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
              this.scheduleObj.dataBind();
            }
          }, 500);
          this.getAllLocation();
        } else {
          this.changeRef.detectChanges();
          this.spinner.hide();
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  getAllStaff() {
    this._service.get(GET_STAFF_DROP).subscribe(
      (res) => {
        this.collection = [];
        res.map((item, index) => {
          if (item.calendarBooking) {
            return {
              unid: item._id,
              firstName: item.firstName,
              lastName: item.lastName,
              CategoryColor: item.appointmentColor,
              workDays: [0, 1, 2, 3, 4, 5, 6],
              image: "",
            };
          }
        });
        if (!this.browserRefresh) {
          this.dropDownValue = this.collection[0].unid;
          // this.location_id = res[0].location[0];
          this.resourceDataSource = [this.collection[0]];
        } else {
          let id = localStorage.getItem("dropDownValue");
          this.collection.forEach((ele, index) => {
            if (ele.unid == id) {
              this.dropDownValue = this.collection[index].unid;
              this.resourceDataSource = [this.collection[index]];
            }
          });
        }
        this.changeRef.detectChanges();
        // this.getAppointmentX().subscribe();
      },
      (err) => {}
    );
  }
  getAllLocation() {
    this._service.get(LOC_LIS).subscribe((res) => {
      if (!res.length) {
        this.noLocationView = true;
        this.spinner.hide();
      } else {
        this.locationList = res;
        if (!this.browserRefresh || !this.location_id) {
          this.location_id = this.locationList[0]._id;
        } else {
          this.location_id = localStorage.getItem("location_id");
        }
        this.getStaffByLocationId(this.location_id);
      }
    }),
      (err) => {
        this.spinner.hide();
      };
  }
  selectedLocation(id) {
    //to clear the calender (** to remove fluctuation)
    this.resource = [];
    this.eventSettings = {
      dataSource: this.resource,
      enableTooltip: true,
      tooltipTemplate: this.temp,
    };
    this.location_id = id;
    localStorage.setItem("location_id", this.location_id);
    this.getStaffByLocationId(this.location_id);
  }
  dragEventAppointment(appointmentId, data, typeEvt?) {
    if (typeEvt == "single-drag") {
      this._service.patch(`${APPOINTMENT}/${appointmentId}`, data).subscribe(
        (res) => {
          if (this.reschedule) {
            this.reschedule = false;
            this.getAppointmentX().subscribe();
            this._toast.add({
              severity: "success",
              summary: "Service Message",
              detail: "Appointment rescheduled",
            });
          } else {
            if (
              res &&
              res.result[0]._type &&
              res.result[0]._type == "blocked"
            ) {
              this._toast.add({
                severity: "success",
                summary: "Service Message",
                detail: "Block time rescheduled",
              });
            } else {
              //to update the resorce
              let resp = res && res.result.length ? res.result[0] : "";
              this.resource.forEach((item: any) => {
                if (item.Id == resp.Id) {
                  item.StartTime = resp.startTime;
                  item.EndTime = resp.endTime;
                  item.blockEndTime = moment(item.StartTime).format("LT");
                  item.blockStartTime = moment(item.EndTime).format("LT");
                  item.startTimeTT = moment(item.StartTime).format("LT");
                  item.endTimeTT = moment(item.EndTime).format("LT");
                }
              });
              // this.scheduleObj.refresh()
              this.scheduleObj.refreshEvents();
              this._toast.add({
                severity: "success",
                summary: "Service Message",
                detail: "Appointment rescheduled",
              });
            }
          }
        },
        (err) => {}
      );
      return;
    }
    // this.rebook = false;
    let multipleAppointment;
    if (data.childrenNo) {
      let urlGenerator = `${APPOINTMENT}/search?booking_reference=${data.booking_reference}&location_id=${data.location_id}`;
      this._service.get(`${urlGenerator}`).subscribe(
        (res) => {
          multipleAppointment = res;
          let tempEndTime;
          multipleAppointment.forEach((ele, index) => {
            if (index == 0) {
              ele.duration = this.durationCalculate(ele.startTime, ele.endTime);
              ele.startTime = data.startTime;
              ele.day = data.startTime;
              ele.endTime = this.changeEndTime({
                duration: ele.duration,
                startTime: ele.startTime,
                endTime: ele.endTime,
              });
              tempEndTime = ele.endTime;
            } else {
              ele.duration = this.durationCalculate(ele.startTime, ele.endTime);
              ele.startTime = tempEndTime;
              ele.endTime = this.changeEndTime({
                duration: ele.duration,
                startTime: ele.startTime,
                endTime: ele.endTime,
              });
              tempEndTime = ele.endTime;
              ele.day = data.startTime;
            }
            // delete ele.booking_reference;
            // delete ele.Id;
            // delete ele.status;
            // delete ele.checkout;
            // delete ele.status_color;
            // ele.staff = this.patchData.staff
          });
          data = multipleAppointment;
          this._service.patch(`${APPOINTMENT}`, data).subscribe((res) => {
            if (this.reschedule) {
              this.reschedule = false;
              this.getAppointmentX().subscribe();
              this._toast.add({
                severity: "success",
                summary: "Service Message",
                detail: "Appointment rescheduled",
              });
            }
          });
        },
        (err) => {}
      );
    } else {
      // this._service.get(`${APPOINTMENT}/search?appointment=${data.Id}&location_id=${data.location_id}`).subscribe(res => {
      data = [data];
      this._service.patch(`${APPOINTMENT}`, data).subscribe(
        (res) => {
          if (this.reschedule) {
            this.reschedule = false;
            this.getAppointmentX().subscribe();
            this._toast.add({
              severity: "success",
              summary: "Service Message",
              detail: "Appointment rescheduled",
            });
          }
        },
        (err) => {
          console.log("App err");
        }
      );
    }
  }
  getStaffByLocationId(loc_id) {
    this._service.get(`${STAFF_LIST_LOC}${loc_id}`).subscribe((res) => {
      this.collection = [];
      if (res.length != 0) {
        res.forEach((item, index) => {
          if (item.calendarBooking) {
            this.collection.push({
              unid: item._id,
              firstName: item.firstName,
              lastName: item.lastName,
              CategoryColor: item.appointmentColor,
              workDays: [0, 1, 2, 3, 4, 5, 6],
            });
          }
        });
        //when browser is refresh
        if (
          !this.browserRefresh &&
          !!this.location_id &&
          this.collection.length > 0
        ) {
          this.dropDownValue = "working";
          this.resourceDataSource = [this.collection[0]];
          this.changeRef.detectChanges();
          this.isStaffVisible = this.collection.length == 0 ? true : false;
          this.plotSchedule({ value: this.dropDownValue });
        } else {
          // this.isStaffVisible = this.collection.length == 0 ? true : false;
          let loc = localStorage.getItem("location_id");
          this.location_id = localStorage.getItem("location_id");
          if (this.collection != undefined && this.collection.length != 0) {
            let id = localStorage.getItem("dropDownValue");
            this.changeRef.detectChanges();
            if (id == "") {
              loc != undefined ? (this.location_id = loc) : "";
              this.dropDownValue = "";
              this.resourceDataSource = [this.collection[0]];
              this.plotSchedule({ value: "" });
              return;
            }
            if (id == "working") {
              loc != undefined ? (this.location_id = loc) : "";
              this.dropDownValue = "working";
              this.resourceDataSource = [this.collection[0]];
              this.plotSchedule({ value: "working" });
              return;
            }
            loc != undefined ? (this.location_id = loc) : "";
            this.collection.forEach((ele, index) => {
              if (ele.unid == id) {
                this.dropDownValue = this.collection[index].unid;
                this.resourceDataSource = [this.collection[index]];
                this.plotSchedule({ value: this.dropDownValue });
                return;
              }
            });
          }
        }
      } else {
        this.spinner.hide();
        this.collection = [];
        this.isStaffVisible = this.collection.length == 0 ? true : false;
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "No staff found",
        });
      }
      if (this.collection == undefined || this.collection.length == 0) {
        this.spinner.hide();
        this.collection = [];
        this.isStaffVisible = true;
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "No staff found",
        });
      }
    });
  }

  reschedule: boolean = false;
  rebook: boolean = false;
  patchData: any;
  //open View Appointment page.
  openViewAppointmentPage(data) {
    this.cdRef.detectChanges();
    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      width: "100vw",
      height: "100vh",
      panelClass: "pad-Mnow321",
      data: {
        header: "View Appointment",
        data: data,
        isChild: data.isChild,
        bookingRef: data.bookingRef,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.staffId && result.date && result.location) {
          this.dropDownValue = result.staffId;
          this.location_id = result.location;
          this.selectedDate = new Date(result.date);
          this.plotSchedule({ value: this.dropDownValue });
        }
        if (result.close) {
        } else {
          result && result.Header == "Reschedule"
            ? (this.reschedule = true)
            : result.Header == "Rebook"
            ? (this.rebook = true)
            : "";
        }
      } else {
        this.plotSchedule({ value: this.dropDownValue });
      }
      this.patchData = result;
    });
  }
  closeReschedule() {
    this.reschedule = false;
    this.rebook = false;
    this.clientAppointment = false;
    this.blockedTime = false;
  }
  getAppointmentX(
    employee_id = null,
    view = null,
    staff = null,
    date = null,
    location = null
  ): any {
    this.spinner.show();
    var Date = moment(this.selectedDate).format("YYYY-MM-DD");
    view ? (this.viewSet = view) : "";
    const params = new HttpParams()
      .set("view", this.viewSet.toLowerCase())
      .set("date", Date)
      .set("location_id", this.location_id)
      .set("staff", this.dropDownValue);
    const observable = new Observable((observer) => {
      this._service.get(`${GET_APP}`, params).subscribe(
        (res) => {
          if (this.dropDownValue == "working") {
            this.collection = this.collection.map((data) => {
              if (res.workingStaff && res.workingStaff.length) {
                res.workingStaff.forEach((element) => {
                  data["gender"] = element.gender ? element.gender : "unknown";
                  data["image"] = element.image ? element["image"]["data"] : "";
                  data["startHour"] = element.schedule.length
                    ? moment(element.schedule[0].time_start).format("HH:mm")
                    : "00:00";
                  data["endHour"] = element.schedule.length
                    ? moment(element.schedule[0].time_end).format("HH:mm")
                    : "00:00";
                });
                res.workingStaff.forEach((element) => {
                  if (data.unid == element._id) {
                    data["gender"] = element.gender;
                    data["image"] = element.image
                      ? element["image"]["data"]
                      : "";
                    data["startHour"] = element.schedule.length
                      ? moment(element.schedule[0].time_start).format("HH:mm")
                      : "00:00";
                    data["endHour"] = element.schedule.length
                      ? moment(element.schedule[0].time_end).format("HH:mm")
                      : "00:00";
                  }
                });
              }
              setTimeout(() => {
                this.spinner.hide();
              }, 0);
              return data;
            });
          }

          if (this.dropDownValue === "") {
            this.collection = this.collection.map((data) => {
              if (res.workSch && res.workSch.length) {
                res.workSch.forEach((element) => {
                  data["gender"] = element.staff.gender
                    ? element.staff.gender
                    : "unknown";
                  data["image"] = element.staff.image
                    ? element.staff["image"]["data"]
                    : "";
                  data["startHour"] = element.schedule[0].schedule_shift.length
                    ? moment(
                        element.schedule[0].schedule_shift[0].time_start
                      ).format("HH:mm")
                    : "00:00";
                  data["endHour"] = element.schedule[0].schedule_shift.length
                    ? moment(
                        element.schedule[0].schedule_shift[0].time_end
                      ).format("HH:mm")
                    : "00:00";
                });
                res.workSch.forEach((element) => {
                  if (data.unid == element.staff._id) {
                    data["gender"] = element.staff.gender
                      ? element.staff.gender
                      : "unknown";
                    data["image"] = element.staff.image
                      ? element.staff["image"]["data"]
                      : "";
                    data["startHour"] = element.schedule[0].schedule_shift
                      .length
                      ? moment(
                          element.schedule[0].schedule_shift[0].time_start
                        ).format("HH:mm")
                      : "00:00";
                    data["endHour"] = element.schedule[0].schedule_shift.length
                      ? moment(
                          element.schedule[0].schedule_shift[0].time_end
                        ).format("HH:mm")
                      : "00:00";
                  }
                });
              }
              setTimeout(() => {
                this.spinner.hide();
              }, 0);
              return data;
            });
          }

          if (this.dropDownValue != "" && this.dropDownValue != "working") {
            let arr = [];
            arr.push(res.workSch);
            this.collection = this.collection.map((data) => {
              if (res.workSch) {
                // res.workSch.forEach(element => {
                //   data['gender'] = (element.staff.gender)? element.staff.gender : 'unknown';
                //   data['image'] = element.staff.image ? element.staff['image']['data'] : ''
                //   data['startHour'] = (element.schedule[0].schedule_shift.length) ? moment(element.schedule[0].schedule_shift[0].time_start).format("HH:mm") : '00:00';
                //   data['endHour'] = (element.schedule[0].schedule_shift.length) ? moment(element.schedule[0].schedule_shift[0].time_end).format("HH:mm") : '00:00';
                // })
                arr.forEach((element) => {
                  if (data.unid == this.dropDownValue) {
                    // data['gender'] = (res.workSch.staff.gender)? res.workSch.staff.gender : 'unknown';
                    // data['image'] = res.workSch.staff.image ? res.workSch.staff['image']['data'] : ''
                    data["startHour"] = element.schedule[0].schedule_shift
                      .length
                      ? moment(
                          element.schedule[0].schedule_shift[0].time_start
                        ).format("HH:mm")
                      : "00:00";
                    data["endHour"] = element.schedule[0].schedule_shift.length
                      ? moment(
                          element.schedule[0].schedule_shift[0].time_end
                        ).format("HH:mm")
                      : "00:00";
                  }
                });
              }
              setTimeout(() => {
                this.spinner.hide();
              }, 0);
              return data;
            });
          }

          let staffId = [];
          if (res.workingStaff) {
            res.workingStaff.forEach((ele) => {
              if (ele._id) staffId.push(ele._id);
              else if (ele) staffId.push(ele);
            });
          }
          let staffIdUniq = [Array.from(new Set(staffId).values())];
          if (res.appointments && res.appointments.length != 0) {
            this.resource = res.appointments.map((item) => {
              // if(!item.status) (item.status = 'confirmd', item.status_color = 'violet')
              if (item.status == "completed") item.status_color = "#585864";
              // if(item.checkout == true && item.status == "complete") item.status_color = '#585864'
              // if(item.status == 'new') item.status_color = '#3792cb'
              // if(item.status == 'confirmed') item.status_color = '#00ff50';
              // if(item.status == 'arrived') item.status_color = '#008910'
              // if(item.status == 'started') item.status_color = '#ffc0cb'
              // if(item.status == 'no show') item.status_color = '#ff4150'
              // if(item.status == 'cancelled') item.status_color = '#ffa500'
              // if(item.status == '')
              let resource = {
                Id: item.Id,
                Subject: item.service != undefined ? item.service.name : "",
                StartTime: item.startTime,
                EndTime: item.endTime,
                blockStartTime: moment(item.startTime).format("LT"),
                blockEndTime: moment(item.endTime).format("LT"),
                startTimeTT: moment(item.startTime).format("hh:mm"),
                endTimeTT: moment(item.endTime).format("hh:mm"),
                service: item.service != undefined ? item.service._id : "",
                day: item.day,
                checkout: item.checkout,
                IsReadonly: item.checkout ? true : false,
                duration: item.duration,
                requested_staff: item.requested_staff,

                staff: item.staff != undefined ? item.staff._id : "",
                staff_first:
                  item.staff && item.staff.firstName
                    ? item.staff.firstName
                    : "",
                staff_last:
                  item.staff && item.staff.lastName ? item.staff.lastName : "",
                client_gender:
                  item.client && item.client.gender ? item.client.gender : "",
                notes: item.notes,
                status: item.status ? item.status.toUpperCase() : "",
                statusColor: item.status_color,
                client: item.client != undefined ? item.client._id : "",
                client_Name:
                  (item.client && item.client.firstName) ||
                  (item.client && item.client.lastName)
                    ? `${item.client.firstName} ${item.client.lastName}`
                    : item._type && item._type == "blocked"
                    ? "Blocked Time"
                    : "Walk-In",
                durationCal: this.durationCalculate(
                  item.startTime,
                  item.endTime
                ),
                isChild: item && item.childrenNo ? item.childrenNo : "",
                type: item._type ? item._type : undefined,
                bookingRef: item.booking_reference,
                amount: item.price ? item.price : 0,
                currencySymbol: this.currencySymbol,
              };
              return resource;
            });
          }
          this.eventSettings = {
            dataSource: this.resource,
            enableTooltip: true,
            tooltipTemplate: this.temp,
          };
          this.calendar = true;
          this.spinner.hide();
          // this.scheduleObj.refreshEvents();
          observer.next({ completed: true, staffId: staffId });
          observer.complete();

          this.browserRefresh = false;
        },
        (err) => {
          this.resource = [];
          this.browserRefresh = false;
          this.calendar = true;
          observer.next({ completed: true });
          observer.complete();
          this.spinner.hide();
        }
      );
    });
    return observable;
  }
  //rebook logic from invoice
  rebookInvoice() {
    this.rebook = true;
    this.cdRef.detectChanges();
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  workingDuration(staff) {
    return this.collection.filter((it) => staff == it.unid);
  }
  onDateNavigate(type) {
    if (type == "prev") {
      let prev: any = moment(this.selectedDate).subtract(1, "day");
      this.selectedDate = prev._d;
    } else {
      let next: any = moment(this.selectedDate).add(1, "day");
      this.selectedDate = next._d;
    }
    this.onNavigating();
  }
  onDateChange(event) {
    this.selectedDate = event.value;
    this.onNavigating();
  }

  changeSelectedIndex() {
    this._service.selectedIndex = 2;
  }

  openRequested() {
    const dialogRef = this.dialog.open(RequestedItemsComponent, {
      width: "100vw",
      height: "100vh",

      // data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  openDrawer() {
    const dialogRef = this.dialog.open(CashDrawerComponent, {
      width: "60vw",
      height: "90vh",

      // data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  openSettingModal(){
    console.log('open setting modal')
    const dialogRef = this.dialog.open(CalendarSettingModalComponent, {
      width: "50vw",
      height: "85vh",

      // data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
