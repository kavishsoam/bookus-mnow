import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { FuseSharedModule } from '@fuse/shared.module';
import { PolicyComponent } from './policy.component';
const routes = [
  {
    path: '',
    component: PolicyComponent
  }
];
@NgModule({
  declarations: [
    PolicyComponent
  ],
  imports: [
    Angular2PromiseButtonModule.forRoot(),
    RouterModule.forChild(routes),
    ToastModule,
    FuseSharedModule,
    MatProgressButtonsModule.forRoot()
  ],
  providers: [MessageService],
  exports: [
    PolicyComponent
  ]
})
export class PolicyModule { }
