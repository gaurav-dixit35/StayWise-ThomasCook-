ALTER TABLE hotels ADD COLUMN image_focus VARCHAR(20) NOT NULL DEFAULT 'center';

UPDATE hotels SET image_url = CONCAT('/assets/images/processed/hotels/', slug, '-1.jpg');

CREATE TABLE hotel_images (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hotel_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL,
  credit_name VARCHAR(180) NOT NULL,
  credit_url VARCHAR(500) NOT NULL,
  license VARCHAR(80) NOT NULL,
  CONSTRAINT fk_hotel_images_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT uq_hotel_images_order UNIQUE (hotel_id, sort_order)
);

INSERT INTO hotel_images (hotel_id, image_url, alt_text, sort_order, credit_name, credit_url, license) VALUES
(1,'/assets/images/processed/hotels/sea-glass-house-2.jpg','Hotel bed with pillows and bedside lamp',1,'Dean Zhang','https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY','Unsplash License'),
(1,'/assets/images/processed/hotels/sea-glass-house-3.jpg','Hotel room with TV and bed',2,'Jenevy Vergara','https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg','Unsplash License'),
(2,'/assets/images/processed/hotels/monsoon-courtyard-2.jpg','Hotel room with a bed, chair and window',1,'Wes Hicks','https://unsplash.com/photos/a-hotel-room-with-a-bed-chair-and-window-T6WRDVQBn8M','Unsplash License'),
(2,'/assets/images/processed/hotels/monsoon-courtyard-3.jpg','Bright poolside guest room with a wide window',2,'ikhbale','https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE','Unsplash License'),
(3,'/assets/images/processed/hotels/aravali-palace-heritage-2.jpg','Neatly made hotel bed with pillows and lamp',1,'Dean Zhang','https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY','Unsplash License'),
(3,'/assets/images/processed/hotels/aravali-palace-heritage-3.jpg','Bright guest room with bed, chair and broad window',2,'Wes Hicks','https://unsplash.com/photos/a-hotel-room-with-a-bed-chair-and-window-T6WRDVQBn8M','Unsplash License'),
(4,'/assets/images/processed/hotels/lakehouse-mewar-2.jpg','Neatly made hotel bed with pillows and lamp',1,'Dean Zhang','https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY','Unsplash License'),
(4,'/assets/images/processed/hotels/lakehouse-mewar-3.jpg','Guest room with wide windows and a sitting area',2,'Antonio Araujo','https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y','Unsplash License'),
(5,'/assets/images/processed/hotels/copper-leaf-residence-2.jpg','Neatly made bed in modern hotel room',1,'Meklay YOTKHAMSAY','https://unsplash.com/photos/a-neatly-made-bed-in-a-modern-hotel-room-mNdhu5gl_P4','Unsplash License'),
(5,'/assets/images/processed/hotels/copper-leaf-residence-3.jpg','Comfortable hotel room with bed and window seating',2,'ikhbale','https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE','Unsplash License'),
(6,'/assets/images/processed/hotels/backwater-still-2.jpg','Hotel bed with pillows and bedside lamp',1,'Dean Zhang','https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY','Unsplash License'),
(6,'/assets/images/processed/hotels/backwater-still-3.jpg','Hotel room with a bed and quiet seating area',2,'Jenevy Vergara','https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg','Unsplash License'),
(7,'/assets/images/processed/hotels/cedar-cloud-lodge-2.jpg','Hotel room with bed, chair and window',1,'Wes Hicks','https://unsplash.com/photos/a-hotel-room-with-a-bed-chair-and-window-T6WRDVQBn8M','Unsplash License'),
(7,'/assets/images/processed/hotels/cedar-cloud-lodge-3.jpg','Bright modern guest room with natural wood furniture',2,'Meklay YOTKHAMSAY','https://unsplash.com/photos/a-neatly-made-bed-in-a-modern-hotel-room-mNdhu5gl_P4','Unsplash License'),
(8,'/assets/images/processed/hotels/rain-tree-atelier-2.jpg','Neatly made bed in modern hotel room',1,'Meklay YOTKHAMSAY','https://unsplash.com/photos/a-neatly-made-bed-in-a-modern-hotel-room-mNdhu5gl_P4','Unsplash License'),
(8,'/assets/images/processed/hotels/rain-tree-atelier-3.jpg','Well-lit room with seating and a work desk',2,'Antonio Araujo','https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y','Unsplash License'),
(9,'/assets/images/processed/hotels/pink-city-garden-2.jpg','Hotel room with TV and bed',1,'Jenevy Vergara','https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg','Unsplash License'),
(9,'/assets/images/processed/hotels/pink-city-garden-3.jpg','Modern guest room with soft daylight and wood furnishings',2,'ikhbale','https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE','Unsplash License');
