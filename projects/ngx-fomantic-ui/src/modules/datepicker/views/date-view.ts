import { Component, Renderer2 } from '@angular/core';
import { DatePrecision, DateUtil } from '../../../misc/util/internal';
import { CalendarItem } from '../directives/calendar-item';
import { CalendarView, CalendarViewType } from './calendar-view';
import { CalendarRangeService } from '../services/calendar-range.service';
import { DateParser } from '../classes/date-parser';

export class CalendarRangeDateService extends CalendarRangeService {
  public calcStart(start: Date): Date {
    const monthStart = DateUtil.startOf(DatePrecision.Month, DateUtil.clone(start));
    monthStart.setDate((1 - monthStart.getDay() + this.service.firstDayOfWeek - 7) % 7);
    return monthStart;
  }

  public configureItem(item: CalendarItem, baseDate: Date): void {
    item.humanReadable = item.date.getDate().toString();
    item.isOutsideRange = item.date.getMonth() !== baseDate.getMonth();
    item.isSelectable = item.isDisabled;
  }
}

@Component({
  selector: 'fui-calendar-date-view',
  template: `
    <table class="ui celled center aligned unstackable table seven column day">
      <thead>
      <tr>
        <th colspan="7">
          <fui-calendar-view-title [ranges]="ranges" (zoomOut)="zoomOut()">
            {{ date }}
          </fui-calendar-view-title>
        </th>
      </tr>
      <tr>
        @for (day of days; track day + '-' + i; let i = $index) {
          <th>{{ day }}</th>
        }
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
export class FuiCalendarDateView extends CalendarView {
  constructor(renderer: Renderer2) {
    super(renderer, CalendarViewType.Date, new CalendarRangeDateService(DatePrecision.Month, 6, 7));
  }

  public get days(): string[] {
    const days = this.service.localeValues.weekdaysNarrow;
    return days.map((d, i) => days[(i + this.service.firstDayOfWeek) % days.length]);
  }

  public get date(): string {
    return new DateParser(this.service.localeValues.formats.month, this.service.localeValues).format(this.currentDate);
  }
}
