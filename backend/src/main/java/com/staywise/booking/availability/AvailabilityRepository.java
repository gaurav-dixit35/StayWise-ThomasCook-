package com.staywise.booking.availability;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<RoomAvailability, RoomAvailabilityId> {
    @Query("select a from RoomAvailability a where a.id.hotelId = :hotelId and a.id.stayDate >= :checkIn and a.id.stayDate < :checkOut order by a.id.stayDate asc")
    List<RoomAvailability> findWindow(@Param("hotelId") long hotelId,
                                      @Param("checkIn") LocalDate checkIn,
                                      @Param("checkOut") LocalDate checkOut);

    @Query("select a from RoomAvailability a where a.id.stayDate >= :checkIn and a.id.stayDate < :checkOut order by a.id.hotelId asc, a.id.stayDate asc")
    List<RoomAvailability> findAllHotelsWindow(@Param("checkIn") LocalDate checkIn,
                                               @Param("checkOut") LocalDate checkOut);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from RoomAvailability a where a.id.hotelId = :hotelId and a.id.stayDate >= :checkIn and a.id.stayDate < :checkOut order by a.id.stayDate asc")
    List<RoomAvailability> lockWindow(@Param("hotelId") long hotelId,
                                      @Param("checkIn") LocalDate checkIn,
                                      @Param("checkOut") LocalDate checkOut);
}
