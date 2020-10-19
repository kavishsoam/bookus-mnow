import {
  Component,
  OnInit,
  Optional,
  Inject,
  ChangeDetectorRef,
  ApplicationRef
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ApiService } from "app/services/api.service";
import { APPOINTMENT, CLIENT, CLIENT_INFO, APPOINTMENT_STATUS, INVOICE } from "app/services/url";
import * as moment from "moment";
import { newappointment } from "../new-appointment/new-appointment.component";
import { fuseAnimations } from "@fuse/animations";
import { CheckOutComponent } from "../check-out-appointment/check-out/check-out.component";
import { ClientIntakeForm, AddNewClient } from "app/main/clients/clients.component";
import { InvoiceComponent } from "../check-out-appointment/invoice/invoice.component";
import { CancelComponent } from "../cancel/cancel.component";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { ChangeDetectionStrategy } from "@angular/compiler/src/core";
import { CalenderDataService } from "../calenderData.service";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-view-appointment",
  templateUrl: "./view-appointment.component.html",
  styleUrls: ["./view-appointment.component.scss"],
  animations: fuseAnimations
})
export class ViewAppointmentComponent implements OnInit {
  currencyCode: string;
  rebook: boolean;
  reschedule: boolean;
  clientDetails: any;
  clientData: any;
  clientInvoices: any;
  intakeId: any;
  firstName: string;
  isViewAppointment: boolean = false;
  constructor(
    @Optional() public dialogRef: MatDialogRef<ViewAppointmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private CalenderData: CalenderDataService,
    private _toast : MessageService
  ) { }
  location_id: any;
  apt: any;
  endTime: Date;
  startTime: Date;
  remain_hour: number = 0;
  remain_min: number = 0;
  profile: boolean;
  selectedReason: any;
  appointment: any = [];
  appointment_id: any;
  status: string;
  clientId: any;
  IsClientInTakeFormExist: boolean;
  multipleAppList: any = [];
  reason: any = [
    { label: "No reason provide", value: "No reason provide" },
    { label: "Duplicate appointment", value: "Duplicate appointment" },
    {
      label: "Appointment made by mistake",
      value: "Appointment made by mistake"
    },
    { label: "Client not available", value: "Client not available" }
  ];
  ngOnInit() {
    this.isViewAppointment = false;
    setTimeout(() => {
      this.firstName = localStorage.getItem("firstName");
      this.currencyCode = localStorage.getItem("currency");
      this.location_id = this.data.data.location_id;
      this.appointment_id = this.data.data.Id;
      this.getAppointmentById(
        this.data.data.Id,
        this.data.data.location_id,
        this.data.data.bookingRef
      );
    });
  }

  //kavish dev_rahul

  reDirectingSchedular(e){
    console.log("view appointment",e);
    this.dialogRef.close({...e,close:true});
  }

  viewEditAppointment(data) {
    //;
    let mulApp = _.cloneDeep(this.multipleAppList);
    if (data.multipleAppList) {
      delete data.multipleAppList;
    }
    data.multipleAppList = mulApp;
    const dialogRef = this.dialog.open(newappointment, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.Type == "refresh" && result.action != "delete")
        this.getAppointmentById(result.id, result.location, result.bookingRef);
      else if (result && result.action == "delete") this.dialogRef.close();
    });
  }
  viewProfile() {
    this.profile = !this.profile;
  }
  onMoreOptionSelected(value) {
    if (value == "Cancel") {
      this.cancel();
    } else if (value == "Edit Appointment") {
      this.viewEditAppointment(this.data);
    } else if (value == "No Show") {
      this.changeStatus(value);
      this.dialogRef.close();
    } else if (value == "Undo No Show") {
      this.changeStatus("new");
      this.dialogRef.close();
    } else if (value == "Reschedule" || value == "Rebook") {
      this.rescheduleAppointment(this.data, value);
    }
  }

  clientOption(type) {
    // if (type == "Remove From Appointment") {
    //   if (this.clientIntakeFormFilled) {
    //     this._toast.add({
    //       severity: "warn",
    //       summary: "Cannot remove Client once Intake form is filled"
    //     });
    //   } else {
    //     this.searchClientEmail = "";
    //     this.searchClient = "";
    //     this.select_Client = "";
    //     this.walkIn = true;
    //     this.clientIntakeFormFilled = true;
    //   }
    // } else
    
    if (type == "Edit Client Details") {
      const dialogRef = this.dialog.open(AddNewClient, {
        width: "100vw",
        height: "100vh",
        panelClass: 'pad-Mnow321',
        data: {
          header: "Edit Client",
          data: this.clientData,
          intakeBtn: "Save"
        }
      });
      dialogRef.afterClosed().subscribe(result => { });
    }
  }

  getAppointmentById(app_id, loc_id, bookingRef?) {
    // booking refrence is in both single and multiple appointment i.e else condition did not exist
    this.spinner.show();
    var urlGenerator;
    if (bookingRef != "") {
      urlGenerator = `${APPOINTMENT}/search?booking_reference=${bookingRef}&location_id=${loc_id}`;
    } else {
      urlGenerator = `${APPOINTMENT}/search?appointment=${app_id}&location_id=${loc_id}`;
    }
    this._service.get(urlGenerator).subscribe(
      res => {
        this.apt = res[0];
        this.multipleAppList = res;
        if (this.apt) {
          if (this.apt.intakeId == undefined) {
            this.IsClientInTakeFormExist = false;
          } else {
            this.IsClientInTakeFormExist = true;
          }
          this.intakeId = this.apt.intakeId;
          this.endTime = this.apt.endTime;
          this.startTime = this.apt.startTime;
          var stme = moment(this.startTime);
          var enme = moment(this.endTime);
          var duration = moment.duration(enme.diff(stme));
          this.remain_hour = duration.hours();
          this.remain_min = duration.minutes();
          this.data = this.apt;
          this.data.Header = "Edit Appointment";
          this.data.location_id = loc_id;
        }
        if (
          this.apt &&
          this.apt.location &&
          this.apt.client &&
          this.apt.client._id
        ) {
          this.clientId = this.apt.client._id;
          this.getClientDetails(this.apt.client._id, this.apt.location);
          this.getClientInfo(this.apt.client._id);
          this.getClientInvoices(this.apt.client._id);
        }
        this.apt && this.apt.checkout
          ? (this.rebook = true)
          : (this.reschedule = true);
        this.status = this.apt && this.apt.status;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  rescheduleAppointment(data, value) {
    data.Header = value;
    if (!data.walkIn || data.client) data.client = data.client._id;
    data.service = data.service._id;
    data.location = data.location._id;
    delete data.createdAt;
    delete data.updatedAt;
    this.dialogRef.close(data);
  }
  //open View Appointment page.
  getClientDetails(client_id, location_id) {
    this._service
      .get(`${CLIENT_INFO}${client_id}&location_id=${location_id}`)
      .subscribe(
        res => {
          this.clientDetails = res.clientInfo;
          this.appointment = res.appointment;
        },
        err => {
          this.spinner.hide();
        }
      );
  }
  changeStatus(status) {
    status = status.toLowerCase();
    let newStatus = this.multipleAppList.map(it => {
      return {
        Id: it.Id,
        status: status
      };
    });

    this._service
      .patch(`${APPOINTMENT_STATUS}?location_id=${this.location_id}`, newStatus)
      .subscribe(
        res => {
          this.dialogRef.close();
        },
        err => { }
      );
  }
  checkOut() {
    //;
    const dialogRef = this.dialog.open(CheckOutComponent, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      data: {
        header: "Checkout",
        appointment_id: this.appointment_id,
        isChild: this.data && this.data.childrenNo ? this.data.childrenNo : "",
        bookingRef:
          this.data && this.data.booking_reference
            ? this.data.booking_reference
            : "",
        location_id: this.location_id,
        type: "Appointment",
        appointment: this.multipleAppList
      }
    });
    this.dialogRef.close();
    dialogRef.afterClosed().subscribe(result => {
      this.CalenderData.changeMessage(true); // to refresh the appointement in calender.ts file
    });
  }
  getIntakeByIntakeId() {
    this.intakeForm(this.apt.intakeId);
  }
  intakeForm(intakedata): void {
    const dialogRef = this.dialog.open(ClientIntakeForm, {
      width: "100vw",
      height: "100vh",
      panelClass: 'pad-Mnow321',
      autoFocus: false,
      data: { type: "viewIntake", intakedata: intakedata }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type) {
        if (result.type == "close") {
        }
      }
    });
  }
  //get client info
  getClientInfo(id) {
    this._service.get(`${CLIENT}/${id}`).subscribe(res => {
      this.clientData = res[0];
    }),
      err => {
        this.spinner.hide();
      };
  }
  viewInvoice(invoiceData) { 
    //
    if(invoiceData){

      const dialogRef = this.dialog.open(InvoiceComponent, {
        width: "100vw",
        height: "100vh",
        panelClass: 'pad-Mnow321',
        data: {
          invoiceId: invoiceData.invoice,
          location_id: invoiceData.location,
          apt: invoiceData
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.rebook) {
          delete result.rebook;
          this.dialogRef.close(result);
        }
      });

    }else{
      const dialogRef = this.dialog.open(InvoiceComponent, {
        width: "100vw",
        height: "100vh",
        panelClass: 'pad-Mnow321',
        data: {
          invoiceId: this.apt.invoice,
          location_id: this.apt.location_id,
          apt: this.apt
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.rebook) {
          delete result.rebook;
          this.dialogRef.close(result);
        }
      });

    }

  }

  getClientInvoices(client_id) {
    this._service.get(`${INVOICE}/client/${client_id}`).subscribe(
      res => {
        this.clientInvoices = res.result;
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  cancel() {
    //;
    let bookingRef =
      this.multipleAppList && this.multipleAppList.length > 0
        ? this.multipleAppList[0].booking_reference
        : null;
    const dialogRef = this.dialog.open(CancelComponent, {
      width: "45vw",
      height: "36vh",
      panelClass: 'pad-Mnow321',
      data: { appointmentId: bookingRef }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }
  closeViewAppointement() {
    this.dialogRef.close({ close: true });
  }
}
