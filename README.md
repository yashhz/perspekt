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

## Adding Cal.com

1. In Cal.com, open your event, choose Embed, then Inline, and copy the code.
2. In `index.html`, find the `CAL.COM` comment in the Book a call section and replace the `<div class="cal">` block under it with that code.
3. In `js/main.js`, delete the block that starts with `/* ---------- calendar preview ---------- */`.

## Before launch

Everything below is placeholder content and is labelled as such on the page:

- Client logos, results numbers (impressions, revenue, followers), testimonials and team photos.
- The film section (hide it until the film exists).
- The calendar (see Cal.com above).
- Confirm the claims in the Questions section: no AI writing, NDA on request, and the 6–8 week / 3–6 month timeline.

## Regional pricing

Foundation is a fixed price. Retainer shows an estimate that changes with what the visitor picks (posts a month, engagement, inbound); the amounts are in `RET` in `js/main.js`. Enterprise is "Custom".

Prices are set in INR and converted for other regions: US ×2.5, Europe ×3, everywhere else ×2, rounded up. Exchange rates live in `FX` in `js/main.js`; update them when rates move.

The region comes from the visitor's timezone first, then an IP lookup (`api.country.is`). Adding `#us`, `#eu`, `#row` or `#in` to the URL forces a region for previewing; remove that switch before launch.
