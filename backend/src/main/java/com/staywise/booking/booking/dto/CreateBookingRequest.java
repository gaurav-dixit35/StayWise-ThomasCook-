package com.staywise.booking.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record CreateBookingRequest(
        @Positive(message = "Choose a valid hotel.") long hotelId,
        @NotBlank(message = "Enter your full name.")
        @Size(max = 120, message = "Name must be 120 characters or fewer.")
        String guestName,
        @NotBlank(message = "Enter your email address.")
        @Email(message = "Enter a valid email address.")
        @Size(max = 190, message = "Email must be 190 characters or fewer.")
        String guestEmail,
        LocalDate checkIn,
        LocalDate checkOut) {
}
