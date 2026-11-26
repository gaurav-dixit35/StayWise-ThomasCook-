package com.staywise.booking.common;

public class DatesOutOfRangeException extends IllegalArgumentException {
    public DatesOutOfRangeException(String message) { super(message); }
}
