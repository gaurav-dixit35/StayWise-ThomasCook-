package com.staywise.booking.hotel;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class PricingServiceTest {
    private final PricingService pricingService = new PricingService();

    @Test
    void calculatesTwoNightPriceAndBreakdown() {
        var price = pricingService.calculate(LocalDate.parse("2026-12-01"), LocalDate.parse("2026-12-03"),
                new BigDecimal("6200.00"));

        assertThat(price.nights()).isEqualTo(2);
        assertThat(price.pricePerNight()).isEqualByComparingTo("6200.00");
        assertThat(price.subtotal()).isEqualByComparingTo("12400.00");
        assertThat(price.total()).isEqualByComparingTo("12400.00");
        assertThat(price.currency()).isEqualTo("INR");
    }

    @Test
    void roundsNightlyPriceToTwoDecimalPlaces() {
        var price = pricingService.calculate(LocalDate.parse("2026-12-01"), LocalDate.parse("2026-12-02"),
                new BigDecimal("1234.567"));

        assertThat(price.pricePerNight()).isEqualByComparingTo("1234.57");
        assertThat(price.total()).isEqualByComparingTo("1234.57");
    }
}
