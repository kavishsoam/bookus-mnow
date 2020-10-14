import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { InviteFreelancerComponent } from '../invite-freelancer/invite-freelancer.component';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { LOC_LIS } from 'app/services/url';
import {  bounceOutLeftOnLeaveAnimation, bounceInLeftOnEnterAnimation } from 'angular-animations';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-newjob',
  templateUrl: './newjob.component.html',
  styleUrls: ['./newjob.component.scss'],
  animations: [
    bounceInLeftOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '30px' }),
    // bounceOutLeftOnLeaveAnimation({ anchor: 'leave', duration: 1000, delay: 200, translate: '30px' })
  ]
})
export class NewjobComponent implements OnInit {

  changeButtonText: string = 'Next';
  selectedIndex: number = 0;
  foods = [
    {value: 'Massage', viewValue: 'Massage'},
    {value: 'Spa', viewValue: 'Spa'},
    {value: 'Tattoo', viewValue: 'Tattoo'}
  ];

  jobType = [
    {value: 'service provider', viewValue: 'service provider'},
    {value: 'management', viewValue: 'management'},
    {value: 'seniour assistant', viewValue: 'seniour assistant'}
  ]

  guarantee = [
    {value: 'hourly', viewValue: 'Hourly'},
    {value: 'weekly', viewValue: 'Weekly'},
    {value: 'monthly', viewValue: 'Monthly'},
    {value: 'daily', viewValue: 'Daily'}
  ]

  workingType = [
    {value: 'days', viewValue: 'Days'},
    {value: 'hours', viewValue: 'Hours'}
  ]

  typesOfJob = [
    {value: 'permanent', viewValue: 'Direct Employee'},
    {value: 'freelancer', viewValue: 'Freelancer (Subcontractor)'}
  ]

  certificates = [
    {value: 'remedial', viewValue: 'Remedial'},
    {value: 'massage therapy', viewValue: 'Massage Therapy'}
  ]

  timeperiod = [
    {value : 'days', viewValue : 'Days'},
    {value : 'months', viewValue : 'Months'},
    {value : 'years', viewValue : 'Years'}
  ]

  experienceYearsDrop = [
    {value : '0', viewValue : '0 Year'},
    {value : '1', viewValue : '1 Year'},
    {value :'2' , viewValue : '2 Year'},
    {value :'any' , viewValue : 'any'},
  ]

  experienceMonthsDrop = [
    {value : '0', viewValue : '0 Month'},
    {value : '1', viewValue : '1 Month'},
    {value : '2', viewValue : '2 Month'},
    {value : '3', viewValue : '3 Month'},
    {value : '4', viewValue : '4 Month'},
    {value : '5', viewValue : '5 Month'},
    {value : '6', viewValue : '6 Month'},
    {value : '7', viewValue : '7 Month'},
    {value : '8', viewValue : '8 Month'},
    {value : '9', viewValue : '9 Month'},
    {value : '10', viewValue : '10 Month'},
    {value : '11', viewValue : '11 Month'},
    {value : '12', viewValue : '12 Month'},
  ]


workingDataJson :any =  [{
    day: 'mon',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'tue',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'wed',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'thr',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'fri',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'sat',
    time: {
      start: null,
      end: null
    }
  },
  {
    day: 'sun',
    time: {
      start: null,
      end: null
    }
  }
]


  workingdays = [
    {
      name: 'Mon',
      value:'mon',
      checked : false
  },
  {
    name: 'Tue',
    value:'tue',
    checked : false
},
{
  name: 'Wed',
  value:'wed',
  checked : false
},
{
  name: 'Thr',
  value:'thr',
  checked : false
},
{
  name: 'Fri',
  value:'fri',
  checked : false
},
{
  name: 'Sat',
  value:'sat',
  checked : false
},
{
  name: 'Sun',
  value:'sun',
  checked : false
},
  ]
  // working : FormGroup;


jobCreateForm : any;
generalDetailsForm : any;
  categoryData: any[];
  locationList: any;
  workDetailsForm: FormGroup;
  servCom: boolean = true;
  hourCom: boolean = true;
  hourPay: boolean = true;
  guaranteeRead: boolean = false;
  salaryForm: FormGroup;
  whoCanApplyForm: FormGroup;
  jobData: any = {};


constructor(
  @Optional() public dialogRef: MatDialogRef<NewjobComponent>,
  @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog,
  private formBuilder : FormBuilder,
  private _service : ApiService,
  private _toast: MessageService,
  private spinner : NgxSpinnerService
) {

  this.generalDetailsForm = this.formBuilder.group({
    jobTitle : new FormControl('',[Validators.required]),
    categoryId : new FormControl('', [Validators.required]),
  })

  this.workDetailsForm = this.formBuilder.group({
    locationId : new FormControl('',[Validators.required]),
    days : new FormControl('',),
    allowWorkForOther: new FormControl(false)

  })

  this.salaryForm = this.formBuilder.group({
    serviceCommission : new FormControl(''),
    hourlyCommission : new FormControl(''),
    hourlyPay : new FormControl(''),
    guaranteeType : new FormControl(''),
    workDuration : new FormControl(''),
    work : new FormControl(''),
    guaranteeMoney : new FormControl(''),
    payedByOwner: new FormControl(''),
    jobType : new FormControl('',[Validators.required]),
  })


  this.whoCanApplyForm = this.formBuilder.group({
    numberABN : new FormControl(false),
    numberTFN : new FormControl(false),
    verified : new FormControl(false),
    gender: new FormControl('',[Validators.required]),
    certificateRequired : new FormControl(false),
    certificateType : new FormControl(''),
    timePeriodValue: new FormControl(''),
    timePeriod : new FormControl(''),
    experienceYears : new FormControl('',[Validators.required]),
    experienceMonths : new FormControl(''),
    ownerMessage : new FormControl(''),
    showIncome : new FormControl(false),
  })
 }


  ngOnInit() {
    this.getCategoryList();
    this.getLocationList();
    console.log(this.data);
    //new - job
    if(this.data._id == ''){

    }
    if(this.data._id != ''){
      this.patchFormData(this.data);
    }
  //! 
  }


  submitGeneralDetails(form) {
    this.navigateTab();
  }

  submitWorkDetailsForm(form) {
    this.navigateTab();
  }

  submitSalaryForm(form) {
    this.navigateTab();
  }

  submitWhoCanApplyForm(form) {
    this.mergeFunction(form.value);
    this.navigateTab();
    this.closeClicked();
    this.jobCreateApi();
  }

  mergeFunction(data) {
    this.jobData = { ...this.generalDetailsForm.value, ...this.workDetailsForm.value, ...this.salaryForm.value, ...data };
  }
 

  navigateTab(){
    if (this.selectedIndex !=  3) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  jobCreateApi() {
    let data = this.transformData();
    this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
    this.NextNavigate();
  }, 3500);

    this._service.post('jobs/post',data).subscribe(res=>{
      console.log(res);
      this._toast.add({ severity: "success",summary: "Job Created",detail: "Successfully created  Job" });  
    },err=>{
      console.log(err);
      this._toast.add({ severity: "success",summary: "Job Created",detail: "Successfully created  Job" });  
    })
  }

  patchFormData(value){
    this.generalDetailsForm.patchValue({
      jobTitle : value.jobTitle,
      categoryId : value.categoryId[0]
    })

    this.workDetailsForm.patchValue({
      locationId : value.locationId,
      days : '',
      allowWorkForOther: value.allowWorkForOther
    })

    this.salaryForm.patchValue({
      serviceCommission : value.salary.serviceCommission,
      hourlyCommission : value.salary.hourlyCommission,
      hourlyPay : value.salary.hourlyPay,
      guaranteeType : value.guaranteeSalary.guaranteeType ? value.guaranteeSalary.guaranteeType : '',
      workDuration : value.guaranteeSalary.working,
      work : value.guaranteeSalary.work ? value.guaranteeSalary.work : '',
      payedByOwner : value.guaranteeSalary.paidByOwner ? value.guaranteeSalary.paidByOwner : '', 
      guaranteeMoney : value.guaranteeSalary.guaranteeMoney,
      jobType : value.jobType ? value.jobType : '',
    })

    this.whoCanApplyForm.patchValue({
      numberABN : value.canApply.numberABN,
      numberTFN : value.canApply.numberTFN,
      verified : value.verified,
      gender: value.gender,
      certificateRequired :value.certificateRequired,
      certificateType : value.certificateType,
      timePeriod : value.timePeriod.time,
      timePeriodValue: value.time.days,
      experienceYears : value.experience.years.toString(),
      experienceMonths : value.experience.months.toString(),
      ownerMessage : value.ownerMessage,
      showIncome : value.showIncome ? value.showIncome : '' ,
    })

  }

  transformData() {

    const  obj = {
      jobTitle : this.jobData.jobTitle,
      categoryId : this.jobData.categoryId,
      locationId: this.jobData.locationId,
      allowWorkForOther : this.jobData.allowWorkForOther,
      salary: {
         hourlyCommission: this.jobData.hourlyCommission,
         hourlyPay: this.jobData.hourlyPay,
         specificCommission: this.jobData.specificCommission,
         serviceCommission: this.jobData.serviceCommission
       },
      //  guaranteeSalary: {
      //   guaranteeType:  this.jobData.guaranteeType,
      //   work: {
      //     working: Number,
      //     day: Boolean,
      //     hours: Boolean
      //   },
      //   guaranteeMoney: {
      //     type: Number,
      //     default: 0
      //   },
      //   paidByOwner: {
      //     type: Number,
      //     default: 0
      //   }
      // }
       guaranteeSalary: {
         guaranteeType: this.jobData.guaranteeType,
         work: this.jobData.work,
         working : this.jobData.workDuration,
         guaranteeMoney: this.jobData.guaranteeMoney,
         paidByOwner: this.jobData.paidByOwner
       },
       canApply: {
          numberABN:this.jobData.numberABN,
         numberTFN: this.jobData.numberTFN
      },
      ownerId: localStorage.getItem('id'),
      gender: this.jobData.gender,
       verified: this.jobData.verified,
       certificateRequired: this.jobData.certificateRequired,
       certificateType: this.jobData.certificateType,
       timePeriod: {
         time : this.jobData.timePeriod,
         day: this.jobData.timePeriodValue,
       },
       experience: {
         years: this.jobData.experienceYears,
         months: this.jobData.experienceMonths
       },
       ownerMessage: this.jobData.ownerMessage,
       jobType: this.jobData.jobType,
       working: {
         dayTime : this.removeFinalWorking()
       }
    };

    return obj;
  }
 
  closeClicked() {
    this.dialogRef.close();
  }

  NextNavigate() {
      const dialogRef = this.dialog.open(InviteFreelancerComponent, {
        width: '35vw',
        height: '60vh',
        autoFocus: false,
        data : 'newJob'
      });
      dialogRef.afterClosed().subscribe(result => {
      });
  }

  tabClick(event) {
    console.log(event['index']);
    this.selectedIndex = event.index;
    if(event.index == 3) {
      this.changeButtonText = 'Submit';
    }
    else {
      this.changeButtonText = 'Next';
    }
  }


  getCategoryList() {
    this._service.get('category').subscribe(res=>{
      let categoryList : any = [];
       categoryList = localStorage.getItem('categoryList').split(',');
      let data = [];
        let category = [];
        category = res.result;
        category.forEach(element => {
            element.category.forEach(innerEle => {
              categoryList.forEach(id => {
                if(innerEle.language == 'english' && element._id == id)
                data.push({id: element._id, name: innerEle.name });
              });
            });
        });
        this.categoryData = data;
        console.log('category data ===>>>',this.categoryData);
    },err=>{
        console.log(err);
    })
}

getLocationList() {
    this._service.get(LOC_LIS).subscribe(
      res => {
        this.locationList = res;
      },
      err => {
       console.log(err);
      }
    );
}

workingDaysChecked(event, day) {
  console.log(event);
  console.log(day);
  console.log(this.workingdays);
  day.checked = !day.checked;
  // //
}

/*
       working: {
         dayTime : [{
           day: 'mon',
           time: {
             start: new Date(),
             end: new Date()
           }
         }]
       }
*/ 

startHourChanged(event,type,day) {
console.log(event);
console.log(type);
console.log(day)
this.workingData(day.value,type,event.value);
}

endHourChanged(event,type,day) {
console.log(event);
console.log(type);
console.log(day);
this.workingData(day.value,type,event.value);
}

workingData(day,type,value) {
    this.workingDataJson.forEach(ele=>{
      if(day == ele.day && type == 'start'){
        ele.time.start == value;
      }
      if(day == ele.day && type == 'end'){
        ele.time.end == value;
      }
    })
}

removeFinalWorking() {
  let data = [];
  this.workingDataJson.forEach(element=>{
    if(element.time.start == null && element.time.end == null ){

    }
    else {
      data.push(element);
    }
  })
  return data;
}

serviceComCheck(event) {
  this.servCom = !this.servCom;
}

hourlyComCheck(event) {
  this.hourCom = !this.hourCom;
}

hourlyPayCheck(event) {
  this.hourPay = !this.hourPay;
}

guaranteeCheck(event) {
  this.guaranteeRead = !this.guaranteeRead;
}

}
