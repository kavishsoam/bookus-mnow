import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingScreenComponent } from "./loading-screen.component";

@NgModule({

    imports : [
        CommonModule,
    ],
    declarations : [
        LoadingScreenComponent
    ],
    exports : [
        LoadingScreenComponent
    ],

})

export class LoadingScreenModule {}