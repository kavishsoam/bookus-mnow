import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from "@angular/router";
import { ClientsComponent, AddNewClient } from "./clients.component";
import { ClientIntakeListComponent } from "./client-intake-list/client-intake-list.component";
import { ClientprofileComponent } from "./clientprofile/clientprofile.component";
import { FamilyandfriendComponent } from "./familyandfriend/familyandfriend.component";
// import { SignatureFieldComponent } from "./signature-field/signature-field.component";
import { ClientintakeModule } from "./clientintake.module";
import { NewClientModule } from "./new-client.module";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingScreenModule } from "../loader/loding-screen.module";
import { AvatarModule } from 'ng2-avatar';
import { ImageUploaderModule } from 'ngx-image-uploader';
import { MaterialAnimatedIconModule } from "../shared-component/material-animated-icon/material-animated-icon.module";
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SoapComponent } from "./soap/soap.component";
import { ImageMapModule } from "../image-map/image-map.module";
import { BodyPointModalComponent } from "./body-point-modal/body-point-modal.component";
import {SelectButtonModule} from 'primeng/selectbutton';
import { IouListComponent } from "./iou-list/iou-list.component";


const routes = [

    {
      path: '',
      component: ClientsComponent, // base template component
    },
    {
        path: ':id',
        component: ClientprofileComponent
      }
  
  ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MatSharedAngularModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TranslatefilesModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        ClientintakeModule,
        NewClientModule,
        ClientintakeModule,
        ToastModule,
        NgxSpinnerModule,
        LoadingScreenModule,
        AvatarModule,
        ImageUploaderModule,
        MaterialAnimatedIconModule,
        Ng2TelInputModule,
        ImageMapModule,
        SelectButtonModule

    ],
    declarations: [
        ClientsComponent,
        ClientIntakeListComponent,
        ClientprofileComponent,
        FamilyandfriendComponent,
        SoapComponent,
        BodyPointModalComponent,
        IouListComponent
        // SignatureFieldComponent,
        
    ],
    exports: [
        ClientsComponent,
        ClientIntakeListComponent,
        ClientprofileComponent,
        FamilyandfriendComponent,
        BodyPointModalComponent,
        IouListComponent
        // SignatureFieldComponent,
    ],
    entryComponents: [
        ClientsComponent,
        FamilyandfriendComponent,
        ClientIntakeListComponent,
        BodyPointModalComponent
    ]
})

export class ClientsModule {}