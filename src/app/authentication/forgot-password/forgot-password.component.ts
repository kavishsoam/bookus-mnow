import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { FORGETPASS } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router"
@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _service: ApiService,
        private _toast: MessageService,
        private _router: Router
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
    submitForget(form) {
        form.value.url = location.origin + "/auth/reset-password/";
        this._service.post(FORGETPASS, form.value).subscribe(res => {
            localStorage.setItem('token', res.token);
            this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
            this.forgotPasswordForm.reset();
            setTimeout(() => {
            }, 2000)
        }, err => {
            this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
        })
    }
}
