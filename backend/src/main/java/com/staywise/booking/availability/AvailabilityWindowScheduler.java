package com.staywise.booking.availability;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDate;

/** Maintains nightly inventory through the inclusive 365-day advance window. */
@Component
public class AvailabilityWindowScheduler {
    private static final String INSERT_MISSING_DATES = """
            INSERT IGNORE INTO room_availability (hotel_id, stay_date, capacity, booked_rooms)
            WITH RECURSIVE calendar (stay_date) AS (
              SELECT ?
              UNION ALL
              SELECT DATE_ADD(stay_date, INTERVAL 1 DAY)
              FROM calendar
              WHERE stay_date < ?
            )
            SELECT hotels.id, calendar.stay_date, hotels.total_rooms, 0
            FROM hotels CROSS JOIN calendar
            """;

    private final JdbcTemplate jdbcTemplate;
    private final Clock clock;

    public AvailabilityWindowScheduler(JdbcTemplate jdbcTemplate, Clock clock) {
        this.jdbcTemplate = jdbcTemplate;
        this.clock = clock;
    }

    @Scheduled(cron = "${staywise.availability.cron:0 5 0 * * *}", zone = "Asia/Kolkata")
    public void extendWindow() {
        LocalDate today = LocalDate.now(clock);
        LocalDate lastBookableDate = today.plusDays(365);
        jdbcTemplate.update(INSERT_MISSING_DATES, today, lastBookableDate);
    }
}
