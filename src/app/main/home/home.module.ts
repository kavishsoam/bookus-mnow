import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home.component";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";

import { LinechartModule } from "../shared-component/linechart/linechart.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { SalesPieChartModule } from "../shared-component/sales-pie-chart/sales-pie-chart.module";
import { ProductChartModule } from "../shared-component/product-chart/product-chart.module";
import { BarchartModule } from "../shared-component/barchart/barchart.module";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from "@angular/router";
import { NgxSpinnerModule } from 'ngx-spinner';


const routes = [
    // {
    //   path: '',
    //   component: AnalyticsComponent
    // },
    // {
    //   path: 'salesby',
    //   component: SalesbyComponent
    // },
    // {
    //   path: 'salesbyclient',
    //   component: SalesbyclientComponent
    // }
  
    {
      path: '',
      component: HomeComponent, // base template component
    //   children: [
        // {
        //   path: '/home',
        //   component: HomeComponent
        // },
        // {
        //     path: '/',
        //     component: HomeComponent
        //   },
    //     // {
    //     //   path: 'salesbyclient',
    //     //   component: SalesbyclientComponent
    //     // },
    //     // {
    //     //   path: 'salesbylocation',
    //     //   component: SalesbylocationComponent
    //     // }
    //   ]
    }
  
  ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MatSharedAngularModule,
        LinechartModule,
        SalesPieChartModule,
        ProductChartModule,
        BarchartModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TranslatefilesModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        NgxSpinnerModule
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
        HomeComponent
    ]
})

export class HomeModule {}