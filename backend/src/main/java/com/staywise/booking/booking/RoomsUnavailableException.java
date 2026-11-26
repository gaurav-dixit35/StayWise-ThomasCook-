package com.staywise.booking.booking;

public class RoomsUnavailableException extends RuntimeException {
    public RoomsUnavailableException() {
        super("No rooms are available for all selected nights.");
    }
}
