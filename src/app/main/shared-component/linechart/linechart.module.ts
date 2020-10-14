import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LinechartComponent } from "./linechart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        LinechartComponent
    ],
    exports: [
        LinechartComponent
    ]
})

export class LinechartModule {}