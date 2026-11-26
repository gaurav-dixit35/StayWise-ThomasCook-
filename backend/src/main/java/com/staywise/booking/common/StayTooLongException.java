package com.staywise.booking.common;

public class StayTooLongException extends IllegalArgumentException {
    public StayTooLongException() { super("A stay can be no longer than 30 nights."); }
}
