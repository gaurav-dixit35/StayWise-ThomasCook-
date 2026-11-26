package com.staywise.booking.hotel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "amenities")
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(name = "icon_key", nullable = false, length = 40)
    private String iconKey;

    protected Amenity() {
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIconKey() { return iconKey; }
}
