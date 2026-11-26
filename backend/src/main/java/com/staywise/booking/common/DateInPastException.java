package com.staywise.booking.common;

public class DateInPastException extends IllegalArgumentException {
    public DateInPastException() { super("Check-in cannot be in the past."); }
}
