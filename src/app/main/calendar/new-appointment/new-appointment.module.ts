import { NgModule } from "@angular/core";
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
import { newappointment } from "./new-appointment.component";
import { CalendarModule as AngularCalendarModule } from 'angular-calendar';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons/dist';
import { NewClientModule } from "app/main/clients/new-client.module";
import { ClientintakeModule } from "app/main/clients/clientintake.module";


@NgModule({
    imports : [
        CommonModule,
        FuseSharedModule,
        MatSharedAngularModule,
        ToastModule,
        NgxSpinnerModule,
        ClientInfoModule,
        AngularCalendarModule.forRoot(),
        Angular2PromiseButtonModule.forRoot(),
        NewClientModule,
        ClientintakeModule,
        // OwlDateTimeModule,
        // OwlNativeDateTimeModule,
        // TranslatefilesModule,
        TimePickerModule,
        DatePickerModule
    ],
    declarations : [
        newappointment
    ],
    exports : [
        ClientInfoModule,
        newappointment
    ],
    entryComponents : [
        newappointment
    ]


})

export class NewAppointmentModule {}