import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductChartComponent } from "./product-chart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ProductChartComponent
    ],
    exports: [
        ProductChartComponent
    ]
})

export class ProductChartModule {}