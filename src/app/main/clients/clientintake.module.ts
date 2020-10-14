import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { SignatureFieldModule } from "./signature-field/signature-field.module";
import { ClientIntakeForm } from "./clients.component";
import { ToastModule } from 'primeng/toast';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
    imports : [
        CommonModule,
        MatSharedAngularModule,
        SignatureFieldModule,
        ToastModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule
    ],
    declarations : [
        ClientIntakeForm
    ],
    exports : [
        ClientIntakeForm
    ],
    entryComponents: [
        ClientIntakeForm
    ]

})

export class ClientintakeModule {}