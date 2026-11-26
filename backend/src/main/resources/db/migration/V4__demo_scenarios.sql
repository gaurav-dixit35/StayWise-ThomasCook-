-- All demo dates are relative to the database's current date so scenarios remain usable.
-- Aravali Palace: all six rooms are booked for a three-night window starting 21 days ahead.
INSERT INTO bookings (reference, hotel_id, guest_name, guest_email, check_in, check_out, nights, price_per_night, total_amount, status)
SELECT seq.reference, 3, CONCAT('Demo Guest ', seq.n), CONCAT('demo', seq.n, '@example.test'), DATE_ADD(CURRENT_DATE(), INTERVAL 21 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 24 DAY), 3, 6200.00, 18600.00, 'CONFIRMED'
FROM (
  SELECT 1 AS n, 'SW-AAAAAAA2' AS reference UNION ALL SELECT 2, 'SW-AAAAAAA3'
  UNION ALL SELECT 3, 'SW-AAAAAAA4' UNION ALL SELECT 4, 'SW-AAAAAAA5'
  UNION ALL SELECT 5, 'SW-AAAAAAA6' UNION ALL SELECT 6, 'SW-AAAAAAA7'
) seq;

UPDATE room_availability
SET booked_rooms = 6
WHERE hotel_id = 3
  AND stay_date >= DATE_ADD(CURRENT_DATE(), INTERVAL 21 DAY)
  AND stay_date < DATE_ADD(CURRENT_DATE(), INTERVAL 24 DAY);

-- Sea Glass House: exactly one room remains for a three-night window starting 28 days ahead.
INSERT INTO bookings (reference, hotel_id, guest_name, guest_email, check_in, check_out, nights, price_per_night, total_amount, status)
SELECT seq.reference, 1, CONCAT('Demo Guest ', seq.n + 10), CONCAT('demo', seq.n + 10, '@example.test'), DATE_ADD(CURRENT_DATE(), INTERVAL 28 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 31 DAY), 3, 7800.00, 23400.00, 'CONFIRMED'
FROM (
  SELECT 1 AS n, 'SW-BBBBBBB2' AS reference UNION ALL SELECT 2, 'SW-BBBBBBB3'
  UNION ALL SELECT 3, 'SW-BBBBBBB4' UNION ALL SELECT 4, 'SW-BBBBBBB5'
) seq;

UPDATE room_availability
SET booked_rooms = 4
WHERE hotel_id = 1
  AND stay_date >= DATE_ADD(CURRENT_DATE(), INTERVAL 28 DAY)
  AND stay_date < DATE_ADD(CURRENT_DATE(), INTERVAL 31 DAY);

-- Monsoon Courtyard: exactly two rooms remain for a three-night window starting 35 days ahead.
INSERT INTO bookings (reference, hotel_id, guest_name, guest_email, check_in, check_out, nights, price_per_night, total_amount, status)
SELECT seq.reference, 2, CONCAT('Demo Guest ', seq.n + 20), CONCAT('demo', seq.n + 20, '@example.test'), DATE_ADD(CURRENT_DATE(), INTERVAL 35 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 38 DAY), 3, 9200.00, 27600.00, 'CONFIRMED'
FROM (
  SELECT 1 AS n, 'SW-CCCCCCC2' AS reference UNION ALL SELECT 2, 'SW-CCCCCCC3'
) seq;

UPDATE room_availability
SET booked_rooms = 2
WHERE hotel_id = 2
  AND stay_date >= DATE_ADD(CURRENT_DATE(), INTERVAL 35 DAY)
  AND stay_date < DATE_ADD(CURRENT_DATE(), INTERVAL 38 DAY);
