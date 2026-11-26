import { CommonModule } from '@angular/common';
import { Component, ElementRef, computed, input, output, signal } from '@angular/core';
import { addDays, addMonths, differenceInCalendarDays, format, isAfter, isBefore, isSameDay, startOfMonth } from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';

export interface DateRangeValue {
  checkIn: string;
  checkOut: string;
}

interface CalendarMonth {
  firstDay: Date;
  dates: (Date | null)[];
  monthKey: string;
}

function indiaToday(): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: string): number => Number(parts.find((value) => value.type === type)?.value);
  return new Date(part('year'), part('month') - 1, part('day'));
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
      <div class="picker" (keydown.escape)="onEscape($any($event))">
      <button #trigger class="trigger" type="button" [attr.aria-expanded]="open()"
              aria-haspopup="dialog" aria-controls="date-range-dialog" (click)="toggle()">
        <span class="trigger__item"><span class="trigger__label">Check-in</span><strong>{{ displayDate(checkIn()) || 'Add date' }}</strong></span>
        <span class="trigger__divider" aria-hidden="true"></span>
        <span class="trigger__item"><span class="trigger__label">Check-out</span><strong>{{ displayDate(checkOut()) || 'Add date' }}</strong></span>
      </button>
      @if (open()) {
        <section #dialog id="date-range-dialog" class="calendar" role="dialog" aria-modal="true" aria-label="Choose check-in and check-out dates" (keydown)="onDialogKeydown($any($event))">
          <div class="calendar__toolbar">
            <button class="month-nav" type="button" aria-label="Show previous month" [disabled]="cannotGoBack()" (click)="shiftMonth(-1)"><lucide-angular name="chevron-left" [size]="18" aria-hidden="true" /></button>
            <p>{{ rangeHint() }}</p>
            <button class="month-nav" type="button" aria-label="Show next month" [disabled]="cannotGoForward()" (click)="shiftMonth(1)"><lucide-angular name="chevron-right" [size]="18" aria-hidden="true" /></button>
          </div>
          <div class="calendar__months">
            @for (month of months(); track month.monthKey; let monthIndex = $index) {
              <section class="month" [class.month--second]="monthIndex === 1" [attr.aria-label]="month.monthKey">
                <h3>{{ month.firstDay | date:'MMMM yyyy' }}</h3>
                <div class="month__grid" role="grid" [attr.aria-label]="month.firstDay | date:'MMMM yyyy'">
                  @for (weekday of weekdays; track weekday) { <span class="weekday" role="columnheader">{{ weekday }}</span> }
                  @for (day of month.dates; track $index) {
                    @if (day; as value) {
                      <span class="day-cell" role="gridcell" [attr.aria-selected]="isSelected(value)">
                      <button class="day" type="button" [attr.data-date]="isoDate(value)"
                              [attr.aria-label]="value | date:'EEEE, d MMMM yyyy'"
                              [attr.aria-pressed]="isSelected(value)" [attr.tabindex]="isFocused(value) ? 0 : -1"
                              [disabled]="isDisabled(value)" [class.day--range]="isInRange(value)"
                              [class.day--selected]="isSelected(value)" (click)="choose(value)"
                              (keydown)="onDayKeydown($event, value)">{{ value | date:'d' }}</button>
                      </span>
                    } @else { <span class="day day--empty" aria-hidden="true"></span> }
                  }
                </div>
              </section>
            }
          </div>
          <div class="calendar__footer">
            <p aria-live="polite">{{ nightSummary() }}</p>
            <button type="button" class="done" (click)="close()">Done</button>
          </div>
        </section>
      }
    </div>
  `,
  styleUrl: './date-range-picker.component.scss',
})
export class DateRangePickerComponent {
  readonly checkIn = input('');
  readonly checkOut = input('');
  readonly rangeChange = output<DateRangeValue>();
  readonly open = signal(false);
  readonly firstMonth = signal(startOfMonth(indiaToday()));
  readonly focusedDate = signal(startOfMonth(indiaToday()));
  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly months = computed(() => [0, 1].map((offset) => this.buildMonth(addMonths(this.firstMonth(), offset))));
  readonly rangeHint = computed(() => this.checkIn() && !this.checkOut() ? 'Choose a check-out date' : 'Choose a check-in date');
  readonly cannotGoBack = computed(() => {
    const todayMonth = startOfMonth(indiaToday());
    return !isAfter(this.firstMonth(), todayMonth);
  });
  readonly cannotGoForward = computed(() => {
    const lastMonth = startOfMonth(addDays(indiaToday(), 365));
    return !isBefore(this.firstMonth(), lastMonth);
  });

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    const focusDate = this.asDate(this.checkIn()) ?? indiaToday();
    this.focusedDate.set(focusDate);
    this.firstMonth.set(startOfMonth(focusDate));
    this.open.set(true);
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLButtonElement>(`[data-date="${this.isoDate(focusDate)}"]:not(:disabled)`)?.focus());
  }

  close(): void {
    this.open.set(false);
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLButtonElement>('.trigger')?.focus());
  }
  onEscape(event: KeyboardEvent): void { event.stopPropagation(); this.close(); }
  onDialogKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const focusable = [...this.host.nativeElement.querySelectorAll<HTMLButtonElement>('.calendar button:not(:disabled)')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.host.nativeElement.ownerDocument.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && this.host.nativeElement.ownerDocument.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
  shiftMonth(offset: number): void { this.firstMonth.update((month) => addMonths(month, offset)); }

  choose(day: Date): void {
    const date = this.isoDate(day);
    const currentStart = this.asDate(this.checkIn());
    const currentEnd = this.asDate(this.checkOut());
    if (!currentStart || currentEnd || !isAfter(day, currentStart)) {
      this.rangeChange.emit({ checkIn: date, checkOut: '' });
      return;
    }
    const nights = differenceInCalendarDays(day, currentStart);
    if (nights < 1 || nights > 30) return;
    this.rangeChange.emit({ checkIn: this.isoDate(currentStart), checkOut: date });
  }

  displayDate(value: string): string {
    const date = this.asDate(value);
    return date ? format(date, 'EEE, d MMM yyyy') : '';
  }

  isoDate(date: Date): string { return format(date, 'yyyy-MM-dd'); }
  isFocused(date: Date): boolean { return isSameDay(date, this.focusedDate()); }
  isSelected(date: Date): boolean {
    const start = this.asDate(this.checkIn());
    const end = this.asDate(this.checkOut());
    return (!!start && isSameDay(date, start)) || (!!end && isSameDay(date, end));
  }
  isInRange(date: Date): boolean {
    const start = this.asDate(this.checkIn());
    const end = this.asDate(this.checkOut());
    if (start && !end && isAfter(date, start) && differenceInCalendarDays(date, start) > 30) return true;
    return !!start && !!end && isAfter(date, start) && isBefore(date, end);
  }
  isDisabled(date: Date): boolean {
    const today = indiaToday();
    const maximumStart = addDays(today, 365);
    const lastBookable = addDays(today, 366);
    const start = this.asDate(this.checkIn());
    const choosingCheckOut = !!start && !this.checkOut();
    const invalidCheckout = choosingCheckOut
      && (!isAfter(date, start) || differenceInCalendarDays(date, start) > 30);
    return isBefore(date, today)
      || isAfter(date, choosingCheckOut ? lastBookable : maximumStart)
      || invalidCheckout;
  }

  nightSummary(): string {
    const start = this.asDate(this.checkIn());
    const end = this.asDate(this.checkOut());
    if (!start || !end) return 'Choose dates for your stay';
    const nights = differenceInCalendarDays(end, start);
    return `${nights} ${nights === 1 ? 'night' : 'nights'} selected`;
  }

  onDayKeydown(event: KeyboardEvent, date: Date): void {
    const movements: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    const offset = movements[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const next = addDays(date, offset);
    this.focusedDate.set(next);
    const monthDifference = (next.getFullYear() - this.firstMonth().getFullYear()) * 12
      + next.getMonth() - this.firstMonth().getMonth();
    if (monthDifference < 0) this.firstMonth.set(startOfMonth(next));
    if (monthDifference > 1) this.firstMonth.set(startOfMonth(addMonths(next, -1)));
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLButtonElement>(`[data-date="${this.isoDate(next)}"]`)?.focus());
  }

  private buildMonth(firstDay: Date): CalendarMonth {
    const offset = firstDay.getDay();
    const dayCount = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
    const dates: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let day = 1; day <= dayCount; day++) dates.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), day));
    while (dates.length % 7 !== 0) dates.push(null);
    return { firstDay, dates, monthKey: format(firstDay, 'MMMM yyyy') };
  }

  private asDate(value: string): Date | null {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
}
