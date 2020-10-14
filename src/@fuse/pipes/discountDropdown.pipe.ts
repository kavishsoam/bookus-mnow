import { Pipe, PipeTransform } from '@angular/core';
import { FuseUtils } from '@fuse/utils';
@Pipe({name: 'discountType'})
export class discountTypePipe implements PipeTransform
{
    /**
     * Transform
     *
     * @param {any[]} mainArr
     * @param {string} searchText
     * @param {string} property
     * @returns {any}
     */
    transform(value : string): any
    {
        //
        if(value == 'percentage'){
            return '%'
        }
        else if(value == 'amount'){

            var currency_symbols = {
                'USD': '$', // US Dollar
                'EUR': '€', // Euro
                'CRC': '₡', // Costa Rican Colón
                'GBP': '£', // British Pound Sterling
                'ILS': '₪', // Israeli New Sheqel
                'INR': '₹', // Indian Rupee
                'JPY': '¥', // Japanese Yen
                'KRW': '₩', // South Korean Won
                'NGN': '₦', // Nigerian Naira
                'PHP': '₱', // Philippine Peso
                'PLN': 'zł', // Polish Zloty
                'PYG': '₲', // Paraguayan Guarani
                'THB': '฿', // Thai Baht
                'UAH': '₴', // Ukrainian Hryvnia
                'VND': '₫', // Vietnamese Dong
                'AUD': 'A$' // Australian Dollar 
            };

            let v  = localStorage.getItem('currency')
            var currency_name = v;
            if(currency_symbols[currency_name] !== undefined) {
                // alert(currency_symbols[currency_name]);
                return currency_symbols[currency_name];
            }


            // let code  = localStorage.getItem('currency')
            // return code;
        }
        // return FuseUtils.filterArrayByString(mainArr, searchText);
    }
}