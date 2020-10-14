import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ClientInfoModule } from "app/main/shared-component/client-info/client-info.module";
import { ViewAppointmentComponent } from "./view-appointment.component";


@NgModule({
    imports : [
        CommonModule,
        FuseSharedModule,
        MatSharedAngularModule,
        ToastModule,
        NgxSpinnerModule,
        ClientInfoModule
        // OwlDateTimeModule,
        // OwlNativeDateTimeModule,
        // TranslatefilesModule,
        // TimePickerModule,
        // DatePickerModule
    ],
    declarations : [
        ViewAppointmentComponent
    ],
    exports : [
        ViewAppointmentComponent
    ],
    entryComponents : [
        ViewAppointmentComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],


})

export class ViewAppointmentModule {}