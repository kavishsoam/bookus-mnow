import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { CalendarComponent } from "./calendar.component";
import { ClientInfoModule } from "../shared-component/client-info/client-info.module";
import { BlockedtimeComponent } from "./blockedtime/blockedtime.component";
import { CancelComponent } from "./cancel/cancel.component";
import { CashDrawerComponent } from "./cash-drawer/cash-drawer.component";
import { CheckOutComponent } from "./check-out-appointment/check-out/check-out.component";
import { HistoryAppointmentComponent } from "./history-appointment/history-appointment.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { newappointment } from "./new-appointment/new-appointment.component";
import { ViewAppointmentComponent } from "./view-appointment/view-appointment.component";
import { ToastModule } from "primeng/toast";
import { NgxSpinnerModule } from "ngx-spinner";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { DropDownListModule } from "@syncfusion/ej2-ng-dropdowns";
import {
  ScheduleModule,
  ScheduleAllModule,
} from "@syncfusion/ej2-angular-schedule";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import { enableRipple } from "@syncfusion/ej2-base";
enableRipple(true);
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { duration } from "app/pipe/durationCal";
import { RouterModule } from "@angular/router";
import { TipComponent } from "./check-out-appointment/check-out/tip/tip.component";
import { VoucherComponent } from "./check-out-appointment/check-out/voucher/voucher.component";
import { InvoiceComponent } from "./check-out-appointment/invoice/invoice.component";
import { BlockedtimeModule } from "./blockedtime/blockedtime.module";
import { CancelModule } from "./cancel/cancel.module";
import { CashDrawerModule } from "./cash-drawer/cash-drawer.module";
import { CreateInvoiceModule } from "./create-invoice/create-invoice.module";
import { CheckOutModule } from "./check-out-appointment/check-out/check-out.module";
import { HistoryAppointmentModule } from "./history-appointment/history-appointment.module";
import { NewAppointmentModule } from "./new-appointment/new-appointment.module";
import { TipModule } from "./check-out-appointment/check-out/tip/tip.module";
import { VoucherModule } from "./check-out-appointment/check-out/voucher/voucher.module";
import { ViewAppointmentModule } from "./view-appointment/view-appointment.module";
import { InvoiceModule } from "./check-out-appointment/invoice/invoice.module";
import { TruncatePipe } from "app/pipe/textTruncate";
import { RequestedItemsModule } from "./requested-items/requested-items.module";
// import {ScheduleComponent, GroupModel,EventSettingsModel,DayService,WeekService,WorkWeekService,MonthService,AgendaService,MonthAgendaService,DragAndDropService,ResizeService,ResourceDetails,EventRenderedArgs,PopupOpenEventArgs,WorkHoursModel} from "@syncfusion/ej2-angular-schedule";

const routes = [
  {
    path: "",
    component: CalendarComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FuseSharedModule,
    MatSharedAngularModule,
    RouterModule.forChild(routes),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslatefilesModule,
    NgxSpinnerModule,
    ToastModule,
    DropDownListModule,
    ScheduleModule,
    DropDownButtonModule,
    TimePickerModule,
    DatePickerModule,
    ScheduleAllModule,
    // ClientInfoModule,
    BlockedtimeModule,
    CancelModule,
    CashDrawerModule,
    CheckOutModule,
    CreateInvoiceModule,
    HistoryAppointmentModule,
    NewAppointmentModule,
    TipModule,
    VoucherModule,
    InvoiceModule,
    ViewAppointmentModule,
    RequestedItemsModule,
  ],
  declarations: [
    CalendarComponent,
    // duration,
    // TruncatePipe,

    // BlockedtimeComponent,
    // CancelComponent,
    // CashDrawerComponent,
    // CheckOutComponent,
    // CreateInvoiceComponent,
    // HistoryAppointmentComponent,
    // newappointment,
    // TipComponent,
    // VoucherComponent,
    // InvoiceComponent,
    // ViewAppointmentComponent,
  ],
  exports: [
    CalendarComponent,
    // BlockedtimeComponent,
    // CancelComponent,
    // CashDrawerComponent,
    // CheckOutComponent,
    // CreateInvoiceComponent,
    // HistoryAppointmentComponent,
    // newappointment,
    // ViewAppointmentComponent,
    // InvoiceComponent,
    // VoucherComponent,
    // TipComponent,
  ],
  entryComponents: [
    CalendarComponent,
    // BlockedtimeComponent,
    // CancelComponent,
    // CashDrawerComponent,
    // CheckOutComponent,
    // CreateInvoiceComponent,
    // HistoryAppointmentComponent,
    // newappointment,
    // ViewAppointmentComponent,
    // InvoiceComponent,
    // TipComponent,
    // VoucherComponent
  ],
})
export class CalendarModule {}
