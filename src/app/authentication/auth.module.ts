import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import {
//     MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
// } from '@angular/material';
import { FuseSharedModule } from '../../@fuse/shared.module';
import { ForgotPasswordComponent } from '../authentication/forgot-password/forgot-password.component';
import { LoginComponent } from '../authentication/login/login.component';
import { RegisterComponent } from '../authentication/register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import {RatingModule} from 'primeng/rating';
import { AllDirectiveModule } from 'app/directive/all-directive.module';

import { MatSharedAngularModule } from 'app/shared/mat-shared-angular/mat-shared-angular.module';

const routes = [
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },
    {
        path : 'review',
        component: CustomerReviewComponent
    }
];
@NgModule({
    declarations: [
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        CustomerReviewComponent
    ],
    imports: [
        Angular2PromiseButtonModule.forRoot(),
        RouterModule.forChild(routes),
        ToastModule,
        // MatButtonModule,
        // MatFormFieldModule,
        // MatInputModule,
        // MatSelectModule,
        // MatCheckboxModule,
        FuseSharedModule,
        RatingModule,
        MatProgressButtonsModule.forRoot(),
        AllDirectiveModule,
        // MatTooltipModule,
        MatSharedAngularModule
        // MaterialAnimatedIconModule
    ],
    providers: [MessageService],
    exports: [
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        CustomerReviewComponent
    ]
})
export class AuthModule {
}
