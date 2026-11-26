package com.staywise.booking.hotel;

import com.staywise.booking.availability.AvailabilityRepository;
import com.staywise.booking.availability.RoomAvailability;
import com.staywise.booking.common.DateRangeValidator;
import com.staywise.booking.hotel.dto.AmenityDto;
import com.staywise.booking.hotel.dto.AvailabilityDto;
import com.staywise.booking.hotel.dto.CityDto;
import com.staywise.booking.hotel.dto.HotelDetailDto;
import com.staywise.booking.hotel.dto.HotelSummaryDto;
import com.staywise.booking.hotel.dto.PriceBreakdown;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class HotelService {
    private final HotelRepository hotelRepository;
    private final AvailabilityRepository availabilityRepository;
    private final PricingService pricingService;
    private final DateRangeValidator dateRangeValidator;

    public HotelService(HotelRepository hotelRepository, AvailabilityRepository availabilityRepository,
                        PricingService pricingService, DateRangeValidator dateRangeValidator) {
        this.hotelRepository = hotelRepository;
        this.availabilityRepository = availabilityRepository;
        this.pricingService = pricingService;
        this.dateRangeValidator = dateRangeValidator;
    }

    public List<HotelSummaryDto> search(String city, LocalDate checkIn, LocalDate checkOut) {
        validateOptionalDates(checkIn, checkOut);
        return hotelRepository.search(normalizeCity(city)).stream()
                .map(hotel -> summary(hotel, checkIn, checkOut)).toList();
    }

    public HotelDetailDto find(long id, LocalDate checkIn, LocalDate checkOut) {
        validateOptionalDates(checkIn, checkOut);
        Hotel hotel = hotelRepository.findWithAmenitiesById(id).orElseThrow(HotelNotFoundException::new);
        return detail(hotel, checkIn, checkOut);
    }

    public HotelDetailDto findBySlug(String slug, LocalDate checkIn, LocalDate checkOut) {
        validateOptionalDates(checkIn, checkOut);
        Hotel hotel = hotelRepository.findWithAmenitiesBySlug(slug).orElseThrow(HotelNotFoundException::new);
        return detail(hotel, checkIn, checkOut);
    }

    public List<CityDto> cities() {
        return hotelRepository.findCities();
    }

    public PriceBreakdown quote(long hotelId, LocalDate checkIn, LocalDate checkOut) {
        validateRequiredDates(checkIn, checkOut);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(HotelNotFoundException::new);
        return pricingService.calculate(checkIn, checkOut, hotel.getPricePerNight());
    }

    private HotelSummaryDto summary(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        return new HotelSummaryDto(hotel.getId(), hotel.getSlug(), hotel.getName(), hotel.getCity(), hotel.getState(),
                hotel.getStarRating(), hotel.getDescription(), hotel.getImageUrl(), amenities(hotel),
                hotel.getRoomTypeName(), hotel.getPricePerNight(), availability(hotel, checkIn, checkOut));
    }

    private HotelDetailDto detail(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        return new HotelDetailDto(hotel.getId(), hotel.getSlug(), hotel.getName(), hotel.getCity(), hotel.getState(),
                hotel.getAddress(), hotel.getStarRating(), hotel.getDescription(), hotel.getImageUrl(), amenities(hotel),
                hotel.getRoomTypeName(), hotel.getPricePerNight(), availability(hotel, checkIn, checkOut));
    }

    private List<AmenityDto> amenities(Hotel hotel) {
        return hotel.getAmenities().stream().map(item -> new AmenityDto(item.getName(), item.getIconKey()))
                .sorted((left, right) -> left.name().compareToIgnoreCase(right.name())).toList();
    }

    private AvailabilityDto availability(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null) return AvailabilityDto.unquoted(hotel.getTotalRooms());
        List<RoomAvailability> window = availabilityRepository.findWindow(hotel.getId(), checkIn, checkOut);
        int nights = Math.toIntExact(java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut));
        if (window.size() != nights) return new AvailabilityDto(false, 0, nights, null);
        int roomsLeft = window.stream().mapToInt(RoomAvailability::getRoomsLeft).min().orElse(0);
        return new AvailabilityDto(roomsLeft > 0, roomsLeft, nights,
                pricingService.calculate(checkIn, checkOut, hotel.getPricePerNight()).total());
    }

    private void validateOptionalDates(LocalDate checkIn, LocalDate checkOut) {
        if ((checkIn == null) != (checkOut == null)) {
            throw new IllegalArgumentException("Provide both check-in and check-out dates, or neither.");
        }
        if (checkIn != null) validateRequiredDates(checkIn, checkOut);
    }

    private void validateRequiredDates(LocalDate checkIn, LocalDate checkOut) {
        dateRangeValidator.validate(checkIn, checkOut);
    }

    private String normalizeCity(String city) {
        return city == null || city.isBlank() ? null : city.trim();
    }
}
