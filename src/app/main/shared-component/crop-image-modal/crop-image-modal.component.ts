import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ApiService } from "app/services/api.service";
import { Translator } from "app/services/translator";

@Component({
  selector: "app-crop-image-modal",
  templateUrl: "./crop-image-modal.component.html",
  styleUrls: ["./crop-image-modal.component.scss"],
})
export class CropImageModalComponent implements OnInit {
  imageChangedEvent: any = "";
  croppedImage: any = "";
  imgURL: string;
  formdataFinal: any;

  constructor(
    public dialogRef: MatDialogRef<CropImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiService,
    private translator: Translator
  ) {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imgURL = event.base64;
    this.formdataFinal = this.getFileTypeBlob(event.base64, "");
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  ngOnInit() {
    console.log(this.data);
  }

  saveImage() {
    const formData: any = new FormData();
    formData.append("photos", this.formdataFinal);
    this._service.postImage("assets/uploadImages", formData).subscribe(
      (res) => {
        // if (!form.value.image) {
        //   form.value.image = "";
        // }
        let imageUrl: any;
        imageUrl = this.translator.imageProductTranslator(res["result"][0]);
        this.dialogRef.close({
          image: imageUrl,
        });
        // this.updateStaffWithImage(form);
      },
      (rej) => {
        console.log("rej", rej);
        this.dialogRef.close({
          image: "",
        });
      }
    );
  }

  getFileTypeBlob(d, imageFileFormat) {
    let file: any;
    let phase1 = d.split(",")[0];
    let phase2 = phase1.split(";")[0];
    let type = phase2.split(":")[1];
    let innerType = type.split("/")[1];
    let blob = this.dataURItoBlob(d);
    file = new File([blob], `${this.randomNameGenerator()}.` + innerType, {
      type: type,
    });
    return file;
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  randomNameGenerator() {
    let length = 9;
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
