import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BarchartComponent } from "./barchart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        BarchartComponent
    ],
    exports: [
        BarchartComponent
    ]
})

export class BarchartModule {}