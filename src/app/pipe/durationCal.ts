import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({ name: 'durationCal' })
export class duration implements PipeTransform {
    transform(startTime: any, endTime) {
        var stme = moment(startTime);
        var enme = moment(endTime);
        var duration = moment.duration(enme.diff(stme));
        var remain_hour = duration.hours();
        var remain_min = duration.minutes();
        return `${remain_hour != 0 ? remain_hour + 'hrs' : ''} ${remain_min != 0 ? remain_min + 'min' : ''}`;
    }
}
