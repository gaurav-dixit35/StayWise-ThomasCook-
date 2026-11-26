CREATE TABLE hotels (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  star_rating TINYINT NOT NULL,
  room_type_name VARCHAR(80) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  total_rooms INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_hotel_price CHECK (price_per_night > 0),
  CONSTRAINT chk_hotel_rooms CHECK (total_rooms > 0),
  CONSTRAINT chk_hotel_stars CHECK (star_rating BETWEEN 1 AND 5),
  INDEX idx_hotels_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE amenities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  icon_key VARCHAR(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE hotel_amenities (
  hotel_id BIGINT NOT NULL,
  amenity_id BIGINT NOT NULL,
  PRIMARY KEY (hotel_id, amenity_id),
  CONSTRAINT fk_hotel_amenities_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT fk_hotel_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE room_availability (
  hotel_id BIGINT NOT NULL,
  stay_date DATE NOT NULL,
  capacity INT NOT NULL,
  booked_rooms INT NOT NULL DEFAULT 0,
  PRIMARY KEY (hotel_id, stay_date),
  CONSTRAINT fk_availability_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT chk_avail_nonneg CHECK (booked_rooms >= 0),
  CONSTRAINT chk_avail_cap CHECK (capacity > 0 AND booked_rooms <= capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(16) NOT NULL UNIQUE,
  hotel_id BIGINT NOT NULL,
  guest_name VARCHAR(120) NOT NULL,
  guest_email VARCHAR(190) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(12) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  CONSTRAINT fk_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
  CONSTRAINT chk_booking_dates CHECK (check_out > check_in),
  CONSTRAINT chk_booking_nights CHECK (nights > 0),
  CONSTRAINT chk_booking_amount CHECK (price_per_night > 0 AND total_amount > 0),
  CONSTRAINT chk_booking_status CHECK (status IN ('CONFIRMED','CANCELLED')),
  INDEX idx_bookings_email (guest_email),
  INDEX idx_bookings_hotel_dates (hotel_id, check_in, check_out)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
