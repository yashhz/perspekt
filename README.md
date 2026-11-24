# Perspekt

One-page site for Perspekt, a LinkedIn personal branding and ghostwriting studio for founders, investors and the people who run listed companies.

Live: https://yashhz.github.io/perspekt/

## Files

- `index.html`: the page markup.
- `css/styles.css`: all styling, including light and dark mode.
- `js/main.js`: animations, the dark mode toggle, regional pricing, the plan cards and the calendar preview.
- `assets/logo.png`: the logo as a transparent mask. CSS tints it to the text colour, so it works in both modes.

There is no build step. Edit the files and push; GitHub Pages redeploys `main` automatically.

To preview locally, serve the folder rather than opening the file directly (the logo mask needs a web server):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Booking (Cal.com)

The Book a call section shows Cal.com's live calendar for `ronak-dim8bx/15min`. To use a different event, change `CAL_LINK` in the booking block of `js/main.js` and the "Book on Cal.com" link in `index.html`. The calendar only loads on the hosted site, not when the file is opened directly.

## Before launch

Everything below is placeholder content and is labelled as such on the page:

- Results numbers (impressions, revenue, followers), testimonials and team photos.
- The film section (hide it until the film exists).
- Confirm the claims in the Questions section: no AI writing, NDA on request, and the 6–8 week / 3–6 month timeline.

## Regional pricing

Foundation is a fixed price. Retainer shows an estimate that changes with what the visitor picks (posts a month, engagement, inbound); the amounts are in `RET` in `js/main.js`. Enterprise is "Custom".

Prices are set in INR and converted for other regions: US ×2.5, Europe ×3, everywhere else ×2, rounded up. Exchange rates live in `FX` in `js/main.js`; update them when rates move.

The region comes from the visitor's timezone first, then an IP lookup (`api.country.is`). Adding `#us`, `#eu`, `#row` or `#in` to the URL forces a region for previewing; remove that switch before launch.
