package com.staywise.booking.booking;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByReference(String reference);

    @EntityGraph(attributePaths = "hotel")
    @Query("select b from Booking b where b.reference = :reference and lower(b.guestEmail) = :email")
    Optional<Booking> findByReferenceAndEmail(@Param("reference") String reference,
                                              @Param("email") String normalizedEmail);
}
