import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FuseSharedModule } from "../../@fuse/shared.module";
import { FuseSearchBarModule } from "@fuse/components";
import { HomeComponent } from "../main/home/home.component";
// import { AnalyticsComponent } from '../main/analytics/analytics.component';
// import { CalendarComponent } from '../main/calendar/calendar.component';
// import { ClientsComponent, AddNewClient, ClientIntakeForm } from '../main/clients/clients.component';
// import { SignatureFieldComponent } from './clients/signature-field/signature-field.component'
import { MessagesComponent } from "../main/messages/messages.component";
import { OnlinebookingComponent } from "../main/onlinebooking/onlinebooking.component";
// import { SalesComponent } from '../main/sales/sales.component';
// import { DropDownListModule } from '@syncfusion/ej2-ng-dropdowns';
import { AvatarModule } from "ng2-avatar";
// import { ServicesComponent, EditClient } from '../main/services/services.component';
import { MatTableModule } from "@angular/material/table";
import { MatBadgeModule } from "@angular/material/badge";
// import {
//   MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatGridListModule, MatCardModule
// } from '@angular/material';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ColorPickerModule } from "ngx-color-picker";
// import { CalendarModule as AngularCalendarModule } from 'angular-calendar';
import { FuseConfirmDialogModule } from "@fuse/components";

import { FakeDbService } from "app/fake-db/fake-db.service";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";

import { MatTabsModule } from "@angular/material";
import { MatNativeDateModule } from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ScheduleModule } from "@syncfusion/ej2-angular-schedule";
import { SignaturePadModule } from "angular2-signaturepad";
import { DropDownButtonModule } from "@syncfusion/ej2-angular-splitbuttons";
import { enableRipple } from "@syncfusion/ej2-base";
enableRipple(true);
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { NumberOnlyDirective } from "app/directive/number.directive";
import { CalendarModule } from "primeng/calendar";
// import { MatListModule } from '@angular/material/list';
import { MySettingsComponent } from "./my-settings/my-settings.component";
// import { LoadingScreenComponent } from './loader/loading-screen.component';
// import { ServicesGroupComponent } from './services/services-group/services-group.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatExpansionModule } from "@angular/material/expansion";
import { PageUnderConstructComponent } from "./shared-component/page-under-construct/page-under-construct.component";

import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MatMenuModule } from "@angular/material/menu";
import { DragDropModule } from "@angular/cdk/drag-drop";
// import { duration } from 'app/pipe/durationCal';
// import { ClientprofileComponent } from './clients/clientprofile/clientprofile.component';
// import { ClientIntakeListComponent } from './clients/client-intake-list/client-intake-list.component';
import { ProgressSpinnerModule } from "primeng/progressspinner";
// import { CheckOutComponent } from './calendar/check-out-appointment/check-out/check-out.component';
import { NgxSpinnerModule } from "ngx-spinner";
// import { TipComponent } from './calendar/check-out-appointment/check-out/tip/tip.component';
import { Ng2TelInputModule } from "ng2-tel-input";
// import { ClientInfoComponent } from './shared-component/client-info/client-info.component';
// import { InvoiceComponent } from './calendar/check-out-appointment/invoice/invoice.component';
// import { CancelComponent } from './calendar/cancel/cancel.component';
// import { VoucherComponent } from './calendar/check-out-appointment/check-out/voucher/voucher.component';
import { Angular2PromiseButtonModule } from "angular2-promise-buttons/dist";
// import { MatStepperModule } from '@angular/material/stepper';
// import { CreateInvoiceComponent } from './calendar/create-invoice/create-invoice.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ClientNotifComponent } from "./shared-component/client-notif/client-notif.component";
// import { SuppliersComponent } from './inventory/suppliers/suppliers.component';
import { MatSortModule } from "@angular/material/sort";
// import { ProductComponent } from './inventory/product/product.component';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
// import { BlockedtimeComponent } from './calendar/blockedtime/blockedtime.component';
// import { TransferComponent } from './inventory/order/transfer/transfer.component';
import {
  ImageCompressService,
  ResizeOptions,
  ImageUtilityService,
} from "ng2-image-compress";
// import { newappointment } from './calendar/new-appointment/new-appointment.component';
// import { ViewAppointmentComponent } from './calendar/view-appointment/view-appointment.component';
// import { StaffComponent } from './staff/staff.component';
// import { StaffModal } from './staff/staffModel/staffModal.component';
// import { staffEditorProfile } from './staff/staffEditProfile/staffEditProfile.component';
// import { staffSalary } from './staff/staffSalary/staffSalary.component';
import { LoaderModule } from "app/loader/loader.module";
// import { CloseDateComponent } from './staff/close-date/close-date.component';
import { AwesomeTooltipComponent } from "./tooltip/tooltip.component";
import { OverlayModule } from "@angular/cdk/overlay";
import { AwesomeTooltipDirective } from "./tooltip/tooltip.directive";
import { ReviewsComponent } from "./reviews/reviews.component";
import { VoucherCheckoutSearchClientComponent } from "./shared-component/voucher-checkout-search-client/voucher-checkout-search-client.component";
// import { StaffFilter } from 'app/pipe/staffFilter';
import { LinechartComponent } from "./shared-component/linechart/linechart.component";
// import { BarchartComponent } from './shared-component/barchart/barchart.component';
// import { ProductChartComponent } from './shared-component/product-chart/product-chart.component';
import { ServiceChartComponent } from "./shared-component/service-chart/service-chart.component";
// import { SalesPieChartComponent } from './shared-component/sales-pie-chart/sales-pie-chart.component';
// import { HistoryAppointmentComponent } from './calendar/history-appointment/history-appointment.component';
// import { TruncatePipe } from 'app/pipe/textTruncate';
import { HighlightDirective } from "app/directive/hover.directive";
import { TooltipDirective } from "app/directive/tooltip.directive";
// import { InvoiceEmailComponent } from './shared-component/invoice-email/invoice-email.component';
// import { NewjobComponent } from './staff/newjob/newjob.component';
// import { FamilyandfriendComponent } from './clients/familyandfriend/familyandfriend.component';
import { ImageUploaderModule } from "ngx-image-uploader";
// import { InviteFreelancerComponent } from './staff/invite-freelancer/invite-freelancer.component';
// import { MaterialAnimatedIconComponent } from './shared-component/material-animated-icon/material-animated-icon.component';
// import { AppliedjobsComponent } from './staff/appliedjobs/appliedjobs.component';
// import { AppliedFreelancersComponent } from './staff/applied-freelancers/applied-freelancers.component';
// import { workingtime } from 'app/pipe/workingtime';
// import { CashDrawerComponent } from './calendar/cash-drawer/cash-drawer.component'
import { MatCurrencyFormatModule } from "mat-currency-format";
// import { smallTruncatePipe } from 'app/pipe/smallTruncate';
import {
  TranslateService,
  TRANSLATION_PROVIDERS,
  TranslatePipe,
} from "app/translate";
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { CalendarSettingModalComponent } from './calendar/calendar-setting-modal/calendar-setting-modal.component';
// import { MaterialElevationDirective } from 'app/directive/material-elevation.directive';
// import { HomeModule } from './home/home.module';
// import { SalesbyComponent } from './analytics/salesby/salesby.component';
// import { AnalyticsModule } from './analytics/analytics.module';

const routes = [
  {
    path: "home",
    // loadChildren: () => import('./home/home.module').then(mod=>mod.HomeModule),
    loadChildren: "./home/home.module#HomeModule",
  },
  {
    path: "analytics",
    // loadChildren: () => import('./analytics/analytics.module').then(module=>module.AnalyticsModule)
    loadChildren: "./analytics/analytics.module#AnalyticsModule",
  },
  {
    path: "calendar",
    // loadChildren: () => import('./calendar/calendar.module').then(module => module.CalendarModule)
    loadChildren: "./calendar/calendar.module#CalendarModule",
  },
  {
    path: "clients",
    // loadChildren: () => import('./clients/clients.module').then(module=>module.ClientsModule)
    loadChildren: "./clients/clients.module#ClientsModule",
  },
  {
    path: "inventory",
    loadChildren: "./inventory/inventory.module#InventoryModule",
  },
  // {
  //   path: 'my-settings',
  //   component: MySettingsComponent
  // },
  // {
  //   path: 'reviews',
  //   component: MessagesComponent
  // },
  // {
  //   path: 'onlinebooking',
  //   component: OnlinebookingComponent
  // },
  {
    path: "sales",
    // loadChildren: ()=>import('./sales/sales.module').then(mod=> mod.SalesModule)
    loadChildren: "./sales/sales.module#SalesModule",
  },
  {
    path: "services",
    // loadChildren: () => import('./services/services.module').then(mod=> mod.ServicesModule)
    loadChildren: "./services/services.module#ServicesModule",
  },
  {
    path: "staff",
    // loadChildren: () => import('./staff/staff.module').then(mod=> mod.StaffModule)
    loadChildren: "./staff/staff.module#StaffModule",
  },
  // {
  // path: 'staff/jobs',
  // component: AppliedjobsComponent
  // },
  // {
  // path: 'staff/freelancer',
  // component: AppliedFreelancersComponent
  // },
  {
    path: "setup",
    // loadChildren: () =>  import('./setup/setup.module').then(mod=>mod.SetupModule)
    loadChildren: "./setup/setup.module#SetupModule",
  },
  {
    path: "reviews/:id",
    component: ReviewsComponent,
  },
  // {
  //     path: 'privacy',
  //     loadChildren: './privacy/privacy.module#PrivacyModule'
  // }
];
@NgModule({
  declarations: [
    // HomeComponent,
    // ClientIntakeListComponent,
    // CalendarComponent,
    // AnalyticsComponent,
    // ClientsComponent,
    MessagesComponent,
    OnlinebookingComponent,
    // SalesComponent,
    // ServicesComponent,
    // StaffComponent,
    // AddNewClient,
    // ClientIntakeForm,
    // SignatureFieldComponent,
    // EditClient,
    // StaffModal,
    // staffEditorProfile,
    // staffSalary,
    // newappointment,
    NumberOnlyDirective,
    MySettingsComponent,
    // LoadingScreenComponent,
    // ServicesGroupComponent,
    PageUnderConstructComponent,
    // ViewAppointmentComponent,
    // ClientprofileComponent,
    // duration,
    // CheckOutComponent,
    // TipComponent,
    // ClientInfoComponent,
    // InvoiceComponent,
    // CancelComponent,
    // VoucherComponent,
    // CreateInvoiceComponent,
    ClientNotifComponent,
    // SuppliersComponent,
    // ProductComponent,
    // BlockedtimeComponent,
    // TransferComponent,
    // CloseDateComponent,
    AwesomeTooltipDirective,
    AwesomeTooltipComponent,
    ReviewsComponent,
    VoucherCheckoutSearchClientComponent,
    CalendarSettingModalComponent,

    // StaffFilter,
    // LinechartComponent,
    // BarchartComponent,
    // ProductChartComponent,
    ServiceChartComponent,
    // SalesPieChartComponent,
    // HistoryAppointmentComponent,
    // TruncatePipe,
    // smallTruncatePipe,
    HighlightDirective,
    TooltipDirective,
    CalendarSettingModalComponent,

    // InvoiceEmailComponent,
    // NewjobComponent,
    // FamilyandfriendComponent,
    // InviteFreelancerComponent,
    // MaterialAnimatedIconComponent,
    // AppliedjobsComponent,
    // AppliedFreelancersComponent,
    // workingtime,
    // CashDrawerComponent
  ],
  imports: [
    // MatStepperModule,
    MatBadgeModule,
    MatCurrencyFormatModule,
    MatButtonToggleModule,

    // Angular2PromiseButtonModule.forRoot(),
    DragDropModule,
    DropdownModule,
    DialogModule,
    MatExpansionModule,
    NgxChartsModule,
    // SignaturePadModule,
    ToastModule,
    CommonModule,
    MatTableModule,
    // DropDownListModule,
    MatTabsModule,
    FuseSearchBarModule,
    AvatarModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot(),
    FuseSharedModule,
    // MatIconModule,
    // MatCardModule,
    // DropDownButtonModule,
    TimePickerModule,
    DatePickerModule,
    // MatButtonModule,
    Ng2TelInputModule,
    TranslatefilesModule,
    InMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    // MatDatepickerModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatIconModule,
    // MatInputModule,
    // MatSelectModule,
    FuseSearchBarModule,
    // MatCheckboxModule,
    // MatRadioModule,
    // MatSlideToggleModule,
    // MatToolbarModule,
    // MatTooltipModule,
    // MatGridListModule,
    MatSharedAngularModule,
    // AngularCalendarModule.forRoot(),
    ColorPickerModule,
    FuseConfirmDialogModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    // ScheduleModule,
    // CalendarModule,
    // MatListModule,
    MatMenuModule,
    ProgressSpinnerModule,
    NgxSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSortModule,
    NgxMatSelectSearchModule,
    LoaderModule,
    OverlayModule,
    ImageUploaderModule,
    // HomeModule
  ],
  entryComponents: [
    // ClientsComponent,
    // AddNewClient,
    // InviteFreelancerComponent,
    // EditClient,
    // StaffModal,
    // staffEditorProfile,
    // staffSalary,
    // CalendarComponent,
    // newappointment,
    // ClientIntakeForm,
    // ServicesGroupComponent,
    // ViewAppointmentComponent,
    // ClientIntakeListComponent,
    // CheckOutComponent,
    // TipComponent,
    // InvoiceComponent,
    // CancelComponent,
    // VoucherComponent,
    // CreateInvoiceComponent,
    // SuppliersComponent,
    // ProductComponent,
    // BlockedtimeComponent,
    // TransferComponent,
    // CloseDateComponent,
    AwesomeTooltipComponent,
    CalendarSettingModalComponent,

    // HistoryAppointmentComponent,
    // NewjobComponent,
    // FamilyandfriendComponent,
    // CashDrawerComponent
  ],
  exports: [
    // HomeComponent,
    // AnalyticsComponent,
    // CalendarComponent,
    // ClientsComponent,
    MessagesComponent,
    OnlinebookingComponent,
    CalendarSettingModalComponent,
    // LoadingScreenComponent,
    // SalesComponent,
    // ServicesComponent,
    // StaffComponent,
    PageUnderConstructComponent,
    ClientNotifComponent,
    ReviewsComponent,
    // MaterialAnimatedIconComponent
  ],

  providers: [
    MessageService,
    CalendarModule,
    ImageCompressService,
    ResizeOptions,
    TRANSLATION_PROVIDERS,
    TranslateService,
  ],
})
export class MainModule {}
