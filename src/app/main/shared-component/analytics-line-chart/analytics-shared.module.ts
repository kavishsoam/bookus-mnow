import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AnalyticsLineChartComponent } from "./analytics-line-chart.component";
import { AnalyticsPieChartComponent } from "../analytics-pie-chart/analytics-pie-chart.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        AnalyticsLineChartComponent,
        AnalyticsPieChartComponent
    ],
    exports: [
        AnalyticsLineChartComponent,
        AnalyticsPieChartComponent
    ]
})

export class AnalyticsSharedModule {}