package com.staywise.booking.hotel.dto;

import java.math.BigDecimal;
import java.util.List;

public record HotelSummaryDto(
        long id,
        String slug,
        String name,
        String city,
        String state,
        int starRating,
        String description,
        String imageUrl,
        String imageAlt,
        String imageFocus,
        List<AmenityDto> amenities,
        String roomTypeName,
        BigDecimal pricePerNight,
        AvailabilityDto availability) {
}
