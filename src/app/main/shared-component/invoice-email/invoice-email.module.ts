import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { AvatarModule } from 'ng2-avatar';
import { InvoiceEmailComponent } from "./invoice-email.component";

@NgModule({
    imports : [
        CommonModule,
        FuseSharedModule,
        MatSharedAngularModule,
        AvatarModule
    ],
    exports : [
        InvoiceEmailComponent
    ],
    declarations : [
        InvoiceEmailComponent
    ],
    entryComponents : [
        InvoiceEmailComponent
    ]
})

export class InvoiceEmailModule {}