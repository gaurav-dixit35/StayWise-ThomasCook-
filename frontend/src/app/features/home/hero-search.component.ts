import { Component, HostBinding, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City } from '../../core/models/hotel.model';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { SearchStateService } from '../../core/services/search-state.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { DateRangePickerComponent, DateRangeValue } from '../../shared/ui/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [FormsModule, ButtonComponent, DateRangePickerComponent],
  template: `
    <form class="search" (ngSubmit)="submit()" aria-label="Search hotel stays">
      <label class="destination">
        <span class="field-label">Where to?</span>
        <input name="city" [ngModel]="city()" (ngModelChange)="city.set($event)" list="staywise-cities" autocomplete="off"
               placeholder="City or destination" aria-describedby="destination-hint" />
        <datalist id="staywise-cities">
          @for (item of cities(); track item.name) { <option [value]="item.name">{{ item.state }}</option> }
        </datalist>
        <span id="destination-hint" class="visually-hidden">Choose an Indian city or leave blank to browse every hotel.</span>
      </label>
      <div class="dates">
        <span class="field-label">When are you going?</span>
        <app-date-range-picker [checkIn]="checkIn()" [checkOut]="checkOut()" (rangeChange)="setRange($event)" />
      </div>
      <app-button type="submit" [fullWidth]="true">Search stays</app-button>
      @if (message()) { <p class="form-message" role="alert">{{ message() }}</p> }
    </form>
  `,
  styleUrl: './hero-search.component.scss',
})
export class HeroSearchComponent implements OnInit {
  @HostBinding('class.compact') @Input() compact = false;
  private readonly hotels = inject(HotelApiService);
  private readonly searchState = inject(SearchStateService);
  readonly cities = signal<City[]>([]);
  readonly city = signal('');
  readonly checkIn = signal('');
  readonly checkOut = signal('');
  readonly message = signal('');

  ngOnInit(): void {
    const criteria = this.searchState.criteria();
    this.city.set(criteria.city);
    this.checkIn.set(criteria.checkIn);
    this.checkOut.set(criteria.checkOut);
    this.hotels.getCities().subscribe((cities) => this.cities.set(cities));
  }

  setRange(value: DateRangeValue): void {
    this.checkIn.set(value.checkIn);
    this.checkOut.set(value.checkOut);
    this.message.set('');
  }

  async submit(): Promise<void> {
    if (!this.checkIn() || !this.checkOut()) {
      this.message.set('Choose check-in and check-out dates to search.');
      return;
    }
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const [year, month, day] = today.split('-').map(Number);
    const maxDate = new Date(year, month - 1, day + 365);
    const [endYear, endMonth, endDay] = this.checkOut().split('-').map(Number);
    if (new Date(endYear, endMonth - 1, endDay) > maxDate) {
      this.message.set('Check-out must be within the next year. Choose an earlier date.');
      return;
    }
    const city = this.cities().find((item) => item.name.toLowerCase() === this.city().trim().toLowerCase());
    if (this.city().trim() && !city) {
      this.message.set('Choose a city from the suggestions, or clear the destination field.');
      return;
    }
    await this.searchState.search({ city: city?.name ?? '', checkIn: this.checkIn(), checkOut: this.checkOut() });
  }
}
