package com.staywise.booking.hotel.dto;

import java.math.BigDecimal;

public record AvailabilityDto(boolean available, int roomsLeft, int nights, BigDecimal totalAmount) {
    public static AvailabilityDto unquoted(int roomsLeft) {
        return new AvailabilityDto(roomsLeft > 0, roomsLeft, 0, null);
    }
}
