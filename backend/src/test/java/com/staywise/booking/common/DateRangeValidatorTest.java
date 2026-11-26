package com.staywise.booking.common;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DateRangeValidatorTest {
    private final DateRangeValidator validator = new DateRangeValidator(
            Clock.fixed(Instant.parse("2026-11-26T12:00:00Z"), ZoneId.of("Asia/Kolkata")));

    @Test
    void acceptsTodayAndThirtyNightStay() {
        assertThatCode(() -> validator.validate(LocalDate.parse("2026-11-26"), LocalDate.parse("2026-12-26")))
                .doesNotThrowAnyException();
    }

    @Test
    void rejectsPastCheckInAndStayOverThirtyNights() {
        assertThatThrownBy(() -> validator.validate(LocalDate.parse("2026-11-25"), LocalDate.parse("2026-11-27")))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("past");
        assertThatThrownBy(() -> validator.validate(LocalDate.parse("2026-11-26"), LocalDate.parse("2026-12-27")))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("30 nights");
    }

    @Test
    void rejectsInvalidAndTooFarDateRanges() {
        assertThatThrownBy(() -> validator.validate(LocalDate.parse("2026-11-26"), LocalDate.parse("2026-11-26")))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("after");
        assertThatThrownBy(() -> validator.validate(LocalDate.parse("2027-11-27"), LocalDate.parse("2027-11-28")))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("365 days");
    }
}
