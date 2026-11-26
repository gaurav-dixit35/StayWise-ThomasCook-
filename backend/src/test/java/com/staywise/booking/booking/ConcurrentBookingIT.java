package com.staywise.booking.booking;

import com.staywise.booking.booking.dto.CreateBookingRequest;
import org.junit.jupiter.api.RepeatedTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class ConcurrentBookingIT {
    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("staywise_concurrency")
            .withUsername("staywise_test")
            .withPassword("staywise_test");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
    }

    @Autowired private BookingService bookingService;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private Clock clock;

    @RepeatedTest(2)
    void tenConcurrentRequestsForOneRemainingRoomConfirmExactlyOne() throws Exception {
        raceBookingsForCapacity(1, 80);
    }

    @RepeatedTest(2)
    void tenConcurrentRequestsForFiveRoomsConfirmExactlyFive() throws Exception {
        raceBookingsForCapacity(5, 90);
    }

    private void raceBookingsForCapacity(int capacity, int daysAhead) throws Exception {
        LocalDate checkIn = LocalDate.now(clock).plusDays(daysAhead);
        LocalDate checkOut = checkIn.plusDays(2);
        int alreadyBooked = 5 - capacity;
        jdbcTemplate.update("UPDATE room_availability SET booked_rooms = ? WHERE hotel_id = 9 AND stay_date >= ? AND stay_date < ?",
                alreadyBooked, checkIn, checkOut);
        int initialBookings = Math.toIntExact(bookingRepository.count());
        int attempts = 10;
        var executor = Executors.newFixedThreadPool(attempts);
        CountDownLatch ready = new CountDownLatch(attempts);
        CountDownLatch start = new CountDownLatch(1);
        AtomicInteger succeeded = new AtomicInteger();
        AtomicInteger soldOut = new AtomicInteger();
        List<java.util.concurrent.Future<?>> tasks = new ArrayList<>();

        for (int index = 0; index < attempts; index++) {
            final int requestId = index;
            tasks.add(executor.submit(() -> {
                ready.countDown();
                if (!start.await(10, TimeUnit.SECONDS)) throw new IllegalStateException("Start gate timed out.");
                try {
                    bookingService.createBooking(new CreateBookingRequest(9L, "Concurrent Guest",
                            "concurrent" + requestId + "@example.test", checkIn, checkOut));
                    succeeded.incrementAndGet();
                } catch (RoomsUnavailableException expected) {
                    soldOut.incrementAndGet();
                }
                return null;
            }));
        }

        assertThat(ready.await(10, TimeUnit.SECONDS)).isTrue();
        start.countDown();
        for (var task : tasks) task.get(30, TimeUnit.SECONDS);
        executor.shutdownNow();

        Integer booked = jdbcTemplate.queryForObject(
                "SELECT MIN(booked_rooms) FROM room_availability WHERE hotel_id = 9 AND stay_date >= ? AND stay_date < ?",
                Integer.class, checkIn, checkOut);
        assertThat(succeeded.get()).isEqualTo(capacity);
        assertThat(soldOut.get()).isEqualTo(attempts - capacity);
        assertThat(booked).isEqualTo(alreadyBooked + capacity);
        assertThat(bookingRepository.count()).isEqualTo(initialBookings + capacity);
    }
}
