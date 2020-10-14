import { NgModule } from "@angular/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FuseProgressBarModule, FuseSidebarModule, } from '@fuse/components';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from "@angular/router";
import { ServicesComponent, EditClient } from "./services.component";
import { ServicesGroupComponent } from "./services-group/services-group.component";
import { EditservicesModule } from "./editservices.module";
import { CommonModule } from "@angular/common";
import { AllDirectiveModule } from "app/directive/all-directive.module";

const routes = [
    {
        path: '',
        component : ServicesComponent
    }
]

@NgModule({

        imports : [
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MatSharedAngularModule,
            OwlDateTimeModule,
            OwlNativeDateTimeModule,
            TranslatefilesModule,
            ToastModule,
            NgxSpinnerModule,
            EditservicesModule,
            AllDirectiveModule
            // FuseProgressBarModule,
            // FuseSidebarModule
        ],
        declarations : [
            ServicesComponent,
            ServicesGroupComponent
        ],
        exports: [
            ServicesComponent,
            ServicesGroupComponent
        ],
        entryComponents : [
            ServicesGroupComponent
        ]
        
})

export class ServicesModule {}