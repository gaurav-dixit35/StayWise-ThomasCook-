package com.staywise.booking.hotel;

import com.staywise.booking.hotel.dto.CityDto;
import com.staywise.booking.hotel.dto.HotelDetailDto;
import com.staywise.booking.hotel.dto.HotelSummaryDto;
import com.staywise.booking.hotel.dto.PriceBreakdown;
import jakarta.validation.constraints.Positive;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@Validated
@RequestMapping("/api")
public class HotelController {
    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/hotels")
    public List<HotelSummaryDto> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return hotelService.search(city, checkIn, checkOut);
    }

    @GetMapping("/hotels/{id}")
    public HotelDetailDto find(@PathVariable @Positive long id,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return hotelService.find(id, checkIn, checkOut);
    }

    @GetMapping("/hotels/slug/{slug}")
    public HotelDetailDto findBySlug(@PathVariable String slug,
                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return hotelService.findBySlug(slug, checkIn, checkOut);
    }

    @GetMapping("/cities")
    public List<CityDto> cities() {
        return hotelService.cities();
    }

    @GetMapping("/hotels/{id}/quote")
    public PriceBreakdown quote(@PathVariable @Positive long id,
                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return hotelService.quote(id, checkIn, checkOut);
    }
}
