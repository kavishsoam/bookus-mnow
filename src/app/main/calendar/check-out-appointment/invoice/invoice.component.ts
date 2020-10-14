import {
  Component,
  OnInit,
  Optional,
  Inject,
  forwardRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import {
  INVOICE,
  CLIENT,
  CLIENT_INFO,
  APPOINTMENT,
  INVOICE_EDIT,
} from "../../../../services/url";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
// import { CalendarComponent } from '../../calendar.component';
import { DataSharing } from "app/services/message-service";
import { ApiService } from "app/services/api.service";
import { MessageService } from "primeng/api";
import { InvoiceEmailComponent } from "app/main/shared-component/invoice-email/invoice-email.component";
import { FormArray, FormControl } from "@angular/forms";
@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements AfterViewInit {
  currentDate: Date;
  invoiceData: any;
  currencyCode: String;
  clientData: any;
  clientDetails: any;
  appointment: any = [];
  profile: boolean;
  apt: any;
  endTime: any;
  startTime: any;
  remain_hour: number;
  remain_min: number;
  clientId: any;
  rebook: boolean;
  reschedule: boolean;
  status: any;
  aptObj: any = {};
  clientInvoices: any;
  editedNote: any;
  noteEdit: any = true;
  provider = new FormArray([]);
  saveIcon: boolean = false;
  isEditProvider: boolean = true;
  // @ViewChild(CalendarComponent) private calComp: CalendarComponent;
  // @ViewChild(forwardRef(() => CalendarComponent))
  // private calComp: CalendarComponent;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InvoiceComponent>,
    private _service: ApiService,
    private spinner: NgxSpinnerService,
    private dataSharing: DataSharing,
    public _toast: MessageService,
    public dialog: MatDialog
  ) {}
  ngAfterViewInit() {}
  ngOnInit() {
    //

    //
    setTimeout(() => {
      this.getInvoiceById();
      this.currencyCode = localStorage.getItem("currency");
      this.currentDate = new Date();
      this.data.invoice;
    });
  }

  createFormArray(json) {
    json.forEach((element) => {
      this.provider.push(new FormControl(element.provider));
    });
  }
  getInvoiceById() {
    this.spinner.show();
    this._service.get(`${INVOICE}/${this.data.invoiceId}`).subscribe(
      (res) => {
        this.invoiceData = res.result;
        this.editedNote =
          res && res.result && res.result.appointment[0].notes
            ? res.result.appointment[0].notes
            : "";
        this.createFormArray(res.result.appointment);
        console.log("invoiceData", this.invoiceData);

        if (this.invoiceData.client != "Walk-in") {
          this.getClientInfo(this.invoiceData.client);
          this.getClientDetails(this.invoiceData.client, this.data.location_id);
          this.getClientInvoices(this.invoiceData.client);
        } else {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  //get client info
  getClientInfo(id) {
    this._service.get(`${CLIENT}/${id}`).subscribe((res) => {
      this.clientData = res[0];

      console.log("clientData", this.clientData);
    }),
      (err) => {
        this.spinner.hide();
      };
  }
  getClientDetails(client_id, location_id) {
    this._service
      .get(`${CLIENT_INFO}${client_id}&location_id=${location_id}`)
      .subscribe(
        (res) => {
          this.clientDetails = res.clientInfo;
          this.appointment = res.appointment;
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }
  getClientInvoices(client_id) {
    this._service.get(`${INVOICE}/client/${client_id}`).subscribe(
      (res) => {
        this.clientInvoices = res.result;
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  viewProfile() {
    this.profile = !this.profile;
  }
  onMoreOptionSelected(value) {
    if (value == "Rebook") {
      this.rescheduleAppointment(
        this.invoiceData.appointment[0].appointmentId,
        value
      );
    }
    if (value == "email") {
      this.sendAsEmail();
    }
  }

  sendAsEmail() {
    this.spinner.show();
    if (this.invoiceData.client == "Walk-in") {
      // this._toast.add({ severity: 'success', summary: 'Service Message', detail: `hello` });
    }

    if (this.invoiceData.client != "Walk-in") {
      // setTimeout(() => {
      //   this._toast.add({ severity: 'success', summary: 'Service Message', detail: `hello` });
      // }, 100);
      this._service
        .get("sales/email_invoice?" + `${INVOICE}=${this.data.invoiceId}`)
        .subscribe(
          (res) => {
            console.log("invoice email response ==>>", res);
            //
            this._toast.add({
              severity: "success",
              summary: "Service Message",
              detail: "Invoice send as email",
            });
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  rescheduleAppointment(app_id, value) {
    //
    // this._service.get(`${APPOINTMENT}/search?appointment=${app_id}&location_id=${this.data.location_id}`).subscribe(res => {
    //   this.aptObj = res[0];
    //   if (!this.aptObj.walkIn || this.aptObj.client) this.aptObj.client = this.aptObj.client._id
    //   this.aptObj.service = this.aptObj.service._id
    //   this.aptObj.location = this.data.location_id
    this.aptObj.rebook = true;
    this.aptObj.Header = "Rebook";
    delete this.aptObj.createdAt;
    delete this.aptObj.updatedAt;
    this.getAppById(
      this.data.getAppointment.appointmentId,
      this.data.getAppointment.locationId
    );
    // setTimeout(() => {

    // this.calComp.rebookInvoice();
    // })
    // },
    //   err => {
    //   })
  }
  getAppById(app_id, loc_id) {
    this._service
      .get(`${APPOINTMENT}/search?appointment=${app_id}&location_id=${loc_id}`)
      .subscribe(
        (res) => {
          this.apt = res[0];
          this.data.getAppointment.apt = this.apt;
          this.data.getAppointment.rebook = true;
          this.dataSharing.sendMessage(this.data.getAppointment);
          this.dialogRef.close(this.aptObj);
        },
        (err) => {}
      );
  }
  getAppointmentById(app_id, loc_id) {
    this.spinner.show();
    this._service
      .get(`${APPOINTMENT}/search?appointment=${app_id}&location_id=${loc_id}`)
      .subscribe(
        (res) => {
          this.apt = res[0];

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
          this.apt.checkout ? (this.rebook = true) : (this.reschedule = true);
          this.status = this.apt.status;
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
  }

  editClicked() {
    this.saveIcon = !this.saveIcon;
    this.isEditProvider = false;
    this.noteEdit = false;
    this._toast.add({
      severity: "warn",
      summary: "Service Message",
      detail: "Invoice Edit Enabled",
    });
    console.log(this.editedNote);
    console.log(this.provider);
  }

  saveClicked() {
    this.saveIcon = !this.saveIcon;
    this.isEditProvider = true;
    this.noteEdit = true;
    console.log(this.editedNote);
    console.log(this.provider);
    this.apiForEditInvoice();
  }

  apiForEditInvoice() {
    this.invoiceData.appointment.forEach((element, i) => {
      this.provider.value.forEach((ele, index) => {
        if (index === i) {
          element.provider = ele;
          element.notes = this.editedNote;
        }
      });
    });
    console.log(this.invoiceData);
    this._service.post(INVOICE_EDIT, this.invoiceData).subscribe(
      (res) => {
        console.log(res);
        this._toast.add({
          severity: "success",
          summary: "Service Message",
          detail: "Invoice Edited successfully",
        });
      },
      (err) => {
        console.log(err);
        this._toast.add({
          severity: "warn",
          summary: "Service message",
          detail: err.error,
        });
      }
    );
  }
}
