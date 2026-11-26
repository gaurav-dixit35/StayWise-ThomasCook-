package com.staywise.booking.common;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.Clock;

@Component
public class DateRangeValidator {
    private final Clock clock;

    public DateRangeValidator(Clock clock) {
        this.clock = clock;
    }

    public void validate(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException("Provide both check-in and check-out dates.");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out must be after check-in.");
        }
        LocalDate today = LocalDate.now(clock);
        if (checkIn.isBefore(today)) throw new DateInPastException();
        if (checkIn.isAfter(today.plusDays(365))) {
            throw new DatesOutOfRangeException("Check-in must be within the next 365 days.");
        }
        if (ChronoUnit.DAYS.between(checkIn, checkOut) > 30) {
            throw new StayTooLongException();
        }
    }
}
