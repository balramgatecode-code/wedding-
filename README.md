# Pooja & Nitesh — Wedding Invitation Website

Run: `npm install` then `npm run dev`  ·  Build: `npm run build` (deploy the `dist/` folder, e.g. on Vercel).

All text/dates/names/venue/phone numbers live in **src/data.js**.

## To finish (things the card did not give us)
- **Photos**: put `bride.jpg` / `groom.jpg` in `public/assets/couple/` and gallery photos in `public/assets/gallery/`, then list the gallery ones in `GALLERY` (src/data.js). Placeholders show until then.
- **Music**: add a track you have rights to at `public/assets/entry/music.mp3` (button appears automatically).
- **Map pin**: set `VENUE.coordinates` from the card's Location QR; until then maps search by venue name.
- **RSVP**: replies open WhatsApp to `CONTACT.whatsapp`; set `RSVP_ENDPOINT` to use a form service you own.
- Countdown targets Baraat Swagat (3 Dec 2026, 8:15 PM); change `COUNTDOWN_TARGET` if you prefer.
