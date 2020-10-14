import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SalesPieChartComponent } from "./sales-pie-chart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        SalesPieChartComponent
    ],
    exports: [
        SalesPieChartComponent
    ]
})

export class SalesPieChartModule {}