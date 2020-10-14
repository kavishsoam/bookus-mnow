import { NgModule } from "@angular/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { SalesComponent } from "./sales.component";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FuseProgressBarModule, FuseSidebarModule, } from '@fuse/components';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from "@angular/router";

const routes = [
    {
        path: '',
        component : SalesComponent
    }
]

@NgModule({

        imports : [
            RouterModule.forChild(routes),
            FuseSharedModule,
            MatSharedAngularModule,
            OwlDateTimeModule,
            OwlNativeDateTimeModule,
            TranslatefilesModule,
            ToastModule,
            NgxSpinnerModule,
            // FuseProgressBarModule,
            // FuseSidebarModule
        ],
        declarations : [
            SalesComponent
        ],
        exports: [
            SalesComponent
        ]
})

export class SalesModule {}