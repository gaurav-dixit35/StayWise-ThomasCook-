package com.staywise.booking.alternatives.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DateAlternativeDto(LocalDate checkIn, LocalDate checkOut, int roomsLeft, BigDecimal totalAmount) {
}
