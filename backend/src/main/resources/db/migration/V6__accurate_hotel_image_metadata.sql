ALTER TABLE hotels ADD COLUMN image_alt VARCHAR(255) NOT NULL DEFAULT 'Hotel room';

UPDATE hotels SET image_alt = 'Sunlit guest room with a bed, chair and broad window' WHERE slug = 'sea-glass-house';
UPDATE hotel_images SET alt_text = 'Neatly made hotel bed with pillows and lamp', credit_name = 'Dean Zhang', credit_url = 'https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY', license = 'Unsplash License' WHERE hotel_id = 1 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Hotel room with a large bed and flat screen TV', credit_name = 'ikhbale', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE', license = 'Unsplash License' WHERE hotel_id = 1 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Garden guest room with simple contemporary furnishings' WHERE slug = 'monsoon-courtyard';
UPDATE hotel_images SET alt_text = 'Hotel room with a TV and a bed', credit_name = 'Jenevy Vergara', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg', license = 'Unsplash License' WHERE hotel_id = 2 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Well-lit hotel room with seating and a desk', credit_name = 'Antonio Araujo', credit_url = 'https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y', license = 'Unsplash License' WHERE hotel_id = 2 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Jaipur-inspired heritage hotel room' WHERE slug = 'aravali-palace-heritage';
UPDATE hotel_images SET alt_text = 'Neatly made hotel bed with pillows and lamp', credit_name = 'Dean Zhang', credit_url = 'https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY', license = 'Unsplash License' WHERE hotel_id = 3 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Hotel room with a large bed and flat screen TV', credit_name = 'ikhbale', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE', license = 'Unsplash License' WHERE hotel_id = 3 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Calm guest room for a lakeside stay' WHERE slug = 'lakehouse-mewar';
UPDATE hotel_images SET alt_text = 'Hotel room with a TV and a bed', credit_name = 'Jenevy Vergara', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg', license = 'Unsplash License' WHERE hotel_id = 4 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Well-lit hotel room with seating and a desk', credit_name = 'Antonio Araujo', credit_url = 'https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y', license = 'Unsplash License' WHERE hotel_id = 4 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Bright garden residence guest room' WHERE slug = 'copper-leaf-residence';
UPDATE hotel_images SET alt_text = 'Neatly made hotel bed with pillows and lamp', credit_name = 'Dean Zhang', credit_url = 'https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY', license = 'Unsplash License' WHERE hotel_id = 5 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Hotel room with a large bed and flat screen TV', credit_name = 'ikhbale', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE', license = 'Unsplash License' WHERE hotel_id = 5 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Cool courtyard hotel room' WHERE slug = 'backwater-still';
UPDATE hotel_images SET alt_text = 'Hotel room with a TV and a bed', credit_name = 'Jenevy Vergara', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg', license = 'Unsplash License' WHERE hotel_id = 6 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Well-lit hotel room with seating and a desk', credit_name = 'Antonio Araujo', credit_url = 'https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y', license = 'Unsplash License' WHERE hotel_id = 6 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Mountain lodge bedroom with wood furnishings' WHERE slug = 'cedar-cloud-lodge';
UPDATE hotel_images SET alt_text = 'Neatly made hotel bed with pillows and lamp', credit_name = 'Dean Zhang', credit_url = 'https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY', license = 'Unsplash License' WHERE hotel_id = 7 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Hotel room with a large bed and flat screen TV', credit_name = 'ikhbale', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE', license = 'Unsplash License' WHERE hotel_id = 7 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Modern room with workspace seating' WHERE slug = 'rain-tree-atelier';
UPDATE hotel_images SET alt_text = 'Hotel room with a TV and a bed', credit_name = 'Jenevy Vergara', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-tv-and-a-bed-8hGJaAJyzIg', license = 'Unsplash License' WHERE hotel_id = 8 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Well-lit hotel room with seating and a desk', credit_name = 'Antonio Araujo', credit_url = 'https://unsplash.com/photos/a-well-lit-hotel-room-with-seating-and-a-desk-xQbmc2FnK3Y', license = 'Unsplash License' WHERE hotel_id = 8 AND sort_order = 2;

UPDATE hotels SET image_alt = 'Garden stay bedroom with courtyard light' WHERE slug = 'pink-city-garden';
UPDATE hotel_images SET alt_text = 'Neatly made hotel bed with pillows and lamp', credit_name = 'Dean Zhang', credit_url = 'https://unsplash.com/photos/a-neatly-made-hotel-bed-with-pillows-and-lamp-1EL9yeKl6fY', license = 'Unsplash License' WHERE hotel_id = 9 AND sort_order = 1;
UPDATE hotel_images SET alt_text = 'Hotel room with a large bed and flat screen TV', credit_name = 'ikhbale', credit_url = 'https://unsplash.com/photos/a-hotel-room-with-a-large-bed-and-a-flat-screen-tv-xMbzmWROWxE', license = 'Unsplash License' WHERE hotel_id = 9 AND sort_order = 2;

