import { NgModule } from "@angular/core";
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureFieldComponent } from "./signature-field.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
@NgModule({

    imports : [
        CommonModule,
        FormsModule,
        SignaturePadModule
    ],
    declarations : [
        SignatureFieldComponent
    ],
    exports : [
        SignatureFieldComponent
    ]

})

export class SignatureFieldModule {}