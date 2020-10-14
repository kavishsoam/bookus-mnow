import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { AvatarModule } from 'ng2-avatar';
import { ClientInfoComponent } from "./client-info.component";
import { InvoiceEmailModule } from "../invoice-email/invoice-email.module";
import { TruncatePipe } from "app/pipe/textTruncate";
import { duration } from "app/pipe/durationCal";
import { smallTruncatePipe } from "app/pipe/smallTruncate";
import { SharedPipeModule } from "app/pipe/shared-pipe.module";

@NgModule({
    imports : [
        CommonModule,
        FuseSharedModule,
        MatSharedAngularModule,
        AvatarModule,
        InvoiceEmailModule,
        SharedPipeModule
    ],
    declarations : [
        ClientInfoComponent,
        // TruncatePipe,
        // smallTruncatePipe,
        // duration
    ],
    exports : [
        ClientInfoComponent
    ]
})

export class ClientInfoModule {}