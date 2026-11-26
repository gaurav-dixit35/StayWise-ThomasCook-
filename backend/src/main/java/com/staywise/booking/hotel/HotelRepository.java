package com.staywise.booking.hotel;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    @EntityGraph(attributePaths = "amenities")
    @Query("select distinct h from Hotel h where (:city is null or lower(h.city) = lower(:city)) order by h.city, h.name")
    List<Hotel> search(@Param("city") String city);

    @EntityGraph(attributePaths = "amenities")
    @Query("select h from Hotel h where h.id = :id")
    Optional<Hotel> findWithAmenitiesById(@Param("id") long id);

    @EntityGraph(attributePaths = "amenities")
    @Query("select h from Hotel h where h.slug = :slug")
    Optional<Hotel> findWithAmenitiesBySlug(@Param("slug") String slug);

    @Query("select distinct new com.staywise.booking.hotel.dto.CityDto(h.city, h.state) from Hotel h order by h.city")
    List<com.staywise.booking.hotel.dto.CityDto> findCities();
}
