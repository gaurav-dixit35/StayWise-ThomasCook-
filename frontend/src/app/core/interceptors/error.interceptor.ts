import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { ErrorNoticeService } from '../services/error-notice.service';

const safeMessages: Record<string, string> = {
  SOLD_OUT: 'Those dates have just sold out. Try another date or stay nearby.',
  HOTEL_NOT_FOUND: 'We could not find that stay. Try another hotel.',
  BOOKING_NOT_FOUND: 'We could not find a booking with those details. Check the reference and email.',
  DATES_OUT_OF_RANGE: 'Choose dates within the next 365 days.',
  DATE_IN_PAST: 'Check-in cannot be in the past.',
  STAY_TOO_LONG: 'A stay can be no longer than 30 nights.',
  CANCELLATION_NOT_ALLOWED: 'This booking can no longer be cancelled.',
  VALIDATION_FAILED: 'Please check the details and try again.',
  MALFORMED_REQUEST: 'Some of those details are not valid. Please check and try again.',
};

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notices = inject(ErrorNoticeService);
  return next(request).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as Partial<ApiError> | null;
      const message = body?.code && safeMessages[body.code]
        ? safeMessages[body.code]
        : 'We could not complete that request. Please try again.';
      if (!request.url.includes('/bookings')) notices.show(message);
    }
    return throwError(() => error);
  }));
};
