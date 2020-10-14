// xxxxx modal component(staff hour editor) xxxxxx xxxxxx xxxxxx xxxxxx xxxxx xxxxx xxxxx
import {
  Component,
  OnInit,
  Inject,
  Optional,
  ViewEncapsulation
} from "@angular/core";
import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";

import { SCHEDULE_SET } from "app/services/url";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

import { fuseAnimations } from "@fuse/animations";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "StaffModal",
  templateUrl: "StaffModal.html",
  styleUrls: ["./StaffModal.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StaffModal implements OnInit {
  ifNewShift: boolean;
  modifyUserHour: boolean;
  staffHour: FormGroup;
  removeSecond: boolean;
  repeatsDropdownValue: any;
  dropValue: any;
  minValidation :any = new Date();
  // currentDate : moment(new Date()).format('MM/DD/YYYY');;
  constructor(
    @Optional() public dialogRef: MatDialogRef<StaffModal>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.staffHour = this._formBuilder.group({
      staff_id: [""],
      start_date: [""],
      end_date: [""],
      time_start_one: [""],
      time_end_one: [""],
      time_start_two: [""],
      time_end_two: [""],
      repeat: [""],
      endRepeat: [""]
    });

    this.renderHourData(this.data.alldata, this.data.schedule, this.data.date);
  }
  onNoClick(): void {
    this.dialogRef.close({
      value: this.repeatsDropdownValue
    });
  }
  addNewShift() {
    this.ifNewShift = !this.ifNewShift;
  }
  delete() {
    this.modifyUserHour = !this.modifyUserHour;
    if (!this.modifyUserHour) {
      this.dialogRef.updateSize("40%", "40%");
    } else {
      this.dialogRef.updateSize("40%", "40%");
    }
  }
  ConfirmDelShift() {
    var data = {
      staff_id: this.staffHour.controls["staff_id"].value,
      start_date: this.staffHour.controls["start_date"].value,
      end_date: this.staffHour.controls["end_date"].value,
      schedule_shift: [],
      location: this.data.selectedLoc
    };
    this._service
      .put(`${SCHEDULE_SET}${this.staffHour.controls["staff_id"].value}`, data)
      .subscribe(
        res => {
          setTimeout(() => {
            this.dialogRef.close({
              type: "refresh"
            });
          }, 1500);
        },
        err => {
          //("error ===>>>", err);
        }
      );
  }
  staffHourSubmit(form_data) {
    //;
    var form = form_data.value;
    var shift_time = [];
    if (form.time_start_one || form.time_end_one) {
      shift_time.push({
        time_start: form.time_start_one,
        time_end: form.time_end_one,
        start: this.dateFormatStablizer(form.time_start_one),
        end: this.dateFormatStablizer(form.time_end_one)
      });
    }
    if (form.time_start_two || form.time_end_two) {
      if (this.removeSecond) {
        (form.time_start_one = ""), (form.time_start_two = "");
      } else {
        shift_time.push({
          time_start: form.time_start_two,
          time_end: form.time_end_two,
          start: this.dateFormatStablizer(form.time_start_two),
          end: this.dateFormatStablizer(form.time_end_two)
        });
      }
    }

    // repeat: form.repeat,
    // endRepeat: form.endRepeat,

    let dataRepeat: boolean;

    if (form.repeat == "Don't repeat") {
      form.end_date = form.start_date;
      // dataRepeat.push({
      //   repeat: form.repeat,
      //   // endRepeat : form.endRepeat
      // })
    }
    if (form.repeat == "Weekly") {
      if (form.endRepeat == "Ongoing") {
        form.end_date = null;
      }
      // dataRepeat.push({
      //   repeat: form.repeat,
      //   endRepeat: form.endRepeat
      // })
    }
    if (form.repeat == "Daily") {
      // form.end_date = form.start_date;
      dataRepeat = true;
      if (form.endRepeat == "Ongoing") {
        //("in ongoing");
        form.end_date = null;
      }
      // dataRepeat.push({
      //   repeat: form.repeat,
      //   endRepeat: form.endRepeat
      // })
    }
    //;
    // let startDataModify: any = moment(form.start_date).startOf("day");
    var offset = new Date().getTimezoneOffset()  < 0 ? -new Date().getTimezoneOffset() :  new Date().getTimezoneOffset();
    var a = new Date(form.start_date).getTime() + (offset * 60 *  1000)
    form.start_date = new Date(a).toISOString();
    var data = {
      staff_id: form.staff_id,
      start_date: form.start_date,
      end_date: form.end_date,
      schedule_shift: shift_time,
      location: this.data.selectedLoc
    };

    if (form.repeat == "Daily") {
      data["allday"] = true;
    }
    this._service.put(`${SCHEDULE_SET}${form.staff_id}`, data).subscribe(
      res => {
        setTimeout(() => {
          this.dialogRef.close({
            type: "refresh"
          });
        }, 1500);
      },
      err => {}
    );
  }

  setEndRepeat(formData) {
    //("close clicked ===>>>", formData);

    this.removeSecond = true;
    this.staffHour.controls["endRepeat"].setValue("Ongoing");
  }

  renderHourData(allData, sch, date) {
    //("All Data ==>>", allData);
    this.staffHour.controls["staff_id"].setValue(allData.staff._id);
    if (sch.schedule_shift) {
      this.staffHour.controls["start_date"].setValue(this.data.date);
      const schData = sch.schedule_shift;
      if (sch.schedule_shift.length == 2) {
        this.ifNewShift = true;
      }
      schData[0] && schData[0].time_start
        ? this.staffHour.controls["time_start_one"].setValue(
            schData[0].time_start
          )
        : "";
      schData[0] && schData[0].time_end
        ? this.staffHour.controls["time_end_one"].setValue(schData[0].time_end)
        : "";
      schData[1] && schData[1].time_start
        ? this.staffHour.controls["time_start_two"].setValue(
            schData[1].time_start
          )
        : "";
      schData[1] && schData[1].time_end
        ? this.staffHour.controls["time_end_two"].setValue(schData[1].time_end)
        : "";
    }
    // if (sch.start_date) {
    //   this.staffHour.controls['start_date'].setValue(sch.start_date);
    // }
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    const currentDate = this.data.date.getDay();
    return day == currentDate;
  };


 
  dateFormatStablizer(d) {
    let dateIso = moment(d).toISOString();

    let arrT = dateIso.split("T");
    let arrCol = arrT[1].split(":");
    let tot = Number(arrCol[0]) * 60 + Number(arrCol[1]);

    return tot;
  }

  timeIncrease(d) {
    let obj: any = moment(d).add(30, "minutes");
    return obj._d;
  }

  selectValueChanged(e) {
    //("my event ==>>", e);
    this.dropValue = e;
  }
}
