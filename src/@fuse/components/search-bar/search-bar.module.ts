import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { FuseSearchBarComponent } from './search-bar.component';
import { SharedModule } from 'primeng/components/common/shared';
// import { SearchComponentComponent } from 'app/shared/search-component/search-component.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSharedAngularModule } from 'app/shared/mat-shared-angular/mat-shared-angular.module';

@NgModule({
    declarations: [
        FuseSearchBarComponent,
        // SearchComponentComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatSharedAngularModule,
        // MatButtonModule,
        // MatIconModule,
        SharedModule,
        // MatFormFieldModule,
        // MatInputModule,
        // MatRippleModule,
        FuseSharedModule
    ],
    entryComponents: [
        // SearchComponentComponent
    ],
    exports: [
        FuseSearchBarComponent
    ]
})
export class FuseSearchBarModule {
}
