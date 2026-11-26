# StayWise entity relationship diagram

```mermaid
erDiagram
    HOTELS ||--o{ HOTEL_AMENITIES : offers
    AMENITIES ||--o{ HOTEL_AMENITIES : describes
    HOTELS ||--o{ ROOM_AVAILABILITY : has_nightly_inventory
    HOTELS ||--o{ BOOKINGS : receives

    HOTELS {
        bigint id PK
        varchar slug UK
        varchar name
        varchar city
        varchar state
        decimal price_per_night
        int total_rooms
    }
    AMENITIES {
        bigint id PK
        varchar name UK
        varchar icon_key
    }
    HOTEL_AMENITIES {
        bigint hotel_id PK,FK
        bigint amenity_id PK,FK
    }
    ROOM_AVAILABILITY {
        bigint hotel_id PK,FK
        date stay_date PK
        int capacity
        int booked_rooms
    }
    BOOKINGS {
        bigint id PK
        varchar reference UK
        bigint hotel_id FK
        varchar guest_name
        varchar guest_email
        date check_in
        date check_out
        int nights
        decimal price_per_night
        decimal total_amount
        varchar status
    }
```

`HOTEL_AMENITIES` is the many-to-many join. `ROOM_AVAILABILITY` uses `(hotel_id, stay_date)` as a composite key so each room-night has independent capacity and booked count. Bookings keep the nightly price at creation time, preserving the amount quoted even if the catalog price changes later. The deployed DDL and constraints are in `backend/src/main/resources/db/migration/V1__schema.sql`.
