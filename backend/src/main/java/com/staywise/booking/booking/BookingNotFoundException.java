package com.staywise.booking.booking;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException() {
        super("We couldn't find a booking with those details.");
    }
}
