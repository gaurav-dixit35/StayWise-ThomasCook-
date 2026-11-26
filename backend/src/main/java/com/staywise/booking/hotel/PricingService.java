package com.staywise.booking.hotel;

import com.staywise.booking.hotel.dto.PriceBreakdown;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class PricingService {
    public PriceBreakdown calculate(LocalDate checkIn, LocalDate checkOut, BigDecimal pricePerNight) {
        int nights = Math.toIntExact(ChronoUnit.DAYS.between(checkIn, checkOut));
        BigDecimal nightlyPrice = pricePerNight.setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = nightlyPrice.multiply(BigDecimal.valueOf(nights)).setScale(2, RoundingMode.HALF_UP);
        return new PriceBreakdown(nights, nightlyPrice, total, "INR");
    }
}
