import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smallTruncate'
})
export class smallTruncatePipe implements PipeTransform {
transform(value: string, limit = 4, completeWords = false, ellipsis = '...') {

   if (value.length < limit)
   return `${value.substr(0, limit)}`;

   if (completeWords) {
     limit = value.substr(0, limit).lastIndexOf(' ');
   }
   return `${value.substr(0, limit)}${ellipsis}`;
}
}