# StayWise demo walkthrough

This three to four minute walkthrough uses the relative scenarios in `V4__demo_scenarios.sql`. Since the dates are relative to the database's current date, calculate them as you demo:

- Sold out at Aravali Palace Heritage, Jaipur: check-in today +21 days, check-out +24 days. All six rooms are reserved.
- One room left at Sea Glass House, Mumbai: check-in today +28 days, check-out +31 days.
- Two rooms left at Monsoon Courtyard, Goa: check-in today +35 days, check-out +38 days.

## Run the portal

1. Copy `.env.example` to `.env` and run `docker compose up -d` from the repository root.
2. Start Spring Boot from `backend` with `./mvnw spring-boot:run` (Windows: `./mvnw.cmd spring-boot:run`). Flyway installs the schema and seed scenarios at startup.
3. Start Angular from `frontend` with `npm start`, then open `http://localhost:4200`.

## Walkthrough

1. **Home:** Point out the StayWise mark and wordmark, search-first layout, India destinations, clear date picker, and Jaipur destination card. Choose Jaipur and a stay from today +21 to +24 days, then search.
2. **Results and alternatives:** Aravali Palace Heritage is sold out. Explain that the page reports sold-out status and offers same-hotel nearby dates plus available hotels in Jaipur. Choose a suggested date window to rerun the search, or open Pink City Garden to compare a same-city hotel.
3. **Hotel details:** Open any available stay. Show the address, full amenity list, room category, date picker, remaining rooms, and backend total. Pick dates today +28 to +31 days for Sea Glass House in Mumbai to see the one-room warning and total.
4. **Reservation:** Continue with the chosen dates, enter a guest name and email, and confirm. The API rechecks locked availability, calculates the final price, and returns the booking reference.
5. **Confirmation and management:** Show the reference, stay summary, copy and print controls. Open Manage booking with the same reference and email. Confirm cancellation in the native accessible dialog; the screen updates to Cancelled and the inventory is released. Looking the same reservation up again displays the cancelled status.

## Screenshots

Real Chrome captures from the running local stack are in [`docs/screenshots/`](screenshots/README.md). They cover home at desktop and mobile sizes, sold-out alternatives, hotel details, booking, confirmation, lookup, and confirmed/cancelled management states. The confirmation/management journey used a temporary local reservation for `capture.guest@example.test`, which was cancelled after capture.
