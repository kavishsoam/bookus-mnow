import { AbstractControl, FormGroup } from '@angular/forms';

export function customDiscountValidator(form:FormGroup) {
    let customDiscountValue = form.value;
    if(!form.value){
        return null;
    }
    console.log("customDiscountValue",form.value)
    if(!!form.parent){

        let customDiscountType = form.parent.value.customDiscountType;
        let price = form.parent.value.price;
        let special_price = form.parent.value.special_price;

    if(customDiscountValue >= 0 && !!customDiscountValue){
                 if(!!special_price){
                     if(customDiscountType == 'amount'){
                        if(customDiscountValue > special_price)
                        return {"discountInvalid":true}
                     }
                     else{
                         if(customDiscountValue > 100)
                         return {"discountInvalid":true}
                     }
                    
                 }
                 else{
                    if(customDiscountType == 'amount'){
                        if(customDiscountValue > price)
                        return {"discountInvalid":true}
                     }
                     else{
                         if(customDiscountValue > 100)
                         return {"discountInvalid":true}
                     }
                 }
    }
    else{
        return {"discountInvalid":true}
    }

        console.log("customDiscountType",form.parent.value.customDiscountType);
        console.log("price",form.parent.value.price)
        console.log("special price",form.parent.value.special_price)
    }    
    return null;
  }

  