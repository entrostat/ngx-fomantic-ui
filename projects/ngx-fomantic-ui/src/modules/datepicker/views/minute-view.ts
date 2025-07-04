import { Component, Renderer2 } from '@angular/core';
import { DatePrecision, DateUtil, Util } from '../../../misc/util/internal';
import { CalendarView, CalendarViewType } from './calendar-view';
import { CalendarItem } from '../directives/calendar-item';
import { CalendarMode } from '../services/calendar.service';
import { CalendarRangeService } from '../services/calendar-range.service';
import { DateParser } from '../classes/date-parser';

export class CalendarRangeMinuteService extends CalendarRangeService {
  public calcStart(start: Date): Date {
    return DateUtil.startOf(DatePrecision.Hour, DateUtil.clone(start), true);
  }

  public calcDates(start: Date): Date[] {
    return Util.Array
      .range(this.length)
      .map(i => DateUtil.add(DatePrecision.Minute, DateUtil.clone(start), i * 5));
  }

  public configureItem(item: CalendarItem, baseDate: Date): void {
    item.humanReadable = new DateParser(this.service.localeValues.formats.time, this.service.localeValues).format(item.date);
    item.isOutsideRange = false;
  }
}

@Component({
  selector: 'fui-calendar-minute-view',
  template: `
    <table class="ui celled center aligned unstackable table three column minute">
      <thead>
      <tr>
        <th colspan="4">
          <fui-calendar-view-title [ranges]="ranges" (zoomOut)="zoomOut()">
            {{ date }}
          </fui-calendar-view-title>
        </th>
      </tr>
      </thead>
      <tbody>
        @for (group of ranges.current.groupedItems; track generateGroupKey(group)) {
          <tr>
            @for (item of group; track item.humanReadable) {
              <td class="link"
                  [calendarItem]="item"
                  (click)="setDate(item)">{{ item.humanReadable }}
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  standalone: false,
})
export class FuiCalendarMinuteView extends CalendarView {
  constructor(renderer: Renderer2) {
    super(renderer, CalendarViewType.Minute, new CalendarRangeMinuteService(DatePrecision.Hour, 4, 3));
  }

  public get date(): string {
    if (this.service.config.mode !== CalendarMode.TimeOnly) {
      // Set minutes and seconds to 0
      const dateTimeFormat: string = this.service.localeValues.formats.datetime.replace(/[ms]/g, '0');
      return new DateParser(dateTimeFormat, this.service.localeValues).format(this.currentDate);
    } else {
      // Set minutes and seconds to 0
      const timeFormat: string = this.service.localeValues.formats.time.replace(/[ms]/g, '0');
      return new DateParser(timeFormat, this.service.localeValues).format(this.currentDate);
    }
  }
}
