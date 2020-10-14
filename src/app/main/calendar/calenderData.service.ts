import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalenderDataService {
  counter: any = 0;
  isActive: boolean;
  calenderState: any = {};
  private messageSource = new BehaviorSubject<Boolean>(false);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

  calenderStateCount() {
    this.counter++;
    if (this.counter >= 1) {
      this.isActive = true;
    }
  }

  getCalenderActiveState() {
    return {
      counter: this.counter,
      isActive: this.isActive
    };
  }

  setCalenderState(key, d) {
    this.calenderState[key] = d;
  }

  getCalendarState = () => this.calenderState;

}