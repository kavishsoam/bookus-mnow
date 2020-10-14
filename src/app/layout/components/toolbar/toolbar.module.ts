import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TranslatefilesModule } from 'app/translate/translatefiles.module';
import { AvatarModule } from 'ng2-avatar';
// import { TranslatePipe }   from '../../../translate/translate.pipe';
@NgModule({
    declarations: [
        ToolbarComponent,
        // TranslatePipe
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSearchBarModule,
        // FuseShortcutsModule,
        MatSlideToggleModule,
        TranslatefilesModule,
        AvatarModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
