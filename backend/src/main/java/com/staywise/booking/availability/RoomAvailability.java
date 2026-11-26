package com.staywise.booking.availability;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "room_availability")
public class RoomAvailability {
    @EmbeddedId
    private RoomAvailabilityId id;

    @Column(nullable = false)
    private int capacity;

    @Column(name = "booked_rooms", nullable = false)
    private int bookedRooms;

    protected RoomAvailability() {
    }

    public Long getHotelId() { return id == null ? null : id.getHotelId(); }
    public java.time.LocalDate getStayDate() { return id.getStayDate(); }
    public int getCapacity() { return capacity; }
    public int getBookedRooms() { return bookedRooms; }
    public int getRoomsLeft() { return capacity - bookedRooms; }

    public void reserveOneRoom() {
        if (bookedRooms >= capacity) {
            throw new IllegalStateException("Availability row is full.");
        }
        bookedRooms++;
    }

    public void releaseOneRoom() {
        if (bookedRooms <= 0) {
            throw new IllegalStateException("Availability row has no room to release.");
        }
        bookedRooms--;
    }
}
