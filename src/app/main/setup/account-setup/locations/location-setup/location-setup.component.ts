import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { LOCATION } from 'app/services/url';
import { FormArray, FormBuilder } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-location-setup',
  templateUrl: './location-setup.component.html',
  styleUrls: ['./location-setup.component.scss']
})
export class LocationSetupComponent implements OnInit {
  path: any;
  locationData: any;
  defaultModerate : any;
  defaultZero: any;
  defaultFlexible: any;
  defaultFair: any;
  defaultStrict: any;

  constructor(
    public route : ActivatedRoute,
    private service : ApiService,
    private formBuilder : FormBuilder,
    private router : Router,
    private _fuseConfigService: FuseConfigService,
  ) {
   }

  bookingRulesForm : any;
  pageHeader: Object = { header: " Locations", main: "Setup", navigate: true }

  setPageHeader(): void {
    // send message to subscribers via observable subject
    this._fuseConfigService.sendPageHeader(this.pageHeader);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(res => {
      this.path = res['params'];

    })
  if(this.path.id != 'newLocation')
    this.getLocationDetails(this.path.id);


    this.bookingRulesForm = this.formBuilder.group({
      active : [false],
      appointmentTime : [''],
      allowClient : [false],
      wanted : [false],
      customerAppointment : [false],
      verifiedCustomer : [false],
      allow : [false],
      range : [''],
      everyone : [false],
      acceptOnlinePayment : [false],
      cancellationTime : [''],
      cardPayment : [false],
      noShowPoilicy : ['']
    })

  }


  getLocationDetails(id) {
    this.service.get(LOCATION +'/'+ id).subscribe(res=>{
      console.log(res);
      this.locationData = res.result.location[0];
      console.log(this.locationData);
      this.patchLocationData();
    },err=>{
      console.log(err);
    })
   
  }

  patchLocationData() {

    if( this.locationData 
      && this.locationData.onlineBookingRules 
      && this.locationData.onlineBookingRules.requireAcceptance 
      && this.locationData.onlineBookingRules.noShow
      && this.locationData.onlineBookingRules.requireAcceptance.credit ) {
    this.bookingRulesForm.patchValue({
      active : this.locationData.onlineBookingRules.active,
      appointmentTime : this.locationData.onlineBookingRules.appointmentTime,
      allowClient : this.locationData.onlineBookingRules.allowClient ,
      wanted : this.locationData.onlineBookingRules.requireAcceptance.wanted ,
      customerAppointment :  this.locationData.onlineBookingRules.requireAcceptance.customerAppointment,
      verifiedCustomer : this.locationData.onlineBookingRules.requireAcceptance.verifiedCustomer ,
      allow :  this.locationData.onlineBookingRules.requireAcceptance.credit.allow,
      range :  this.locationData.onlineBookingRules.requireAcceptance.credit.range,
      everyone : this.locationData.onlineBookingRules.requireAcceptance.everyone,
      acceptOnlinePayment : this.locationData.onlineBookingRules.acceptOnlinePayment,
      cancellationTime :  this.locationData.onlineBookingRules.cancellationTime,
      cardPayment :  this.locationData.onlineBookingRules.noShow.cardPayment,
      noShowPolicy : this.locationData.onlineBookingRules.noShow.noShowPolicy,
    })
  }
  }

  selectStrict() {
    (this.defaultStrict == 16) ? this.defaultStrict = 4 : this.defaultStrict = 16;
  }
  selectModerate() {
    this.defaultModerate == 16 ? this.defaultModerate = 4 : this.defaultModerate = 16;
  }
  selectFair() {
    this.defaultFair == 16 ? this.defaultFair = 4 : this.defaultFair = 16;
  }
  selectFlexible() {
    this.defaultFlexible == 16  ? this.defaultFlexible = 4  : this.defaultFlexible = 16;
  }
  selectZero() {
    this.defaultZero == 16 ? this.defaultZero = 4 : this.defaultZero = 16;
  }

  submitBookingRules(form) {
  console.log(form);
  let credit = {}
  let onlineBookingRules = {};
  let requireAcceptance = {};
  let noShow = {};


  onlineBookingRules['active'] = form.value.active;
  onlineBookingRules['appointmentTime'] = form.value.appointmentTime;
  onlineBookingRules['acceptOnlinePayment'] = form.value.acceptOnlinePayment;
  onlineBookingRules['cancellationTime'] = form.value.cancellationTime;
  onlineBookingRules['allowClient'] = form.value.allowClient;


  requireAcceptance['wanted'] = form.value.wanted
  requireAcceptance['customerAppointment'] = form.value.customerAppointment
  requireAcceptance['verifiedCustomer'] = form.value.verifiedCustomer
  requireAcceptance['everyone'] = form.value.everyone


credit['allow'] = form.value.allow;
credit['range'] = form.value.range;

noShow['cardPayment'] = form.value.cardPayment
noShow['noShowPolicy'] = form.value.noShowPolicy


requireAcceptance['credit'] = credit;
onlineBookingRules['requireAcceptance']= requireAcceptance;
onlineBookingRules['noShow']= noShow;


this.locationData['onlineBookingRules'] = onlineBookingRules;

this.updateLocationData();

  }

  updateLocationData() {
    this.service.put(LOCATION+'/'+this.path.id, this.locationData).subscribe(res=>{
      console.log(res);
      setTimeout(() => {
        this.router.navigateByUrl('main/setup/locations');
      }, 200);
    },err=>{
      console.log(err);
      setTimeout(() => {
        this.router.navigateByUrl('main/setup/locations');
      }, 200);
    })
  }
}
