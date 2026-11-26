package com.staywise.booking.booking;

public class BookingDatesOutOfRangeException extends RuntimeException {
    public BookingDatesOutOfRangeException() {
        super("Those dates are outside the current bookable window. Please choose dates within the next 365 days.");
    }
}
