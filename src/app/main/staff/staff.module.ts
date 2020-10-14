import { NgModule } from "@angular/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { CommonModule } from "@angular/common";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { RouterModule } from "@angular/router";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { TranslatefilesModule } from "app/translate/translatefiles.module";
import { ToastModule } from "primeng/toast";
import { NgxSpinnerModule } from "ngx-spinner";
import { AppliedFreelancersComponent } from "./applied-freelancers/applied-freelancers.component";
import { AppliedjobsComponent } from "./appliedjobs/appliedjobs.component";
import { CloseDateComponent } from "./close-date/close-date.component";
import { InviteFreelancerComponent } from "./invite-freelancer/invite-freelancer.component";
import { NewjobComponent } from "./newjob/newjob.component";
import { staffEditorProfile } from "./staffEditProfile/staffEditProfile.component";
import { StaffModal } from "./staffModel/staffModal.component";
import { staffSalary } from "./staffSalary/staffSalary.component";
import { StaffComponent } from "./staff.component";
import { SharedPipeModule } from "app/pipe/shared-pipe.module";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { Ng2TelInputModule } from "ng2-tel-input";
import { AvatarModule } from "ng2-avatar";
import { Angular2PromiseButtonModule } from "angular2-promise-buttons/dist";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StaffReviewsComponent } from "./staff-reviews/staff-reviews.component";
import { SalaryConfirmComponent } from "./salary-confirm/salary-confirm.component";
import { MAT_DATE_FORMATS } from "@angular/material";
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { AllDirectiveModule } from "app/directive/all-directive.module";
import { ImageCropperModule } from "ngx-image-cropper";
import { ColorPickerModule } from "ngx-color-picker";
import { CropImageModalModule } from "../shared-component/crop-image-modal/crop-image-modal.module";

const routes = [
  {
    path: "",
    component: StaffComponent,
  },
  {
    path: "jobs",
    component: AppliedjobsComponent,
  },
  {
    path: "freelancer",
    component: AppliedFreelancersComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuseSharedModule,
    MatSharedAngularModule,
    RouterModule.forChild(routes),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslatefilesModule,
    NgxSpinnerModule,
    ToastModule,
    SharedPipeModule,
    TimePickerModule,
    DatePickerModule,
    Ng2TelInputModule,
    AvatarModule,
    AllDirectiveModule,
    ImageCropperModule,
    CropImageModalModule,
    // CustomeDateAdaptorModule,
    Angular2PromiseButtonModule.forRoot(),
  ],
  declarations: [
    AppliedFreelancersComponent,
    AppliedjobsComponent,
    CloseDateComponent,
    InviteFreelancerComponent,
    NewjobComponent,
    staffEditorProfile,
    StaffModal,
    staffSalary,
    StaffComponent,
    StaffReviewsComponent,
    SalaryConfirmComponent,
  ],
  exports: [
    AppliedFreelancersComponent,
    AppliedjobsComponent,
    CloseDateComponent,
    InviteFreelancerComponent,
    NewjobComponent,
    staffEditorProfile,
    StaffModal,
    staffSalary,
    StaffComponent,
    StaffReviewsComponent,
    SalaryConfirmComponent,
  ],
  entryComponents: [
    CloseDateComponent,
    InviteFreelancerComponent,
    NewjobComponent,
    staffEditorProfile,
    StaffModal,
    staffSalary,
    SalaryConfirmComponent,
  ],
})
export class StaffModule {}
