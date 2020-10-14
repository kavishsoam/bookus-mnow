import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { ToastModule } from "primeng/toast";
import { NgxSpinnerModule } from "ngx-spinner";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { MatCurrencyFormatModule } from "mat-currency-format";
import { InputSwitchModule } from "primeng/inputswitch";
import { RequestedItemsComponent } from "./requested-items.component";
import { SelectTimeSlotsModule } from "../select-time-slots/select-time-slots.module";

@NgModule({
  imports: [
    CommonModule,
    FuseSharedModule,
    MatSharedAngularModule,
    ToastModule,
    NgxSpinnerModule,
    MatCurrencyFormatModule,
    SelectTimeSlotsModule,
    InputSwitchModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    // TranslatefilesModule,
    // TimePickerModule,
    // DatePickerModule
  ],
  declarations: [RequestedItemsComponent],
  exports: [RequestedItemsComponent],
  entryComponents: [RequestedItemsComponent],
})
export class RequestedItemsModule {}
