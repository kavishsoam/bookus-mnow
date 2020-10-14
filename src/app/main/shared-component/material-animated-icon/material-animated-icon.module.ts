import { NgModule } from "@angular/core";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";
import { CommonModule } from "@angular/common";
import { MaterialAnimatedIconComponent } from "./material-animated-icon.component";


@NgModule ({
imports :[
    CommonModule,
    MatSharedAngularModule,
],
declarations: [
    MaterialAnimatedIconComponent,

],
exports : [
    MaterialAnimatedIconComponent,

]
})

export class MaterialAnimatedIconModule {}