package com.staywise.booking.hotel;

import jakarta.persistence.*;

@Entity
@Table(name = "hotel_images")
public class HotelImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "hotel_id", nullable = false) private long hotelId;
    @Column(name = "image_url", nullable = false) private String imageUrl;
    @Column(name = "alt_text", nullable = false) private String altText;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    @Column(name = "credit_name", nullable = false) private String creditName;
    @Column(name = "credit_url", nullable = false) private String creditUrl;
    @Column(nullable = false) private String license;
    protected HotelImage() { }
    public long getHotelId() { return hotelId; }
    public String getImageUrl() { return imageUrl; }
    public String getAltText() { return altText; }
    public int getSortOrder() { return sortOrder; }
    public String getCreditName() { return creditName; }
    public String getCreditUrl() { return creditUrl; }
    public String getLicense() { return license; }
}
