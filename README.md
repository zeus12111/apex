# Apex Trio Digital Partners: website

Static website for Apex Trio Digital Partners (Panglao, Bohol). Plain HTML, CSS and JavaScript with **no build step**, plus one Cloudflare Pages Function that emails form submissions.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` (home: services, process, packages, team, project form) |
| `/services/` | `services/index.html` |
| `/services/social-media-marketing/` | `services/social-media-marketing/index.html` |
| `/services/website-design-development/` | `services/website-design-development/index.html` |
| `/services/ai-search-digital-visibility/` | `services/ai-search-digital-visibility/index.html` |
| `/services/automation-integrations/` | `services/automation-integrations/index.html` |
| `/about/` | `about/index.html` |
| `/contact/` | `contact/index.html` |
| `/work/` | `work/index.html` (case studies go here once clients approve them) |
| `/privacy/`, `/credits/` | privacy notice, photograph credits |

The old Base44 URLs keep working: `/offerings` redirects to `/#packages` and `/testimonials` to `/work/` (see `_redirects`).

## Deploy on Cloudflare Pages (from GitHub)

1. Push this folder to a GitHub repository.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repository.
3. Build settings: **Framework preset: None**, **Build command: _(leave empty)_**, **Build output directory: `/`**.
4. Deploy. Every push to the main branch redeploys automatically; other branches get preview URLs.

### Turn on the contact form (one-time)

Both forms post to Cloudflare Pages Functions in `functions/api/` that email you through [Resend](https://resend.com) (free tier: 3,000 emails a month).

1. Create a Resend account, verify your domain, and create an API key.
2. In Cloudflare Pages → your project → **Settings → Variables and Secrets**, add for **Production** (and Preview if you like):
   - `RESEND_API_KEY`: the API key (**type: Secret**)
   - `CONTACT_TO`: the inbox that receives inquiries (comma-separate several)
   - `CONTACT_FROM`: a sender on your verified domain, e.g. `Apex Trio Website <website@yourdomain.com>`
3. Redeploy (Deployments → … → Retry deployment) so the variables take effect.

Until these are set, the form shows "Not sent" and keeps what the visitor typed; nothing is lost silently.

### After you connect your domain

- In every page's `<head>`, set `og:image` to the full URL (`https://yourdomain.com/share.jpg`) and add `<link rel="canonical" href="https://yourdomain.com/...">` (the home page has the line ready as a comment).

## Editing

- **Text:** edit the HTML file for that page directly.
- **Brand:** follows the Apex Trio Brand Kit v1 (November 2026). Colours, fonts, buttons, chips and founder cards live in `assets/site.css`:
  Ink `#0F1222`, Paper `#F5F3EC`, Volt `#C8F94A` (one highlight per layout), Sunset `#FF5B2E` (buttons, the apex dot), Tide `#12B5A5`.
  Type: Montserrat Alternates Bold (headlines), Geist (body), Geist Mono (uppercase labels), all from Google Fonts.
- **Logo files:** `assets/brand/`, lifted as vectors from the brand kit PDF: `logo-light.svg` / `logo-dark.svg` (with "Digital Partners"), `-short` versions without it, and `mark-light.svg`, `mark-dark.svg`, `mark-trio.svg`. The favicon is the Ink avatar. Icons are Phosphor Bold (`assets/brand/icons/`).
- **Photographs:** in `assets/img/`. They are licensed stand-ins of Panglao and Bohol from Wikimedia Commons (credits at `/credits/`). Replace them with your own photos of your team and client work when you have them, and keep the credits page in step.
- `assets/` also holds the design system (`system.css`, `system.js`, motion, layout and two scroll moments). Edit page-level CSS, not these files.

## Preview locally

```bash
npx wrangler pages dev .
```

This serves the site with the form functions at http://localhost:8788. Any static server also works for the pages alone (`python3 -m http.server`).
