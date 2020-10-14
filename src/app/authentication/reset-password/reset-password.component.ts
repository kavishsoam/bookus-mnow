import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'app/services/api.service';
import { RESETPASS } from 'app/services/url';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from "@angular/router"
@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  // Private
  private _unsubscribeAll: Subject<any>;
  public token: string;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _service: ApiService,
    private _toast: MessageService,
    private _router: Router,
    private activatedRoute: ActivatedRoute
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
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
    });
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }
  submitReset(form) {
    delete form.value.passwordConfirm;
    form.value.token = this.token;
    this._service.post(RESETPASS, form.value).subscribe(res => {
      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message + '. Redirecting to login page' });
      setTimeout(() => {
        this._router.navigate(['auth/login']);
      }, 4000)
    }, err => {
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error });
    })
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');
  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }
  return { 'passwordsNotMatching': true };
};
