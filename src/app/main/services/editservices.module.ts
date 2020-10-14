import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { ToastModule } from 'primeng/toast';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { EditClient } from "./services.component";

@NgModule({
    imports : [
        CommonModule,
        MatSharedAngularModule,
        ToastModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule
    ],
    declarations : [
        EditClient
    ],
    exports : [
        EditClient
    ],
    entryComponents: [
        EditClient
    ]

})

export class EditservicesModule {}