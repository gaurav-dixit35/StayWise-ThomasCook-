INSERT INTO hotels (id, slug, name, city, state, address, description, star_rating, room_type_name, price_per_night, total_rooms, image_url) VALUES
(1, 'sea-glass-house', 'Sea Glass House', 'Mumbai', 'Maharashtra', '18 Palm Court Road, Bandra West, Mumbai', 'A quiet coastal residence tucked between Bandra’s leafy lanes and the Arabian Sea. Sunlit rooms, a small library, and thoughtful local breakfasts make it an easy base for the city.', 4, 'Harbour Deluxe Room', 7800.00, 5, '/assets/hotels/sea-glass-house.svg'),
(2, 'monsoon-courtyard', 'Monsoon Courtyard', 'Goa', 'Goa', '42 Nila Garden Lane, Assagao, Goa', 'A restored laterite home set among old trees and village gardens. Spend slow afternoons by the pool, then discover the independent kitchens and galleries of North Goa.', 4, 'Garden Verandah Room', 9200.00, 4, '/assets/hotels/monsoon-courtyard.svg'),
(3, 'aravali-palace-heritage', 'Aravali Palace Heritage', 'Jaipur', 'Rajasthan', '7 Gulab Bagh Road, Civil Lines, Jaipur', 'A modern haveli shaped by Jaipur’s courtyards, carved screens, and warm sandstone. The rooftop looks towards the Aravalli hills, while calm interiors offer a retreat from the old city.', 5, 'Deluxe Heritage Room', 6200.00, 6, '/assets/hotels/aravali-palace-heritage.svg'),
(4, 'lakehouse-mewar', 'Lakehouse Mewar', 'Udaipur', 'Rajasthan', '11 Fateh Sagar View, Udaipur', 'A small lakeside hideaway with shaded balconies and views across the water to the Aravalli foothills. Local stone, handwoven textiles, and an unhurried kitchen keep the experience rooted in Mewar.', 5, 'Lake View Suite', 11800.00, 3, '/assets/hotels/lakehouse-mewar.svg'),
(5, 'copper-leaf-residence', 'Copper Leaf Residence', 'New Delhi', 'Delhi', '26 Neem Marg, Chanakyapuri, New Delhi', 'A composed garden residence within easy reach of the capital’s museums and diplomatic quarter. Generous rooms, a leafy breakfast terrace, and considered service make city days feel lighter.', 4, 'Garden Residence Room', 8400.00, 8, '/assets/hotels/copper-leaf-residence.svg'),
(6, 'backwater-still', 'Backwater Still', 'Kochi', 'Kerala', '5 Kadal Street, Fort Kochi, Kochi', 'A contemporary retreat in a restored island warehouse, a short walk from the old harbour. The courtyard stays cool through the day and the kitchen follows Kerala’s seasonal produce.', 4, 'Courtyard Room', 6800.00, 5, '/assets/hotels/backwater-still.svg'),
(7, 'cedar-cloud-lodge', 'Cedar Cloud Lodge', 'Shimla', 'Himachal Pradesh', '3 Pine Crest Walk, Mashobra, Shimla', 'Set above the bustle among cedar and oak, this intimate lodge opens onto long Himalayan views. Fireside reading rooms and a small seasonal kitchen suit quiet mountain mornings.', 4, 'Mountain Loft Room', 10500.00, 4, '/assets/hotels/cedar-cloud-lodge.svg'),
(8, 'rain-tree-atelier', 'Rain Tree Atelier', 'Bengaluru', 'Karnataka', '14 Gulmohar Crescent, Indiranagar, Bengaluru', 'A design-led city house beneath old rain trees, with calm rooms and generous work-friendly corners. The garden café, nearby independent restaurants, and quick metro access balance work and weekend stays.', 3, 'Atelier King Room', 5400.00, 7, '/assets/hotels/rain-tree-atelier.svg'),
(9, 'pink-city-garden', 'Pink City Garden', 'Jaipur', 'Rajasthan', '12 Kesari Bagh, Civil Lines, Jaipur', 'A contemporary garden stay on a quiet Jaipur avenue, with shaded lawns and a relaxed all-day dining room. Its bright, airy rooms offer an easy base for the old city, local craft markets, and evenings beneath the Aravalli sky.', 4, 'Courtyard King Room', 4800.00, 5, '/assets/hotels/pink-city-garden.svg');

INSERT INTO amenities (id, name, icon_key) VALUES
(1, 'Free Wi-Fi', 'wifi'), (2, 'Swimming pool', 'pool'), (3, 'Spa and wellness', 'spa'),
(4, 'Restaurant', 'restaurant'), (5, 'Air conditioning', 'snowflake'), (6, 'Complimentary breakfast', 'coffee'),
(7, 'Airport transfer', 'car'), (8, 'Garden', 'flower'), (9, 'Fitness room', 'dumbbell'),
(10, 'Work lounge', 'briefcase'), (11, 'Lake views', 'waves'), (12, 'Heritage architecture', 'landmark');

INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES
(1,1),(1,4),(1,5),(1,6),(1,7),(1,10),
(2,1),(2,2),(2,4),(2,5),(2,6),(2,8),(2,12),
(3,1),(3,3),(3,4),(3,5),(3,6),(3,8),(3,12),
(4,1),(4,2),(4,3),(4,4),(4,5),(4,11),(4,12),
(5,1),(5,4),(5,5),(5,6),(5,7),(5,8),(5,10),
(6,1),(6,4),(6,5),(6,6),(6,8),(6,12),
(7,1),(7,3),(7,4),(7,5),(7,6),(7,8),(7,12),
(8,1),(8,4),(8,5),(8,6),(8,9),(8,10),(8,12),
(9,1),(9,2),(9,4),(9,5),(9,6),(9,8),(9,10);
