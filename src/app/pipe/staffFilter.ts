import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staffFilter'
})
export class StaffFilter implements PipeTransform {
  transform(staff: any[], selectedService: any, staffDetails): any[] {





    let staffData: any[] = [];
    //("from pipe staff", staff);
    //("from pipe service", selectedService)
    //("from pipe staffservice", staffDetails)
    let ID = selectedService && selectedService._id ? '_id' : 'id'
    // for the staff 
    //             firstName: "ios"
    //         id: "5dd4e010449c370018c62c58"
    //         lastName: "developer"
    staffDetails.forEach(it => {
      let Service: [] = [];
      Service = it.service;
      let isProvideservice: any[] = []
      isProvideservice = Service.filter(d => d == selectedService[ID]);
      if (isProvideservice.length > 0) {
        staffData.push({
          firstName: it.firstName,
          lastName: it.lastName,
          id: it._id
        })
      }
    });


    return staffData;
  }
}