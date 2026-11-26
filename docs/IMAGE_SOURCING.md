# Image sourcing and replacement

## Method and evidence

Network access was available. Wikimedia Commons was queried with the MediaWiki API (`action=query`, `generator=search`, namespace 6, `prop=imageinfo`, `iiprop=url|size|extmetadata|mime`, thumbnail width 1920) and descriptive `StayWiseImageBot/1.0` User-Agent. Hotel-style photos were found on Unsplash photo pages, which identify each photographer and state the Unsplash License; their CDN originals were downloaded without API keys. The Commons hero and destination images were visually inspected as downloaded; Unsplash hotel images were downloaded and contact-sheet inspected. Hotel interiors are generic illustration of fictional concepts, not photos of purported named StayWise buildings.

Search phrases used: hero “Amber Fort Maotha Lake Jaipur wide”; city cards “Chhatrapati Shivaji Maharaj Terminus Mumbai”, “Palolem Goa Arabian Sea”, “Hawa Mahal Jaipur”, “City Palace Lake Pichola Udaipur”, “Lakkarwala Burj Sunder Nursery Delhi”, “Chinese fishing nets Fort Kochi”, “Shimla hill town valley”, “Vidhana Soudha Bengaluru”; hotel interiors “bright hotel bedroom window”, “modern guest room bed”, “traditional carved wood hotel room city view”, “hotel room seating desk”. Each source image's name, page, photographer, license, and dimensions are in the corresponding ignored JSON sidecar; exact per-file credit rows are in `CREDITS.md` and the `/credits` page.

For each photo, source metadata was checked for the landmark or room subject and its license. Candidates were accepted only with Public Domain, CC0, CC BY, CC BY-SA, or Unsplash License. Rejected if watermarked, branded, visibly text-heavy, dominated by focused faces/crowds, too small, dark, blurred, or depicting an identifiable real hotel as a StayWise property. Unsplash photographer pages sometimes show generic interior imagery; these are explicitly disclosed as illustrative, not evidence of any fictional hotel's location or actual design. This is a material limitation: the 27 hotel photo placements currently draw from six distinct generic room photos, so the source photographs recur across multiple fictional properties, and their distinct visual style per property (including city/countryside character) is not achieved. The repeated photos do have distinct output file names and encodings; they are not represented as unique source images.

### Selected city/hero evidence

- Hero: Commons title and description identify Amber Fort viewed from Maotha Lake, with Jaigarh hills; CC BY-SA 4.0, Jakub Hałun. The downloaded original is 5452 px wide, and the wide image supports text under navy overlay.
- Mumbai: Commons title identifies Chhatrapati Shivaji Maharaj Terminus, Mumbai; CC BY-SA 4.0, Shashank Mehendale.
- Goa: Commons title identifies Arabian Sea in Goa and its metadata identifies Palolem; CC BY 3.0, May Hachem93 (derivative by Hic et nunc).
- Jaipur: Unsplash title identifies Hawa Mahal domes in Jaipur; Unsplash License, Anant Acharya.
- Udaipur: Commons file title identifies City Palace by Lake Pichola; CC BY-SA 2.0, Tommy.
- New Delhi: Commons title identifies Lakkarwala Burj and Garden Fountain; CC BY-SA 4.0, Vchauhan7.
- Kochi: Commons title identifies Chinese Fishing Nets, Fort Kochi; CC BY-SA 4.0, Ingo Mehling.
- Shimla: Unsplash source describes a scenic mountain town in a valley and its page identifies Shimla; Unsplash License, Sujit Mondal.
- Bengaluru: Commons title identifies Vidhana Soudha facade in Bengaluru; CC BY-SA 4.0, Moheen Reeyad.

All 27 hotel placement sources (subject, page, photographer, and license) are mapped in [CREDITS.md](CREDITS.md), the same records are used to populate the `/credits` page, and the source metadata sidecars are under `frontend/src/assets/images/source/hotels/` locally. V6 sets primary-image alt text from each source record and corrects gallery attribution and alt text after V5's initial gallery seed.

## Asset pipeline

Source files live under `frontend/src/assets/images/source/` and are ignored by git. Processed output is committed under `frontend/src/assets/images/processed/`. Sharp creates hero 1920/1280/768; destination and hotel primary 1280/800/480; and gallery 1280/800 renditions as WebP and JPEG, stripping metadata. To replace an image, put its licensed source at the stable target path below, update its adjacent JSON source record and matching row in `docs/CREDITS.md`, `/credits` data, and gallery SQL attribution as applicable, then run:

```powershell
cd frontend
npm run images:process
npm run build -- --configuration=production
```

The script enforces image budgets: hero 250 KB, cards 90 KB, gallery 150 KB per rendition. Very detailed scenes can be oversized, so image quality is tuned down in the reproducible script to meet those caps.

## Manual fallback search map

| Target source filename | Recommended query | Preferred source |
|---|---|---|
| `hero/hero.jpg` | Amber Fort Maotha Lake wide calm Jaipur | Wikimedia Commons |
| `destinations/mumbai.jpg` | Chhatrapati Shivaji Maharaj Terminus wide | Wikimedia Commons |
| `destinations/goa.jpg` | Palolem Goa shore Arabian Sea | Wikimedia Commons |
| `destinations/jaipur.jpg` | Hawa Mahal Jaipur facade | Wikimedia Commons |
| `destinations/udaipur.jpg` | City Palace Lake Pichola Udaipur | Wikimedia Commons |
| `destinations/delhi.jpg` | Sunder Nursery Lakkarwala Burj Delhi | Wikimedia Commons |
| `destinations/kochi.jpg` | Chinese fishing nets Fort Kochi | Wikimedia Commons |
| `destinations/shimla.jpg` | Shimla hill town valley | Wikimedia Commons or Unsplash |
| `destinations/bengaluru.jpg` | Vidhana Soudha Bengaluru facade | Wikimedia Commons |
| `hotels/<hotel-slug>-1.jpg` | Match that hotel's city, description and amenities; avoid named hotels | Wikimedia Commons / Unsplash |
| `hotels/<hotel-slug>-2.jpg` | Generic hotel room interior matching the property mood | Unsplash |
| `hotels/<hotel-slug>-3.jpg` | Unbranded room, garden, courtyard, or dining interior | Unsplash |

Each hotel slug is in `backend/src/main/resources/db/migration/V2__seed_hotels.sql`. Do not use a real hotel image to imply the fictional listing is that property.
