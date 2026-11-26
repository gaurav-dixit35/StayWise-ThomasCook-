package com.staywise.booking.hotel;

public class HotelNotFoundException extends RuntimeException {
    public HotelNotFoundException() {
        super("We couldn't find that hotel.");
    }
}
