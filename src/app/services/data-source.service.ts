import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataSourceService {
  private dataSource = new BehaviorSubject("default message");
  currentMessage = this.dataSource.asObservable();
  counter: any = 0;
  isActive: boolean;
  calenderStateData: any = {};

  constructor() { }

  changeMessage(message: any) {
    this.dataSource.next(message);
  }

  calenderRouterIncrement() {
    this.counter++;
    if (this.counter > 1) {
      this.isActive = true;
    }
  }

  getCalenderRouter() {
    return {
      counter: this.counter,
      isActive: this.isActive
    };
  }

  setCalenderData(key, d) {
    this.calenderStateData[key] = d;
  }

  getCalendarData = () => this.calenderStateData;
}
