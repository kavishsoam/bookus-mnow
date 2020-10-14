import { Component, Inject, OnInit, Optional } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "app/services/api.service";
import { TIME_SLOT, INTAKE_DATA } from "app/services/url";
import * as moment from "moment";
@Component({
  selector: "app-select-time-slots",
  templateUrl: "./select-time-slots.component.html",
  styleUrls: ["./select-time-slots.component.scss"],
})
export class SelectTimeSlotsComponent implements OnInit {
  availableTimeSlots: any = [];
  counting: any;
  constructor(
    public dialogRef: MatDialogRef<SelectTimeSlotsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ApiService
  ) {}

  ngOnInit() {
    console.log(this.data);
    // this.service.get(TIME_SLOT+)
  }

  calcuateMinutes(data) {
    let dateDiff: any;
    dateDiff = moment(data.time.endTime).diff(
      moment(data.time.startTime),
      "minutes"
    );
    let formattedDate: any;
    formattedDate = data.date.split("T")[0];
    console.log(dateDiff);
    this.getAllTimeSlots(dateDiff, formattedDate);
    this.data.ownerId &&
      this.data.clientId &&
      this.data.clientId._id &&
      this.checkIntakeForm();
  }

  getAllTimeSlots(minutes, dateFormat) {
    this.service
      .get(
        TIME_SLOT +
          minutes +
          "&staff_id=" +
          this.data.therapistId._id +
          "&location_id=" +
          this.data.locationId._id +
          "&list=true&date=" +
          dateFormat
      )
      .subscribe(
        (res) => {
          let data: any = [];
          data = res["result"];
          let i = 0;
          data.forEach((element) => {
            element.count = i++;
          });
          this.availableTimeSlots = data;
          console.log(this.availableTimeSlots);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  checkIntakeForm() {
    this.service
      .get(
        INTAKE_DATA +
          this.data.clientId._id +
          "&shop_owner=" +
          this.data.ownerId
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onNoClick() {}

  matSelectChange(e) {
    console.log(e);
    this.calcuateMinutes(e.value);
  }

  timeSeletion(count) {
    this.counting = count;
  }

  closeModal() {
    this.dialogRef.close();
  }

  confirmClicked() {
    this.dialogRef.close();
  }
}
