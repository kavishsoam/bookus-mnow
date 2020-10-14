import { NgModule } from "@angular/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FuseProgressBarModule, FuseSidebarModule, } from '@fuse/components';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from "@angular/router";

import { CommonModule } from "@angular/common";
import { AllDirectiveModule } from "app/directive/all-directive.module";
import { InventoryComponent } from './inventory.component'
import { TransferComponent } from "./order/transfer/transfer.component";
import { ProductComponent } from "./product/product.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { OrderCreateComponent } from './order/order-create/order-create.component';
import { CreateBrandComponent } from './brand/create-brand/create-brand.component';
import { SharedModule } from "app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes = [
    {
        path: '',
        component : InventoryComponent
    }
]

@NgModule({

        imports : [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MatSharedAngularModule,
            OwlDateTimeModule,
            OwlNativeDateTimeModule,
            TranslatefilesModule,
            ToastModule,
            NgxSpinnerModule,
            AllDirectiveModule
        ],
        declarations : [
    InventoryComponent,
    SuppliersComponent,
    ProductComponent,
    TransferComponent,
    OrderCreateComponent,
    CreateBrandComponent
        ],
        exports: [
            InventoryComponent,
        ],
        entryComponents : [
            SuppliersComponent,
            ProductComponent,
            TransferComponent,
            OrderCreateComponent,
            CreateBrandComponent
        ]
})

export class InventoryModule {}