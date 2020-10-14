import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { REGISTER } from 'app/services/url';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router"
import { businessType, currencies, countries } from 'app/services/utilites';
import * as momentTZ from 'moment-timezone';
import { allCountries } from '../../services/utilites';
import { ErrorStateMatcher } from '@angular/material';
import { MyErrorStateMatcher } from 'app/shared/mat-shared-angular/validation';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [MessageService]
})
export class RegisterComponent implements OnInit, OnDestroy {
    businessTypeArray = businessType;
    registerForm: FormGroup;
    countryArray: any = countries;
    timeZoneArray: any = [];
    currencyArray: any = currencies;
    private _unsubscribeAll: Subject<any>;
    acceptTC: boolean = false;
    loader: boolean = false;
    currentLat: any;
    currentLong: any;
    categoryData = [];
    genderList = [
        {
            name : 'Male',
            viewValue : 'Male'
        },
        {
            name : 'Female',
            viewValue : 'Female'
        },
        {
            name : 'Unknown',
            viewValue : 'Others'
        }
    ]
    hide = true;
    hide2 = true;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _service: ApiService,
        private _toast: MessageService,
        private _router: Router
    ) {

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

        this.getCategoryList();
        this.registerForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required, passwordPatternValidator],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            gender : ['', Validators.required],
            companyName: ['', Validators.required],
            businessType: ['', Validators.required],
            categoryId: ['', Validators.required],
            country: [''],
            timezone: [''],
            currency: ['',Validators.required],
            _type: ['owner'],
            geo_location: ['']
        });
        let timezoneArr = momentTZ.tz.names()
        for (let i in timezoneArr) {
            this.timeZoneArray.push(`(GMT${momentTZ.tz(timezoneArr[i]).format('Z')}) ${timezoneArr[i]}`);
        }
        this.timeZoneArray = this.timeZoneArray.sort();
        this.findMyPosition();
    }

    matcher = new MyErrorStateMatcher();

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    getData() {
    }

    geterrorMothod(e){
        console.log(e);
    }

    //to register api call
    register(form) {
        form.invalid ? this.loader = false : this.loader = true;
        this._service.post(REGISTER, form.value).subscribe(res => {

            localStorage.setItem('token', res.token);
            localStorage.setItem('firstName', res.result.firstName);
            localStorage.setItem('lastName', res.result.lastName);
            localStorage.setItem('id', res.result._id);
            localStorage.setItem('type', res.result._type);
            localStorage.setItem('currency', res.result.currency);
            localStorage.setItem('country', res.result.country);
            localStorage.setItem('calendarSettings', JSON.stringify(res.result.calendarSetting));
            localStorage.setItem('categoryList',res.result.categoryId);
            this.findCountryCode();

            this._toast.add({ severity: 'success', summary: 'Registration successful', detail: res.message });
            this._service.setProfile(res.result);
            setTimeout(() => {
                this._router.navigate(['main/home']);
            }, 500);
        }, err => {
            this.loader = false;
            this._toast.add({ severity: 'error', summary: 'Service Message', detail: err.error || "Something went wrong" });
        })
    }

    getCategoryList() {
        this._service.get('category').subscribe(res=>{
            console.log('response',res);
            let data = [];
            let category = [];
            category = res.result;
            category.forEach(element => {
                element.category.forEach(innerEle => {
                    if(innerEle.language == 'english')
                    data.push({id: element._id, name: innerEle.name });
                });
            });
            console.log('category data ===>>>',this.categoryData);
            this.categoryData = data;
        },err=>{
            console.log(err);
        })
    }

    findMyPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.showPosition(position);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    showPosition(position) {
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
        var coordinates = [];
        coordinates.push(this.currentLong);
        coordinates.push(this.currentLat);
        var geo = {
            "type": "Point",
            "coordinates": coordinates
        }
        this.registerForm.get('geo_loccation').setValue(geo);

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
                localStorage.setItem('CountryCode', final[0][1]);
                localStorage.setItem('countrycode', final[0][2]);
            }
            else {
                final.sort((it1, it2) => {
                    return it1[0].length - it2[0].length
                })
                localStorage.setItem('CountryCode', final[0][1]);
                localStorage.setItem('countrycode', final[0][2]);

            }
        }
    }

}

/**
 * 
 * @param {AbstractControl} control
 *  @returns { ValidationErrors | null } 
 * 
 * 
 * 
 */

export const passwordPatternValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    let hasNumber = /\d/.test(control.value);
        let hasUpper = /[A-Z]/.test(control.value);
        let hasLower = /[a-z]/.test(control.value);
        // console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
        const valid = hasNumber && hasUpper && hasLower;
        if (!valid) {
            // return what´s not valid
            let error = {
                isNumberExist: !hasNumber,
                isUpperExist: !hasUpper,
               isLowerExist: !hasLower
        };
        return of(error);
        }
        return of(null);
};



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


/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//       const isSubmitted = form && form.submitted;
//       return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//     }
//   }
