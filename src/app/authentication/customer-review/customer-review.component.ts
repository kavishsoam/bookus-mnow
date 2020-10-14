import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomerReviewComponent implements OnInit {

  reviewForm : any;
  paramObj: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private formBuilder : FormBuilder,
    private _service: ApiService,
    private route : ActivatedRoute,
    private router : Router,
    private toast : MessageService
    
  ) {
    this.reviewForm = this.formBuilder.group({
      shopRate:[null],
      shopReview : [null],
      therapistRate: [null],
      therapistReview : [null]
    });

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

  ngOnInit() {
    this.routerData();
  }

  routerData(){
    this.route.queryParams.subscribe(params => {
      console.log("params",params); 
      this.paramObj = params;
  });
    }

    objectFunction = async (forUserType,userTypeId,formData) => {
      return {
       "star": (forUserType == 'companyId') ? formData.shopRate : formData.therapistRate,
     "massage_star":  (forUserType == 'companyId') ? formData.shopRate : formData.therapistRate,
      "review":(forUserType == 'companyId') ? formData.shopReview : formData.therapistReview,
      [forUserType]: userTypeId,
        "token": this.paramObj.token,
     "clientId": this.paramObj.clientId, 
      }
    }
    

  async submitReview(form) {
    // if(form)

// this.objectFunction()
//   console.log(form);
  if(form.value.shopRate && form.value.shopReview) {
  let obj = await this.objectFunction('companyId',this.paramObj.locationId,form.value);
  this.callForSubmitReviewApi(obj);
  }

  if(form.value.therapistRate && form.value.therapistReview) {

    let obj = await this.objectFunction('therapistId',this.paramObj.therapistId,form.value);
     this.callForSubmitReviewApi(obj);
  }
  }


  callForSubmitReviewApi(obj) {
    this._service.post('rating/review',obj).subscribe(res=>{
      console.log(res);
      this.toast.add({
        severity: "success",
        summary: "Review Submitted",
        detail: "Thank you to spare your precious time for reviewing us."
      });
      this.router.navigateByUrl('/auth/login');
    },err=>{
      console.log(err);
      this.toast.add({
        severity: "success",
        summary: "Review Submitted",
        detail: "Thank you for the review."
      });
      this.router.navigateByUrl('/auth/login');
    })
  }





}
