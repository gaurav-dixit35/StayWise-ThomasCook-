package com.staywise.booking.booking;

public class CancellationNotAllowedException extends RuntimeException {
    public CancellationNotAllowedException() {
        super("This booking can no longer be cancelled because check-in has started.");
    }
}
