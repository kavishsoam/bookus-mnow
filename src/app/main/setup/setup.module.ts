import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CalendarSettingsComponent } from "./account-setup/calendar-settings/calendar-settings.component";
import { CompanyDetailsComponent } from "./account-setup/company-details/company-details.component";
import {
  LocationsComponent,
  EditLocations,
} from "./account-setup/locations/locations.component";
import { Angular2PromiseButtonModule } from "angular2-promise-buttons/dist";
import { OnlineBookingSettingsComponent } from "./account-setup/online-booking-settings/online-booking-settings.component";
import {
  ResourcesComponent,
  resourceModal,
} from "./account-setup/resources/resources.component";
import { StaffNotificationsComponent } from "./account-setup/staff-notifications/staff-notifications.component";
import {
  CancellationReasonsComponent,
  AddCancellation,
} from "./client-settings/cancellation-reasons/cancellation-reasons.component";
import { ClientNotificationsComponent } from "./client-settings/client-notifications/client-notifications.component";
import { ReferralSourcesComponent } from "./client-settings/referral-sources/referral-sources.component";
import {
  DiscountTypesComponent,
  AddDiscount,
} from "./point-of-sale/discount-types/discount-types.component";
import { InvoicesComponent } from "./point-of-sale/invoices/invoices.component";
import {
  PaymentTypesComponent,
  AddPayment,
} from "./point-of-sale/payment-types/payment-types.component";
import { SalesSettingsComponent } from "./point-of-sale/sales-settings/sales-settings.component";
import { TaxesComponent } from "./point-of-sale/taxes/taxes.component";
import { SetupComponent } from "./setup.component";
// import { MatTableModule } from '@angular/material/table'
import { HttpClientModule } from "@angular/common/http";
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { ToastModule } from "primeng/toast";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import {
  FuseProgressBarModule,
  FuseSidebarModule,
  FuseThemeOptionsModule,
} from "@fuse/components";
import { LayoutModule } from "app/layout/layout.module";
// import {
//   MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatMenuModule,
// } from '@angular/material';
import { ColorPickerModule } from "ngx-color-picker";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule } from "@fuse/components";
// import { MatTabsModule } from '@angular/material';
import { MainModule } from "../main.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { Ng2TelInputModule } from "ng2-tel-input";
import { AddTaxComponent } from "./point-of-sale/taxes/add-tax/add-tax.component";
// import { MatRadioModule } from '@angular/material/radio';
import { LoyaltyRewardsComponent } from "./point-of-sale/loyalty-rewards/loyalty-rewards.component";
import { PreviewComponent } from "./client-settings/modal/preview/preview.component";
import { GooglePlacesDirective } from "./account-setup/locations/directive/google-places.directive";
import {
  ImageCompressService,
  ResizeOptions,
  ImageUtilityService,
} from "ng2-image-compress";
import { CopyBusinessComponent } from "./point-of-sale/copy-business/copy-business.component";
import { NewBusinessComponent } from "./point-of-sale/new-business/new-business.component";
import { PostBlogComponent } from "./account-setup/post-blog/post-blog.component";
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { LocationSetupComponent } from "./account-setup/locations/location-setup/location-setup.component";
// import {TabViewModule} from 'primeng/tabview';
import { InputSwitchModule } from "primeng/inputswitch";
// import {CheckboxModule} from 'primeng/checkbox';
import { ToggleButtonModule } from "primeng/togglebutton";
import { InputTextModule } from "primeng/inputtext";
import { MaterialElevationDirective } from "app/directive/material-elevation.directive";
import { BlogInfoModalComponent } from "./account-setup/post-blog/blog-info-modal/blog-info-modal.component";
import { BlogAddEditComponent } from "./account-setup/post-blog/blog-add-edit/blog-add-edit.component";
import { BlogCommentComponent } from "./account-setup/blog-comment/blog-comment.component";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";
import { PremiumComponent } from "./account-setup/premium/premium.component";
import { BusinessSaleComponent } from "./account-setup/business-sale/business-sale.component";

const routes = [
  {
    path: "",
    component: SetupComponent,
  },
  {
    path: "calendar-settings",
    component: CalendarSettingsComponent,
  },
  {
    path: "company-details",
    component: CompanyDetailsComponent,
  },
  {
    path: "locations",
    component: LocationsComponent,
  },
  {
    path: "locations/:id",
    component: LocationSetupComponent,
  },
  {
    path: "online-booking-settings",
    component: OnlineBookingSettingsComponent,
  },
  {
    path: "resources",
    component: ResourcesComponent,
  },
  {
    path: "staff-notifications",
    component: StaffNotificationsComponent,
  },
  {
    path: "cancellation-reasons",
    component: CancellationReasonsComponent,
  },
  {
    path: "client-notifications",
    component: ClientNotificationsComponent,
  },
  {
    path: "referral-sources",
    component: ReferralSourcesComponent,
  },
  {
    path: "discount-types",
    component: DiscountTypesComponent,
  },
  {
    path: "invoices",
    component: InvoicesComponent,
  },
  {
    path: "loyalty-rewards",
    component: LoyaltyRewardsComponent,
  },
  {
    path: "payment-types",
    component: PaymentTypesComponent,
  },
  {
    path: "sales-settings",
    component: SalesSettingsComponent,
  },
  {
    path: "taxes",
    component: TaxesComponent,
  },
  {
    path: "post-blog",
    component: PostBlogComponent,
  },
  {
    path: "business-sale",
    component: BusinessSaleComponent,
  },
];
@NgModule({
  declarations: [
    CompanyDetailsComponent,
    LocationsComponent,
    SetupComponent,
    ResourcesComponent,
    CalendarSettingsComponent,
    OnlineBookingSettingsComponent,
    StaffNotificationsComponent,
    PaymentTypesComponent,
    TaxesComponent,
    DiscountTypesComponent,
    SalesSettingsComponent,
    InvoicesComponent,
    ClientNotificationsComponent,
    ReferralSourcesComponent,
    CancellationReasonsComponent,
    EditLocations,
    AddPayment,
    AddDiscount,
    AddCancellation,
    AddTaxComponent,
    resourceModal,
    LoyaltyRewardsComponent,
    PreviewComponent,
    GooglePlacesDirective,
    CopyBusinessComponent,
    NewBusinessComponent,
    PostBlogComponent,
    LocationSetupComponent,
    MaterialElevationDirective,

    BlogInfoModalComponent,
    BlogAddEditComponent,
    BlogCommentComponent,
    PremiumComponent,
    BusinessSaleComponent,
  ],
  imports: [
    Angular2PromiseButtonModule.forRoot(),
    TimePickerModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot(),
    HttpClientModule,
    ToastModule,
    MainModule,
    TriStateCheckboxModule,
    // MatRadioModule,
    // Material moment date module
    // MatMomentDateModule,
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    // MatTableModule,
    // MatCardModule,
    // MatTabsModule,
    // MatMenuModule,
    LayoutModule,
    // MatButtonModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatIconModule,
    // MatInputModule,
    // MatSlideToggleModule,
    // MatToolbarModule,
    // MatTooltipModule, MatButtonModule,
    // MatIconModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatSelectModule,
    ColorPickerModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    // FuseThemeOptionsModule,
    // Material
    // MatButtonModule,
    // MatIconModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatSelectModule,
    NgxSpinnerModule,
    Ng2TelInputModule,
    TranslatefilesModule,
    MatSharedAngularModule,
    InputSwitchModule,
    ToggleButtonModule,
    InputTextModule,
    // TabViewModule,
  ],
  entryComponents: [
    EditLocations,
    AddPayment,
    AddCancellation,
    AddTaxComponent,
    resourceModal,
    AddDiscount,
    PreviewComponent,
    CopyBusinessComponent,
    NewBusinessComponent,
    BlogInfoModalComponent,
    BlogAddEditComponent,
    BlogCommentComponent,
    PremiumComponent,
  ],
  providers: [ImageCompressService, ResizeOptions],

  exports: [
    CompanyDetailsComponent,
    SetupComponent,
    LocationsComponent,
    ResourcesComponent,
    CalendarSettingsComponent,
    OnlineBookingSettingsComponent,
    StaffNotificationsComponent,
    PaymentTypesComponent,
    TaxesComponent,
    DiscountTypesComponent,
    SalesSettingsComponent,
    InvoicesComponent,
    ClientNotificationsComponent,
    ReferralSourcesComponent,
    CancellationReasonsComponent,
    CopyBusinessComponent,
    PostBlogComponent,
    PremiumComponent,
    BusinessSaleComponent,
  ],
})
export class SetupModule {}
