package com.staywise.booking.hotel.dto;

import java.math.BigDecimal;
import java.util.List;

public record HotelDetailDto(
        long id,
        String slug,
        String name,
        String city,
        String state,
        String address,
        int starRating,
        String description,
        String imageUrl,
        List<AmenityDto> amenities,
        String roomTypeName,
        BigDecimal pricePerNight,
        AvailabilityDto availability) {
}
