package com.staywise.booking.alternatives;

import com.staywise.booking.availability.AvailabilityRepository;
import com.staywise.booking.availability.RoomAvailability;
import com.staywise.booking.availability.RoomAvailabilityId;
import com.staywise.booking.common.DateRangeValidator;
import com.staywise.booking.hotel.Hotel;
import com.staywise.booking.hotel.HotelRepository;
import com.staywise.booking.hotel.PricingService;
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
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlternativesServiceTest {
    @Mock private HotelRepository hotelRepository;
    @Mock private AvailabilityRepository availabilityRepository;
    private AlternativesService service;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(Instant.parse("2026-11-26T12:00:00Z"), ZoneId.of("Asia/Kolkata"));
        today = LocalDate.now(clock);
        service = new AlternativesService(hotelRepository, availabilityRepository, new PricingService(),
                new DateRangeValidator(clock), clock);
    }

    @Test
    void returnsNearestAvailableWindowsAndCheapestSameCityHotels() {
        LocalDate requested = today.plusDays(10);
        Hotel primary = hotel(3L, "Aravali Palace Heritage", "Jaipur", new BigDecimal("6200.00"));
        Hotel cheaper = hotel(9L, "Pink City Garden", "Jaipur", new BigDecimal("4800.00"));
        Hotel costlier = hotel(10L, "Amber Courtyard", "Jaipur", new BigDecimal("7100.00"));
        when(hotelRepository.findById(3L)).thenReturn(java.util.Optional.of(primary));
        when(hotelRepository.search("Jaipur")).thenReturn(List.of(primary, costlier, cheaper));
        when(availabilityRepository.findWindow(3L, today, requested.plusDays(16)))
                .thenReturn(primaryScan(today, requested));
        when(availabilityRepository.findAllHotelsWindow(requested, requested.plusDays(2)))
                .thenReturn(List.of(row(9L, requested, 5, 1), row(9L, requested.plusDays(1), 5, 1),
                        row(10L, requested, 4, 0), row(10L, requested.plusDays(1), 4, 0)));

        var result = service.findAlternatives(3L, requested, requested.plusDays(2));

        assertThat(result.nearbyDates()).hasSize(4);
        assertThat(result.nearbyDates()).extracting(item -> item.checkIn())
                .containsExactly(requested.minusDays(1), requested.minusDays(2), requested.plusDays(2), requested.minusDays(3));
        assertThat(result.nearbyDates()).noneMatch(item -> item.checkIn().equals(requested));
        assertThat(result.otherHotels()).extracting(item -> item.name())
                .containsExactly("Pink City Garden", "Amber Courtyard");
        assertThat(result.otherHotels().get(0).totalAmount()).isEqualByComparingTo("9600.00");
        verify(availabilityRepository).findWindow(3L, today, requested.plusDays(16));
        verify(availabilityRepository).findAllHotelsWindow(requested, requested.plusDays(2));
    }

    @Test
    void clampsPastSuggestionsAndLeavesNoWindowsWhenAllDatesAreUnavailable() {
        LocalDate requested = today.plusDays(1);
        Hotel primary = hotel(3L, "Aravali Palace Heritage", "Jaipur", new BigDecimal("6200.00"));
        when(hotelRepository.findById(3L)).thenReturn(java.util.Optional.of(primary));
        when(hotelRepository.search("Jaipur")).thenReturn(List.of(primary));
        when(availabilityRepository.findWindow(3L, today, requested.plusDays(16)))
                .thenReturn(List.of(row(3L, today, 6, 6), row(3L, requested, 6, 6),
                        row(3L, requested.plusDays(1), 6, 6), row(3L, requested.plusDays(2), 6, 6),
                        row(3L, requested.plusDays(3), 6, 6), row(3L, requested.plusDays(4), 6, 6),
                        row(3L, requested.plusDays(5), 6, 6), row(3L, requested.plusDays(6), 6, 6),
                        row(3L, requested.plusDays(7), 6, 6), row(3L, requested.plusDays(8), 6, 6),
                        row(3L, requested.plusDays(9), 6, 6), row(3L, requested.plusDays(10), 6, 6),
                        row(3L, requested.plusDays(11), 6, 6), row(3L, requested.plusDays(12), 6, 6),
                        row(3L, requested.plusDays(13), 6, 6), row(3L, requested.plusDays(14), 6, 6),
                        row(3L, requested.plusDays(15), 6, 6)));
        when(availabilityRepository.findAllHotelsWindow(requested, requested.plusDays(2))).thenReturn(List.of());

        var result = service.findAlternatives(3L, requested, requested.plusDays(2));

        assertThat(result.nearbyDates()).isEmpty();
        assertThat(result.otherHotels()).isEmpty();
    }

    private List<RoomAvailability> primaryScan(LocalDate start, LocalDate requested) {
        List<RoomAvailability> rows = new ArrayList<>();
        for (int offset = 0; offset <= 26; offset++) rows.add(row(3L, start.plusDays(offset), 6, 0));
        rows.removeIf(row -> row.getStayDate().equals(requested.plusDays(1)));
        rows.add(row(3L, requested.plusDays(1), 6, 6));
        return rows;
    }

    private Hotel hotel(long id, String name, String city, BigDecimal price) {
        Hotel hotel = instantiate(Hotel.class);
        set(hotel, "id", id);
        set(hotel, "slug", name.toLowerCase().replace(' ', '-'));
        set(hotel, "name", name);
        set(hotel, "city", city);
        set(hotel, "state", "Rajasthan");
        set(hotel, "imageUrl", "/assets/hotels/demo.svg");
        set(hotel, "roomTypeName", "Deluxe Room");
        set(hotel, "pricePerNight", price);
        set(hotel, "totalRooms", 5);
        return hotel;
    }

    private RoomAvailability row(long hotelId, LocalDate day, int capacity, int booked) {
        RoomAvailability row = instantiate(RoomAvailability.class);
        set(row, "id", new RoomAvailabilityId(hotelId, day));
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
