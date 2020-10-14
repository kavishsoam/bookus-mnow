import {
  Component,
  OnInit,
  Optional,
  Inject,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { ApiService } from "app/services/api.service";
import { REQUESTAPPT } from "app/services/url";
import { SelectTimeSlotsComponent } from "../select-time-slots/select-time-slots.component";

@Component({
  selector: "app-requested-items",
  templateUrl: "./requested-items.component.html",
  styleUrls: ["./requested-items.component.scss"],
})
export class RequestedItemsComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "rating",
    "review",
    "timeSlot",
    "action",
  ];
  dataSource: any;
  reviewDataForModal: any;

  requestedAppointmentList = [
    // {
    //   name: "John Doe",
    //   rating: 5,
    //   review: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?`,
    // },
    // {
    //   name: "Jason Roy",
    //   rating: 5,
    //   review: `What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?`,
    // },
    // {
    //   name: "Jason Roy",
    //   rating: 5,
    //   review: `What is Lorem Ipsum Lorem Ipsum`,
    // },
  ];
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Optional() public dialogRef: MatDialogRef<RequestedItemsComponent>,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ApiService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiCall(localStorage.getItem("id"));
    // this.dataSource = new MatTableDataSource(this.reviewsList);
  }

  apiCall(ownerId) {
    this.service.get(REQUESTAPPT + ownerId).subscribe((res) => {
      this.requestedAppointmentList = res["result"];
      this.placeTableData();
    });
  }

  private placeTableData() {
    this.dataSource = new MatTableDataSource(this.requestedAppointmentList);
    this.dataSource.sort = this.sort;
    this.ref.detectChanges();
  }

  closeModal() {
    this.dialogRef.close({});
  }

  acceptClicked(selectedListItem) {
    const newDialog = this.dialog.open(SelectTimeSlotsComponent, {
      maxWidth: "40vw",
      width: "40vw",
      maxHeight: "100vh",
      panelClass: "pad-Mnow321",
      data: selectedListItem,
    });

    newDialog.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
    });
  }
}
