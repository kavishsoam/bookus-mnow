import { NgModule } from "@angular/core";
import { FormNumberOnlyDirective } from "./form-number-only.directive";
import { FormTextOnlyDirective } from "./form-text-only-directive";
import { FuseSharedModule } from "@fuse/shared.module";

@NgModule({
    declarations:[
        FormNumberOnlyDirective,
        FormTextOnlyDirective
    ],
    imports: [
        FuseSharedModule
    ],
    exports :[
        FormNumberOnlyDirective,
        FormTextOnlyDirective
    ],

})

export class AllDirectiveModule {

}