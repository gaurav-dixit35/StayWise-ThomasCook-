package com.staywise.booking.alternatives.dto;

import java.util.List;

public record AlternativesResponse(long hotelId, String city, int nights,
                                   List<DateAlternativeDto> nearbyDates,
                                   List<HotelAlternativeDto> otherHotels) {
}
