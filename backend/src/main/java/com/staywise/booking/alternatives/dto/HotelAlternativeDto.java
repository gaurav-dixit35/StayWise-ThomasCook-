package com.staywise.booking.alternatives.dto;

import java.math.BigDecimal;

public record HotelAlternativeDto(long hotelId, String slug, String name, String city, String imageUrl,
                                  String roomTypeName, BigDecimal pricePerNight, int roomsLeft,
                                  BigDecimal totalAmount) {
}
