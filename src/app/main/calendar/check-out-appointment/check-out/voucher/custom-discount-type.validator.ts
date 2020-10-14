import { AbstractControl, FormGroup } from '@angular/forms';

export function customDiscountTypeValidator(form:FormGroup) {
    let customDiscountType = form.value;
    if(!!form.parent){
        let customDiscountValue = form.parent.value.customDiscountValue;             
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
        console.log("customDiscountType",customDiscountType)  
        console.log("customDiscountValue",form.parent.value.customDiscountValue);
        console.log("price",form.parent.value.price)
        console.log("special price",form.parent.value.special_price)
    }    
    return null;
  }
