package com.staywise.booking.hotel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 80)
    private String state;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "star_rating", nullable = false)
    private int starRating;

    @Column(name = "room_type_name", nullable = false, length = 80)
    private String roomTypeName;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "total_rooms", nullable = false)
    private int totalRooms;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "hotel_amenities",
            joinColumns = @JoinColumn(name = "hotel_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    private Set<Amenity> amenities = new LinkedHashSet<>();

    protected Hotel() {
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getAddress() { return address; }
    public String getDescription() { return description; }
    public int getStarRating() { return starRating; }
    public String getRoomTypeName() { return roomTypeName; }
    public BigDecimal getPricePerNight() { return pricePerNight; }
    public int getTotalRooms() { return totalRooms; }
    public String getImageUrl() { return imageUrl; }
    public Set<Amenity> getAmenities() { return Set.copyOf(amenities); }

    public void setAmenities(Set<Amenity> amenities) {
        this.amenities = new LinkedHashSet<>(amenities);
    }
}
