package com.staywise.booking.booking.dto;

import com.staywise.booking.booking.Booking;
import com.staywise.booking.booking.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(String reference, BookingStatus status, HotelBookingSummary hotel,
                              String guestName, String guestEmail, LocalDate checkIn, LocalDate checkOut,
                              int nights, BigDecimal pricePerNight, BigDecimal totalAmount,
                              Instant createdAt, Instant cancelledAt) {
    public static BookingResponse from(Booking booking) {
        var hotel = booking.getHotel();
        return new BookingResponse(booking.getReference(), booking.getStatus(),
                new HotelBookingSummary(hotel.getId(), hotel.getSlug(), hotel.getName(), hotel.getCity(), hotel.getState()),
                booking.getGuestName(), booking.getGuestEmail(), booking.getCheckIn(), booking.getCheckOut(),
                booking.getNights(), booking.getPricePerNight(), booking.getTotalAmount(),
                booking.getCreatedAt(), booking.getCancelledAt());
    }
}
