-- Keep the rolling bookable window inclusive: today through today + 365 days (366 nightly rows).
SET SESSION cte_max_recursion_depth = 400;

INSERT INTO room_availability (hotel_id, stay_date, capacity, booked_rooms)
WITH RECURSIVE calendar (stay_date) AS (
  SELECT CURRENT_DATE()
  UNION ALL
  SELECT DATE_ADD(stay_date, INTERVAL 1 DAY)
  FROM calendar
  WHERE stay_date < DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY)
)
SELECT h.id, c.stay_date, h.total_rooms, 0
FROM hotels h
CROSS JOIN calendar c;
