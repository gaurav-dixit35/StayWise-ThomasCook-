import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorNoticeService } from '../services/error-notice.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpTestingController;
  let notices: ErrorNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        ErrorNoticeService,
      ],
    });
    http = TestBed.inject(HttpTestingController);
    notices = TestBed.inject(ErrorNoticeService);
  });

  afterEach(() => http.verify());

  it('maps a known API error to a safe notice and preserves the HTTP error', () => {
    let receivedError: unknown;
    TestBed.inject(HttpClient).get('/api/hotels').subscribe({
      error: (error: unknown) => { receivedError = error; },
    });
    http.expectOne('/api/hotels').flush({ code: 'SOLD_OUT', message: 'Unsafe server text' }, {
      status: 409, statusText: 'Conflict',
    });

    expect(notices.message()).toBe('Those dates have just sold out. Try another date or stay nearby.');
    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
  });

  it('does not create a global notice for booking endpoints', () => {
    TestBed.inject(HttpClient).post('/api/bookings', {}).subscribe({ error: () => undefined });
    http.expectOne('/api/bookings').flush({ code: 'SOLD_OUT' }, { status: 409, statusText: 'Conflict' });

    expect(notices.message()).toBeNull();
  });
});
