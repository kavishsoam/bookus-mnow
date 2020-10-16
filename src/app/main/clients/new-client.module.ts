import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { AddNewClient } from "./clients.component";
import { ToastModule } from 'primeng/toast';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons/dist';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SharedModule } from "primeng/components/common/shared";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ImageCropperModule } from "ngx-image-cropper";
import { MatSliderModule } from "@angular/material";

@NgModule({
    imports : [
        CommonModule,
        MatSharedAngularModule,
        ToastModule,
        Angular2PromiseButtonModule.forRoot(),
        Ng2TelInputModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        ImageCropperModule,
        MatSliderModule
        
    ],
    declarations : [
        AddNewClient
    ],
    exports : [
        AddNewClient
    ],
    entryComponents: [
        AddNewClient
    ]
})

export class NewClientModule {}