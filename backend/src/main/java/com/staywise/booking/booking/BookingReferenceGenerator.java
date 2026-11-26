package com.staywise.booking.booking;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class BookingReferenceGenerator {
    private static final char[] ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    private final SecureRandom secureRandom = new SecureRandom();

    public String nextReference() {
        StringBuilder reference = new StringBuilder("SW-");
        for (int index = 0; index < 8; index++) {
            reference.append(ALPHABET[secureRandom.nextInt(ALPHABET.length)]);
        }
        return reference.toString();
    }
}
