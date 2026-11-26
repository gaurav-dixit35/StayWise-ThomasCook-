package com.staywise.booking.alternatives;

import com.staywise.booking.alternatives.dto.AlternativesResponse;
import com.staywise.booking.alternatives.dto.DateAlternativeDto;
import com.staywise.booking.alternatives.dto.HotelAlternativeDto;
import com.staywise.booking.availability.AvailabilityRepository;
import com.staywise.booking.availability.RoomAvailability;
import com.staywise.booking.common.DateRangeValidator;
import com.staywise.booking.hotel.Hotel;
import com.staywise.booking.hotel.HotelNotFoundException;
import com.staywise.booking.hotel.HotelRepository;
import com.staywise.booking.hotel.PricingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AlternativesService {
    private static final int MAX_ALTERNATIVES = 4;

    private final HotelRepository hotelRepository;
    private final AvailabilityRepository availabilityRepository;
    private final PricingService pricingService;
    private final DateRangeValidator dateRangeValidator;
    private final Clock clock;

    public AlternativesService(HotelRepository hotelRepository, AvailabilityRepository availabilityRepository,
                               PricingService pricingService, DateRangeValidator dateRangeValidator, Clock clock) {
        this.hotelRepository = hotelRepository;
        this.availabilityRepository = availabilityRepository;
        this.pricingService = pricingService;
        this.dateRangeValidator = dateRangeValidator;
        this.clock = clock;
    }

    public AlternativesResponse findAlternatives(long hotelId, LocalDate checkIn, LocalDate checkOut) {
        dateRangeValidator.validate(checkIn, checkOut);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(HotelNotFoundException::new);
        int nights = Math.toIntExact(ChronoUnit.DAYS.between(checkIn, checkOut));
        LocalDate today = LocalDate.now(clock);
        LocalDate windowStart = checkIn.minusDays(14).isBefore(today) ? today : checkIn.minusDays(14);
        LocalDate windowEnd = checkIn.plusDays(14).plusDays(nights);
        LocalDate bookableEndExclusive = today.plusDays(366);
        if (windowEnd.isAfter(bookableEndExclusive)) windowEnd = bookableEndExclusive;

        List<RoomAvailability> scanRows = availabilityRepository.findWindow(hotelId, windowStart, windowEnd);
        Map<LocalDate, Integer> roomsByDate = scanRows.stream()
                .collect(Collectors.toMap(RoomAvailability::getStayDate, RoomAvailability::getRoomsLeft));

        List<DateAlternativeDto> nearbyDates = new ArrayList<>();
        for (int distance = 0; distance <= 14 && nearbyDates.size() < MAX_ALTERNATIVES; distance++) {
            if (distance == 0) continue;
            LocalDate earlier = checkIn.minusDays(distance);
            LocalDate later = checkIn.plusDays(distance);
            addDateCandidate(nearbyDates, earlier, nights, checkIn, roomsByDate, today, bookableEndExclusive, hotel);
            if (nearbyDates.size() < MAX_ALTERNATIVES) {
                addDateCandidate(nearbyDates, later, nights, checkIn, roomsByDate, today, bookableEndExclusive, hotel);
            }
        }

        Map<Long, Map<LocalDate, Integer>> cityAvailability = availabilityRepository.findAllHotelsWindow(checkIn, checkOut)
                .stream().collect(Collectors.groupingBy(RoomAvailability::getHotelId,
                        Collectors.toMap(RoomAvailability::getStayDate, RoomAvailability::getRoomsLeft)));
        List<HotelAlternativeDto> otherHotels = hotelRepository.search(hotel.getCity()).stream()
                .filter(candidate -> !candidate.getId().equals(hotel.getId()))
                .map(candidate -> alternativeForHotel(candidate, checkIn, checkOut, nights, cityAvailability))
                .filter(candidate -> candidate != null)
                .sorted(Comparator.comparing(HotelAlternativeDto::pricePerNight).thenComparing(HotelAlternativeDto::name))
                .limit(MAX_ALTERNATIVES).toList();

        return new AlternativesResponse(hotel.getId(), hotel.getCity(), nights, List.copyOf(nearbyDates), otherHotels);
    }

    private void addDateCandidate(List<DateAlternativeDto> result, LocalDate candidateStart, int nights,
                                  LocalDate requestedStart, Map<LocalDate, Integer> roomsByDate,
                                  LocalDate today, LocalDate bookableEndExclusive, Hotel hotel) {
        if (!candidateStart.isAfter(today.minusDays(1)) || candidateStart.equals(requestedStart)) return;
        LocalDate candidateEnd = candidateStart.plusDays(nights);
        if (candidateEnd.isAfter(bookableEndExclusive)) return;
        int roomsLeft = windowRoomsLeft(candidateStart, candidateEnd, roomsByDate);
        if (roomsLeft <= 0) return;
        var price = pricingService.calculate(candidateStart, candidateEnd, hotel.getPricePerNight());
        result.add(new DateAlternativeDto(candidateStart, candidateEnd, roomsLeft, price.total()));
    }

    private HotelAlternativeDto alternativeForHotel(Hotel candidate, LocalDate checkIn,
                                                     LocalDate checkOut, int nights,
                                                     Map<Long, Map<LocalDate, Integer>> cityAvailability) {
        int roomsLeft = windowRoomsLeft(checkIn, checkOut,
                cityAvailability.getOrDefault(candidate.getId(), Map.of()));
        if (roomsLeft <= 0) return null;
        var price = pricingService.calculate(checkIn, checkOut, candidate.getPricePerNight());
        return new HotelAlternativeDto(candidate.getId(), candidate.getSlug(), candidate.getName(), candidate.getCity(),
                candidate.getImageUrl(), candidate.getRoomTypeName(), candidate.getPricePerNight(), roomsLeft, price.total());
    }

    private int windowRoomsLeft(LocalDate start, LocalDate end, Map<LocalDate, Integer> roomsByDate) {
        int expectedNights = Math.toIntExact(ChronoUnit.DAYS.between(start, end));
        int minimum = Integer.MAX_VALUE;
        for (int offset = 0; offset < expectedNights; offset++) {
            Integer roomsLeft = roomsByDate.get(start.plusDays(offset));
            if (roomsLeft == null) return 0;
            minimum = Math.min(minimum, roomsLeft);
        }
        return minimum == Integer.MAX_VALUE ? 0 : minimum;
    }
}
