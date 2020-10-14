import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class Translator {
  /**
   * 
   * @param selectedService 
   * @param staffDetails 
   */
  staffFilterByServiceSelection(selectedService: any, staffDetails) {
    let staffData: any[] = [];
    staffDetails.forEach(it => {
      let Service: [] = [];
      Service = it.service;
      let isProvideservice: any[] = []
      isProvideservice = Service.filter(d => d == selectedService._id);
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

  imageProductTranslator(image) {
    if (Array.isArray(image) && image.length) {
      return image.map(element => {
        return element = `${'http://18.216.120.11:8080'}${element}`;
      });
    } else {
      if (image.indexOf('http://18.216.120.11:8080') > -1) {
        return `${image}`;
      } else {
        return `${'http://18.216.120.11:8080'}${image}`;
      }
    }
  }

  newImageTranslator(image) {
    if (image.indexOf('http://18.216.120.11:8080') > -1) {
      return `${image}`;
    } else {
      return `${'http://18.216.120.11:8080'}${image}`;
    }
  }

}