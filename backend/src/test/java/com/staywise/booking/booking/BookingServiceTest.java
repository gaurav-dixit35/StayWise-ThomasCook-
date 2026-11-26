package com.staywise.booking.booking;

import com.staywise.booking.availability.AvailabilityRepository;
import com.staywise.booking.availability.RoomAvailability;
import com.staywise.booking.availability.RoomAvailabilityId;
import com.staywise.booking.common.DateRangeValidator;
import com.staywise.booking.hotel.Hotel;
import com.staywise.booking.hotel.HotelNotFoundException;
import com.staywise.booking.hotel.HotelRepository;
import com.staywise.booking.hotel.PricingService;
import com.staywise.booking.booking.dto.BookingLookupRequest;
import com.staywise.booking.booking.dto.CreateBookingRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock private HotelRepository hotelRepository;
    @Mock private AvailabilityRepository availabilityRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private BookingReferenceGenerator referenceGenerator;

    private BookingService service;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(Instant.parse("2026-11-26T12:00:00Z"), ZoneId.of("Asia/Kolkata"));
        today = LocalDate.now(clock);
        service = new BookingService(hotelRepository, availabilityRepository, bookingRepository,
                referenceGenerator, new PricingService(), new DateRangeValidator(clock), clock);
    }

    @Test
    void missingAvailabilityNightIsRejectedWithoutSaving() {
        when(hotelRepository.findById(4L)).thenReturn(Optional.of(hotel(4L)));
        when(availabilityRepository.lockWindow(4L, today.plusDays(1), today.plusDays(3)))
                .thenReturn(List.of(row(4L, today.plusDays(1), 2, 0)));

        assertThatThrownBy(() -> service.createBooking(request(today.plusDays(1), today.plusDays(3))))
                .isInstanceOf(BookingDatesOutOfRangeException.class);
        verify(bookingRepository, never()).saveAndFlush(any());
    }

    @Test
    void aFullNightRejectsTheWholeStay() {
        when(hotelRepository.findById(4L)).thenReturn(Optional.of(hotel(4L)));
        when(availabilityRepository.lockWindow(4L, today.plusDays(1), today.plusDays(3))).thenReturn(List.of(
                row(4L, today.plusDays(1), 2, 0), row(4L, today.plusDays(2), 2, 2)));

        assertThatThrownBy(() -> service.createBooking(request(today.plusDays(1), today.plusDays(3))))
                .isInstanceOf(RoomsUnavailableException.class);
        verify(bookingRepository, never()).saveAndFlush(any());
    }

    @Test
    void absentHotelIsReportedAsNotFound() {
        when(hotelRepository.findById(4L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.createBooking(request(today.plusDays(1), today.plusDays(2))))
                .isInstanceOf(HotelNotFoundException.class);
    }

    @Test
    void incorrectEmailDoesNotResolveBooking() {
        when(bookingRepository.findByReferenceAndEmail("SW-ABCDEFGH", "wrong@example.test"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findBooking(new BookingLookupRequest("sw-abcdefgh", " Wrong@Example.test ")))
                .isInstanceOf(BookingNotFoundException.class);
    }

    @Test
    void alreadyCancelledBookingIsReturnedWithoutReleasingCapacityAgain() {
        Booking cancelled = new Booking("SW-ABCDEFGH", hotel(4L), "Guest Name", "guest@example.test",
                today.plusDays(2), today.plusDays(4), 2, new BigDecimal("3200.00"), new BigDecimal("6400.00"));
        cancelled.cancel(Instant.now());
        when(bookingRepository.findByReferenceAndEmail("SW-ABCDEFGH", "guest@example.test"))
                .thenReturn(Optional.of(cancelled));

        var response = service.cancelBooking(new BookingLookupRequest("sw-abcdefgh", " Guest@Example.test "));

        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        verify(availabilityRepository, never()).lockWindow(any(Long.class), any(LocalDate.class), any(LocalDate.class));
    }

    private CreateBookingRequest request(LocalDate checkIn, LocalDate checkOut) {
        return new CreateBookingRequest(4L, "Guest Name", " Guest@Example.test ", checkIn, checkOut);
    }

    private Hotel hotel(long id) {
        Hotel hotel = instantiate(Hotel.class);
        set(hotel, "id", id);
        set(hotel, "pricePerNight", new BigDecimal("3200.00"));
        set(hotel, "totalRooms", 2);
        return hotel;
    }

    private RoomAvailability row(long hotelId, LocalDate night, int capacity, int booked) {
        RoomAvailability row = instantiate(RoomAvailability.class);
        set(row, "id", new RoomAvailabilityId(hotelId, night));
        set(row, "capacity", capacity);
        set(row, "bookedRooms", booked);
        return row;
    }

    private <T> T instantiate(Class<T> type) {
        try {
            var constructor = type.getDeclaredConstructor();
            constructor.setAccessible(true);
            return constructor.newInstance();
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError(exception);
        }
    }

    private void set(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError(exception);
        }
    }
}
