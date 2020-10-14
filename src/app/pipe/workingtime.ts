import { Pipe } from "@angular/core";

@Pipe({
    name: 'workingTime',
    pure : false
})
export class workingtime {

    transform(objects: any[]): any[] {
        if(objects) {
            return objects.filter(object => {
                return object.checked === true;
            });
        }
    }

}