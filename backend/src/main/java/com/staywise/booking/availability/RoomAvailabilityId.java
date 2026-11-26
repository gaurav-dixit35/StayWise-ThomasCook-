package com.staywise.booking.availability;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class RoomAvailabilityId implements Serializable {
    private Long hotelId;
    private LocalDate stayDate;

    public RoomAvailabilityId() {
    }

    public RoomAvailabilityId(Long hotelId, LocalDate stayDate) {
        this.hotelId = hotelId;
        this.stayDate = stayDate;
    }

    public Long getHotelId() { return hotelId; }
    public LocalDate getStayDate() { return stayDate; }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof RoomAvailabilityId that)) return false;
        return Objects.equals(hotelId, that.hotelId) && Objects.equals(stayDate, that.stayDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hotelId, stayDate);
    }
}
