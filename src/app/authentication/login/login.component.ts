import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { LOGIN } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router";
import { allCountries } from '../../services/utilites';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  loader: boolean = false;
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
    private _router: Router,
    private changeRef: ChangeDetectorRef
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
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
  }
  submitLogin(form) {
    form.invalid ? this.loader = false : this.loader = true;

    this._service.post(LOGIN, form.value).subscribe(res => {
      localStorage.clear();
      localStorage.setItem('token', res.token);
      localStorage.setItem('token', res.token);
      localStorage.setItem('id', res.result._id);
      localStorage.setItem('type', res.result._type);
      localStorage.setItem('currency', res.result.currency);
      localStorage.setItem('country', res.result.country);
      localStorage.setItem('calendarSettings', JSON.stringify(res.result.calendarSetting));
      localStorage.setItem('firstName', res.result.firstName);
      localStorage.setItem('lastName', res.result.lastName);
      localStorage.setItem('categoryList',res.result.categoryId);
      res.result._type == 'staff' ? localStorage.setItem('owner', res.result.owner) : localStorage.setItem('owner', res.result._id);





      this.findCountryCode();

      this._toast.add({ severity: 'success', summary: 'Service Message', detail: res.message });
      this._service.setProfile(res.result);
      this.changeRef.detectChanges();
      setTimeout(() => {
        this._router.navigate(['main/home'])
      }, 1000)
    }, err => {
      this.loader = false;
      this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error || "Something went wrong" });
    })
  }
  findCountryCode() {
    var country = localStorage.getItem('country');
    let countryList = []
    countryList = allCountries;
    var final = countryList.filter(item => {
      if ((item[0].toLowerCase().indexOf(country.toLowerCase()) > -1))
        return item;
    })

    if (final.length > 0) {
      if (final.length == 1) {
        localStorage.setItem('CountryCode', final[0][1]),
          localStorage.setItem('countrycode', final[0][2]);
      }
      else {
        final.sort((it1, it2) => {
          return it1[0].length - it2[0].length
        })
        localStorage.setItem('CountryCode', final[0][1]),
          localStorage.setItem('countrycode', final[0][2]);

      }
    }
  }
}
