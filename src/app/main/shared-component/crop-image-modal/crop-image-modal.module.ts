import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CropImageModalComponent } from "./crop-image-modal.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { SharedModule } from "app/shared/shared.module";
import { MatSharedAngularModule } from "app/shared/mat-shared-angular/mat-shared-angular.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperModule,
    SharedModule,
    MatSharedAngularModule,
  ],
  declarations: [CropImageModalComponent],
  exports: [CropImageModalComponent],
  entryComponents: [CropImageModalComponent],
})
export class CropImageModalModule {}
