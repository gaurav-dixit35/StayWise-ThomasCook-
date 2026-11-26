package com.staywise.booking.hotel.dto;

import java.math.BigDecimal;

public record PriceBreakdown(int nights, BigDecimal pricePerNight, BigDecimal subtotal,
                             BigDecimal total, String currency) {
    public PriceBreakdown(int nights, BigDecimal pricePerNight, BigDecimal total, String currency) {
        this(nights, pricePerNight, total, total, currency);
    }
}
