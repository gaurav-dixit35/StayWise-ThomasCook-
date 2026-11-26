package com.staywise.booking.booking;

import com.staywise.booking.availability.AvailabilityRepository;
import com.staywise.booking.availability.RoomAvailability;
import com.staywise.booking.common.DateRangeValidator;
import com.staywise.booking.hotel.Hotel;
import com.staywise.booking.hotel.HotelNotFoundException;
import com.staywise.booking.hotel.HotelRepository;
import com.staywise.booking.hotel.PricingService;
import com.staywise.booking.booking.dto.BookingResponse;
import com.staywise.booking.booking.dto.BookingLookupRequest;
import com.staywise.booking.booking.dto.CreateBookingRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {
    private static final Logger LOGGER = LoggerFactory.getLogger(BookingService.class);
    private static final int REFERENCE_RETRIES = 5;

    private final HotelRepository hotelRepository;
    private final AvailabilityRepository availabilityRepository;
    private final BookingRepository bookingRepository;
    private final BookingReferenceGenerator referenceGenerator;
    private final PricingService pricingService;
    private final DateRangeValidator dateRangeValidator;
    private final Clock clock;

    public BookingService(HotelRepository hotelRepository, AvailabilityRepository availabilityRepository,
                          BookingRepository bookingRepository, BookingReferenceGenerator referenceGenerator,
                          PricingService pricingService, DateRangeValidator dateRangeValidator, Clock clock) {
        this.hotelRepository = hotelRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
        this.referenceGenerator = referenceGenerator;
        this.pricingService = pricingService;
        this.dateRangeValidator = dateRangeValidator;
        this.clock = clock;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        dateRangeValidator.validate(request.checkIn(), request.checkOut());
        Hotel hotel = hotelRepository.findById(request.hotelId()).orElseThrow(HotelNotFoundException::new);

        List<RoomAvailability> rows = availabilityRepository.lockWindow(hotel.getId(), request.checkIn(), request.checkOut());
        int nights = Math.toIntExact(java.time.temporal.ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()));
        if (rows.size() != nights) throw new BookingDatesOutOfRangeException();
        if (rows.stream().anyMatch(row -> row.getBookedRooms() >= row.getCapacity())) {
            LOGGER.info("Booking rejected as sold out: hotelId={}, checkIn={}, checkOut={}", hotel.getId(), request.checkIn(), request.checkOut());
            throw new RoomsUnavailableException();
        }

        rows.forEach(RoomAvailability::reserveOneRoom);
        var price = pricingService.calculate(request.checkIn(), request.checkOut(), hotel.getPricePerNight());
        Booking booking = null;
        for (int attempt = 0; attempt < REFERENCE_RETRIES; attempt++) {
            String reference = referenceGenerator.nextReference();
            if (bookingRepository.existsByReference(reference)) continue;
            Booking candidate = new Booking(reference, hotel, request.guestName().trim(), normalizeEmail(request.guestEmail()),
                    request.checkIn(), request.checkOut(), price.nights(), price.pricePerNight(), price.total());
            try {
                booking = bookingRepository.saveAndFlush(candidate);
                break;
            } catch (DataIntegrityViolationException collision) {
                if (attempt == REFERENCE_RETRIES - 1) throw collision;
                LOGGER.debug("Booking reference collision; retrying reference generation.");
            }
        }
        if (booking == null) throw new IllegalStateException("Unable to allocate a unique booking reference.");

        LOGGER.info("Booking created: reference={}, hotelId={}, checkIn={}, nights={}, email={}",
                booking.getReference(), hotel.getId(), booking.getCheckIn(), booking.getNights(), maskEmail(booking.getGuestEmail()));
        return BookingResponse.from(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse findBooking(BookingLookupRequest request) {
        Booking booking = bookingRepository.findByReferenceAndEmail(normalizeReference(request.reference()), normalizeEmail(request.email()))
                .orElseThrow(BookingNotFoundException::new);
        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(BookingLookupRequest request) {
        Booking booking = bookingRepository.findByReferenceAndEmail(normalizeReference(request.reference()), normalizeEmail(request.email()))
                .orElseThrow(BookingNotFoundException::new);

        if (booking.getStatus() == BookingStatus.CANCELLED) return BookingResponse.from(booking);
        if (!LocalDate.now(clock).isBefore(booking.getCheckIn())) throw new CancellationNotAllowedException();

        List<RoomAvailability> rows = availabilityRepository.lockWindow(
                booking.getHotel().getId(), booking.getCheckIn(), booking.getCheckOut());
        if (rows.size() != booking.getNights()) throw new BookingDatesOutOfRangeException();
        rows.forEach(RoomAvailability::releaseOneRoom);
        booking.cancel(Instant.now(clock));
        LOGGER.info("Booking cancelled: reference={}, hotelId={}, checkIn={}, email={}",
                booking.getReference(), booking.getHotel().getId(), booking.getCheckIn(), maskEmail(booking.getGuestEmail()));
        return BookingResponse.from(booking);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeReference(String reference) {
        return reference.trim().toUpperCase(Locale.ROOT);
    }

    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at < 0) return "***";
        String local = email.substring(0, at);
        return (local.isEmpty() ? "*" : local.substring(0, 1) + "***") + email.substring(at);
    }
}
