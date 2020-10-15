import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { AvatarModule } from "ng2-avatar";
import { FuseModule } from "@fuse/fuse.module";
import {
  FuseProgressBarModule,
  FuseSidebarModule,
  FuseThemeOptionsModule,
} from "@fuse/components";
import { fuseConfig } from "app/fuse-config";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { RouterModule, Routes } from "@angular/router";
import // MatButtonModule, MatDatepickerModule, MatButton, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule
"@angular/material";
import { ColorPickerModule } from "ngx-color-picker";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule } from "@fuse/components";
import { FakeDbService } from "app/fake-db/fake-db.service";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { ModalModule } from "ngx-bootstrap";
import { ApiService } from "./services/api.service";
import { InterceptorService } from "./interceptor/interceptor.service";
import { AuthServiceService } from "./interceptor/auth-service.service";
import { CalendarModule } from "primeng/calendar";
import { Ng2TelInputModule } from "ng2-tel-input";
import { AuthGuard } from "./services/auth-guard.service";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TRANSLATION_PROVIDERS } from "../app/translate/translation";
import { TranslateService } from "../app/translate/translate.service";
import { MatSharedAngularModule } from "./shared/mat-shared-angular/mat-shared-angular.module";


// import { AuthGuard } from './services/auth-guard.service';
const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "main/home",
    pathMatch: "full",
  },
  {
    path: "main",
    loadChildren: "../app/main/main.module#MainModule",
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: "../app/authentication/auth.module#AuthModule",
  },
  {
    path: "privacy",
    loadChildren: "../app/policy/policy.module#PolicyModule",
  },
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot(),
    ModalModule.forRoot(),
    AvatarModule.forRoot(),
    // Material moment date module
    MatMomentDateModule,
    // Material
    // MatButtonModule,
    // MatIconModule,
    // MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    // NgxChartsModule,
    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    // FuseThemeOptionsModule,
    // App modules
    LayoutModule,
    // MatButtonModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatIconModule,
    // MatInputModule,
    // MatSlideToggleModule,
    // MatToolbarModule,
    // MatTooltipModule,
    MatSharedAngularModule,
    ColorPickerModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    CalendarModule,
    Ng2TelInputModule,
    InMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    ApiService,
    AuthServiceService,
    HttpClientModule,
    AuthGuard,
    TRANSLATION_PROVIDERS,
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
