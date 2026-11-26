package com.staywise.booking.hotel;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {
    List<HotelImage> findByHotelIdOrderBySortOrder(long hotelId);
}
