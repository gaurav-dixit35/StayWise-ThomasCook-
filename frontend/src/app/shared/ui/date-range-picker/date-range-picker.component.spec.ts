import { TestBed } from '@angular/core/testing';
import { addDays, format } from 'date-fns';
import { DateRangePickerComponent } from './date-range-picker.component';

function indiaToday(): Date {
  const value = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

describe('DateRangePickerComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [DateRangePickerComponent] }));

  it('disables past check-in dates and allows today through the inclusive advance boundary', () => {
    const fixture = TestBed.createComponent(DateRangePickerComponent);
    const picker = fixture.componentInstance;
    const today = indiaToday();

    expect(picker.isDisabled(addDays(today, -1))).toBe(true);
    expect(picker.isDisabled(today)).toBe(false);
    expect(picker.isDisabled(addDays(today, 365))).toBe(false);
    expect(picker.isDisabled(addDays(today, 366))).toBe(true);
    fixture.destroy();
  });

  it('allows one through thirty nights and rejects checkout outside that range', () => {
    const fixture = TestBed.createComponent(DateRangePickerComponent);
    const picker = fixture.componentInstance;
    const checkIn = addDays(indiaToday(), 10);
    fixture.componentRef.setInput('checkIn', format(checkIn, 'yyyy-MM-dd'));
    fixture.componentRef.setInput('checkOut', '');
    fixture.detectChanges();

    expect(picker.isDisabled(addDays(checkIn, 1))).toBe(false);
    expect(picker.isDisabled(addDays(checkIn, 30))).toBe(false);
    expect(picker.isDisabled(checkIn)).toBe(true);
    expect(picker.isDisabled(addDays(checkIn, 31))).toBe(true);
    fixture.destroy();
  });
});
