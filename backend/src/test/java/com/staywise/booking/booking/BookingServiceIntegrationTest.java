package com.staywise.booking.booking;

import com.staywise.booking.booking.dto.BookingLookupRequest;
import com.staywise.booking.booking.dto.CreateBookingRequest;
import com.staywise.booking.availability.AvailabilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class BookingServiceIntegrationTest {
    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("staywise_test")
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
    @Autowired private AvailabilityRepository availabilityRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private Clock clock;

    @BeforeEach
    void clearTestWindow() {
        LocalDate start = LocalDate.now(clock).plusDays(40);
        jdbcTemplate.update("UPDATE room_availability SET booked_rooms = 0 WHERE hotel_id = 9 AND stay_date >= ? AND stay_date < ?",
                start, start.plusDays(40));
    }

    @Test
    void bookingIncrementsEveryNightAndBackToBackStaysDoNotConflict() {
        LocalDate checkIn = LocalDate.now(clock).plusDays(40);
        var first = bookingService.createBooking(request(checkIn, checkIn.plusDays(2), "first@example.test"));
        var second = bookingService.createBooking(request(checkIn.plusDays(2), checkIn.plusDays(4), "second@example.test"));

        assertThat(first.nights()).isEqualTo(2);
        assertThat(first.totalAmount()).isEqualByComparingTo("9600.00");
        assertThat(second.status()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(availabilityRepository.findWindow(9L, checkIn, checkIn.plusDays(4)))
                .allSatisfy(row -> assertThat(row.getBookedRooms()).isEqualTo(1));
    }

    @Test
    void soldOutSingleNightRejectsStayAndOverlappingStayCannotBook() {
        LocalDate checkIn = LocalDate.now(clock).plusDays(40);
        jdbcTemplate.update("UPDATE room_availability SET booked_rooms = capacity WHERE hotel_id = 9 AND stay_date = ?",
                checkIn.plusDays(1));

        assertThatThrownBy(() -> bookingService.createBooking(request(checkIn, checkIn.plusDays(2), "full@example.test")))
                .isInstanceOf(RoomsUnavailableException.class);

        jdbcTemplate.update("UPDATE room_availability SET booked_rooms = 0 WHERE hotel_id = 9 AND stay_date >= ? AND stay_date < ?",
                checkIn, checkIn.plusDays(2));
        bookingService.createBooking(request(checkIn, checkIn.plusDays(2), "one@example.test"));
        assertThatThrownBy(() -> bookingService.createBooking(request(checkIn.plusDays(1), checkIn.plusDays(3), "two@example.test")))
                .isInstanceOf(RoomsUnavailableException.class);
    }

    @Test
    void cancellationReleasesAvailabilityAndDoubleCancellationIsSafe() {
        LocalDate checkIn = LocalDate.now(clock).plusDays(40);
        var created = bookingService.createBooking(request(checkIn, checkIn.plusDays(3), "cancel@example.test"));
        BookingLookupRequest lookup = new BookingLookupRequest(created.reference(), " CANCEL@Example.Test ");

        assertThat(bookingService.cancelBooking(lookup).status()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(bookingService.cancelBooking(lookup).status()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(availabilityRepository.findWindow(9L, checkIn, checkIn.plusDays(3)))
                .allSatisfy(row -> assertThat(row.getBookedRooms()).isZero());
        assertThat(bookingService.createBooking(request(checkIn, checkIn.plusDays(3), "replacement@example.test")))
                .isNotNull();
    }

    @Test
    void lookupWithWrongEmailReturnsNotFound() {
        LocalDate checkIn = LocalDate.now(clock).plusDays(40);
        var created = bookingService.createBooking(request(checkIn, checkIn.plusDays(1), "owner@example.test"));

        assertThatThrownBy(() -> bookingService.findBooking(new BookingLookupRequest(created.reference(), "other@example.test")))
                .isInstanceOf(BookingNotFoundException.class);
    }

    private CreateBookingRequest request(LocalDate start, LocalDate end, String email) {
        return new CreateBookingRequest(9L, "Integration Guest", email, start, end);
    }
}
