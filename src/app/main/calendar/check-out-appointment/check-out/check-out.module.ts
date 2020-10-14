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
import { CheckOutComponent } from "./check-out.component";
import { ClientInfoModule } from "app/main/shared-component/client-info/client-info.module";
import { LoaderModule } from "app/loader/loader.module";


@NgModule({
    imports : [
        CommonModule,
        FuseSharedModule,
        MatSharedAngularModule,
        ToastModule,
        NgxSpinnerModule,
        ClientInfoModule,
        LoaderModule
        // OwlDateTimeModule,
        // OwlNativeDateTimeModule,
        // TranslatefilesModule,
        // TimePickerModule,
        // DatePickerModule
    ],
    declarations : [
        CheckOutComponent
    ],
    exports : [
        CheckOutComponent
    ],
    entryComponents : [
        CheckOutComponent
    ]


})

export class CheckOutModule {}