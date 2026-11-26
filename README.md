# StayWise

**Thoughtful stays across India.** StayWise helps guests compare fictional hotels, see clear nightly prices, reserve a room, and manage a booking. When dates are sold out, it suggests nearby dates and other stays in the same city.

> Interview/demo project. It does not take payments or provide production account security.

## Features

- Search eight Indian destination cities with a keyboard-accessible date range picker.
- Compare nine fictional properties, amenities, availability, prices, and sort/filter results.
- View hotel details and backend-calculated quotes.
- Reserve one room per booking; the backend locks inventory and calculates the final total.
- Retrieve or cancel a reservation using its reference and booking email.
- Find same-hotel nearby dates and same-city hotel options when a stay is sold out.

## Technology

| Area | Stack |
|---|---|
| Backend | Java 17 language target, Spring Boot 3.5.11, Spring MVC, Spring Data JPA, Bean Validation, Maven Wrapper |
| Database | MySQL 8.0, InnoDB, Flyway |
| Frontend | Angular 21 standalone, strict TypeScript, SCSS, RxJS, Vitest |
| UI assets | Self-hosted Playfair Display and Source Sans 3, Lucide icons, original SVG illustrations |

The checked environment used Java 22, Node 22.15.1, and npm 10.9.2. Angular 21 requires a supported Node release (20.19+, 22.12+, or 24+).

## Prerequisites

- JDK 17 or newer (Maven Wrapper is included).
- Node.js 20.19+, 22.12+, or 24+, with npm.
- Docker Desktop / Docker Engine and Docker Compose, or a local MySQL 8 database.

## Quick start

From the repository root, make the local environment file and start MySQL:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

Then run these commands in two separate terminals:

```powershell
cd backend; .\mvnw.cmd spring-boot:run
```

```powershell
cd frontend; npm install; npm start
```

On macOS/Linux, use `cp .env.example .env`, `./mvnw spring-boot:run`, and `npm install && npm start`. Flyway creates the schema and sample data on backend startup.

- Portal: <http://localhost:4200>
- API and Swagger UI: <http://localhost:8080/swagger-ui.html>
- Health: <http://localhost:8080/actuator/health>

Compose maps container MySQL port 3306 to host port 3307. `.env` supplies Compose credentials. Spring's local defaults match the example; if you customize credentials or port, export the corresponding `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` values for the backend process. Set `CORS_ALLOWED_ORIGIN` when serving Angular from another origin.

## Manual MySQL setup

Create a database and least-privilege application user in a MySQL 8 administrative session (replace the example password):

```sql
CREATE DATABASE staywise CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'staywise_app'@'%' IDENTIFIED BY 'replace-with-a-local-password';
GRANT ALL PRIVILEGES ON staywise.* TO 'staywise_app'@'%';
```

Set the Spring connection variables in the backend terminal. PowerShell:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/staywise?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Kolkata'
$env:DB_USERNAME = 'staywise_app'
$env:DB_PASSWORD = 'replace-with-a-local-password'
```

macOS/Linux shell:

```sh
export DB_URL='jdbc:mysql://localhost:3306/staywise?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Kolkata'
export DB_USERNAME='staywise_app'
export DB_PASSWORD='replace-with-a-local-password'
```

The configured account must be able to create and alter tables in this application database so Flyway can install the migrations. Do not put real credentials in committed files.

## Migrations and demo data

Flyway applies `V1__schema.sql` through `V4__demo_scenarios.sql` at API startup. V1 creates the tables and constraints; V2 seeds nine fictional hotels/amenities; V3 creates nightly inventory from today through today +365; V4 books sample rooms to demonstrate availability. A daily Asia/Kolkata scheduler fills missing inventory in the rolling window. To reset the local Compose database and erase its data, run `docker compose down -v` followed by `docker compose up -d`; the migrations then seed a fresh database.

Relative to database today, the seeded demo cases are:

| Property | Dates | Availability |
|---|---|---|
| Aravali Palace Heritage, Jaipur | +21 through +24 days | Sold out (six rooms reserved) |
| Sea Glass House, Mumbai | +28 through +31 days | One room left |
| Monsoon Courtyard, Goa | +35 through +38 days | Two rooms left |

For example, when today is 26 Nov 2026 in Asia/Kolkata, those windows are 17–20 Dec, 24–27 Dec, and 31 Dec–3 Jan respectively. See [the walkthrough](docs/demo.md) for the guided path and Smart Alternatives demo.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cities` | Destination list |
| GET | `/api/hotels?city=&checkIn=&checkOut=` | Search and availability |
| GET | `/api/hotels/{id}` or `/api/hotels/slug/{slug}` | Hotel details |
| GET | `/api/hotels/{id}/quote?checkIn=&checkOut=` | Backend price breakdown |
| GET | `/api/hotels/{id}/alternatives?checkIn=&checkOut=` | Smart Alternatives |
| POST | `/api/bookings` | Create a reservation |
| POST | `/api/bookings/lookup` | Lookup with reference + email |
| POST | `/api/bookings/cancel` | Cancel with reference + email |

See [Swagger UI](http://localhost:8080/swagger-ui.html) while the backend is running. Lookup/cancel use POST bodies to keep email addresses out of URLs. Errors share a JSON contract with status, stable code, safe message, path, timestamp, and optional field errors.

## Tests and production build

From `backend`:

```powershell
.\mvnw.cmd test
.\mvnw.cmd verify
.\mvnw.cmd -Dit.test=ConcurrentBookingIT verify
```

The integration and concurrency tests use Testcontainers MySQL and need Docker. `verify` includes unit/controller and integration tests; `-Dit.test=ConcurrentBookingIT` selects the concurrency suite in the failsafe phase.

From `frontend`:

```powershell
npm test -- --watch=false
npm run build -- --configuration=production
```

The frontend suite covers INR/night formatting, date-range boundaries, interceptor error mapping, and booking-form validation (9 tests). Real Chrome screenshots cover search, sold-out suggestions, hotel details, booking, confirmation, management, and cancellation; see [the screenshots](docs/screenshots/README.md). Lighthouse and assistive-technology audits remain to be done.

## Project structure

```text
backend/src/main/java/com/staywise/booking/  Spring features and API
backend/src/main/resources/db/migration/    MySQL schema and demo seeds
backend/src/test/java/                      Unit, controller, integration, concurrency tests
frontend/src/app/                            Lazy Angular routes, services, and shared UI
frontend/src/assets/                         Logo, fonts, and original illustrations
docs/                                        Demo script, credits, ER diagram, screenshots note
DESIGN.md                                    Engineering decisions and limitations
```

## Assumptions and design

Dates are interpreted in Asia/Kolkata; stays use half-open `[checkIn, checkOut)` nights; check-in is allowed today, maximum stay is 30 nights, and maximum advance is 365 days. INR is the only currency. One booking reserves one room, totals exclude taxes/fees, and cancellation is allowed before check-in. See [DESIGN.md](DESIGN.md) for architecture, transaction and concurrency reasoning, privacy, trade-offs, and limitations.

## Screenshots and demo

The screenshot directory contains real captures from the running local stack: Docker MySQL, Spring Boot, Angular, and Chrome. The confirmation and cancellation images use a local `example.test` guest and a booking that was subsequently cancelled. See [docs/screenshots/README.md](docs/screenshots/README.md) and [docs/demo.md](docs/demo.md) for the walkthrough.

## Time and AI assistance disclosure

Implementation hours were not tracked reliably, so no numeric time estimate is claimed. AI coding assistance was used significantly for code, tests, and documentation. The human submitter is responsible for reviewing and understanding the implementation before presenting it; this repository does not claim that review has already happened.

## Verification status and known limits

In the checked environment, `mvn clean verify` passed 21 tests (19 Surefire and 2 Testcontainers concurrency tests), and a separate run repeated each concurrency scenario twice (4 more passes). MySQL migrations V1–V4 ran on fresh test databases and on the Compose database. `npm test -- --watch=false` passed all 9 tests, and the Angular production build passed without warnings. Docker Compose, API health, seeded availability, and the browser booking-to-cancellation journey were also exercised. `npm audit --omit=dev` reported no production dependency vulnerabilities. A full `npm audit` reports 16 moderate findings in development tooling, primarily Angular CLI's transitive npm package-fetch/signing dependencies; npm offers no non-major fix for the pinned Angular toolchain. Lighthouse and assistive-technology audits have not been run.

Payments, authentication, guest counts, multiple room categories, email notifications, reviews, idempotency keys, rate limiting, internationalization, and CI/CD are out of scope. Browser-level accessibility/performance audits and screenshots remain unverified. See [asset credits](docs/CREDITS.md) and [the ER diagram](docs/er-diagram.md).
