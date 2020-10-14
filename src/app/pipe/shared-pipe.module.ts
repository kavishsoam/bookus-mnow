import { NgModule } from "@angular/core";
import { smallTruncatePipe } from "./smallTruncate";
import { StaffFilter } from "./staffFilter";
import { TruncatePipe } from "./textTruncate";
import { workingtime } from "./workingtime";
import { duration } from "./durationCal";

@NgModule({
    imports : [

    ],
declarations : [
    duration,
    smallTruncatePipe,
    StaffFilter,
    TruncatePipe,
    workingtime
],
exports : [
    duration,
    smallTruncatePipe,
    StaffFilter,
    TruncatePipe,
    workingtime
]
})

export class SharedPipeModule {}