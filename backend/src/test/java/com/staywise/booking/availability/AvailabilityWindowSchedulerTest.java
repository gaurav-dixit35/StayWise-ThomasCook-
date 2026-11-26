package com.staywise.booking.availability;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AvailabilityWindowSchedulerTest {
    @Mock private JdbcTemplate jdbcTemplate;

    @Test
    void fillsTheInclusiveRollingWindowUsingTheInjectedClock() {
        Clock clock = Clock.fixed(Instant.parse("2026-04-10T01:00:00Z"), ZoneId.of("Asia/Kolkata"));
        AvailabilityWindowScheduler scheduler = new AvailabilityWindowScheduler(jdbcTemplate, clock);
        scheduler.extendWindow();

        verify(jdbcTemplate).update(anyString(), eq(LocalDate.of(2026, 4, 10)), eq(LocalDate.of(2027, 4, 10)));
    }
}
