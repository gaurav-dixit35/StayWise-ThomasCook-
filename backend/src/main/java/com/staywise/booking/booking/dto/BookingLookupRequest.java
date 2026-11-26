package com.staywise.booking.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BookingLookupRequest(
        @NotBlank(message = "Enter your booking reference.") String reference,
        @NotBlank(message = "Enter your email address.") @Email(message = "Enter a valid email address.") String email) {
}
