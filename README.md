# Perspekt

One-page site for Perspekt, a LinkedIn personal branding and ghostwriting studio for founders, investors and the people who run listed companies.

## Files

- `index.html`: the built site. One self-contained file; open it in a browser or deploy it as-is.
- `src/index.src.html`: the source you edit.
- `assets/logo-mask.png`: the logo as a transparent mask. The build embeds it, and CSS tints it to the text colour.
- `build.py`: rebuilds `index.html` from the source and the logo.

## Edit and rebuild

```bash
python3 build.py
```

## Before launch

Everything below is placeholder content and is labelled as such on the page:

- Client logos, results numbers (impressions, revenue, followers), testimonials and team photos.
- The film section (hide it until the film exists).
- The calendar: replace it with the Cal.com embed.
- "More posts every month" on the Growth plan.
- Confirm the claims in the Questions section: no AI writing, NDA on request, and the 6–8 week / 3–6 month timeline.

## Regional pricing

Prices are set in INR and converted for other regions: US ×2.5, Europe ×3, everywhere else ×2, rounded up. Exchange rates live in `FX` in the pricing script; update them when rates move.

The region comes from the visitor's timezone first, then an IP lookup (`api.country.is`) once the site is hosted. Adding `#us`, `#eu`, `#row` or `#in` to the URL forces a region for previewing; remove that switch before launch.
