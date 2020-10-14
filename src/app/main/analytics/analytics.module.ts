import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatMenuModule,
} from '@angular/material';
import { MatTableModule } from '@angular/material/table'
import { HttpClientModule } from '@angular/common/http';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { SalesbyComponent } from './salesby/salesby.component';
import { SalesbyclientComponent } from './salesbyclient/salesbyclient.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SalesbylocationComponent } from './salesbylocation/salesbylocation.component';
import { TranslatefilesModule } from 'app/translate/translatefiles.module';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { AnalyticsSharedModule } from '../shared-component/analytics-line-chart/analytics-shared.module';

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
    component: AnalyticsComponent, // base template component
    children: [
      {
        path: 'salesby',
        component: SalesbyComponent
      },
      {
        path: 'salesbyclient',
        component: SalesbyclientComponent
      },
      {
        path: 'salesbylocation',
        component: SalesbylocationComponent
      }
    ]
  }

];
@NgModule({
  declarations: [
    AnalyticsComponent,
    SalesbyComponent,
    SalesbyclientComponent,
    SalesbylocationComponent,
    AnalyticsDashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    ToastModule,
    NgxSpinnerModule,
    MatRadioModule,
    // Material moment date module
    MatMomentDateModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    FuseProgressBarModule,
    FuseSidebarModule,
    // FuseThemeOptionsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslatefilesModule,
    AnalyticsSharedModule

  ],
  entryComponents: [

  ],
  providers: [],

  exports: [
    AnalyticsComponent
  ]
})
export class AnalyticsModule {
}
