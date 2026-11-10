# Cairnfield — Theme Store listing, ready-to-paste (2026-11-10)

**Status: prepared, NOT submitted.** Nothing here has been entered in the Partner Dashboard. The Partner Program Agreement and any legal attestation are for the account owner only. Do not describe the theme as live until Shopify approves and publishes the listing.

## Theme-level fields

| Field | Value |
| --- | --- |
| Theme name (from `settings_schema.json`) | Cairnfield (cannot be changed after upload) |
| Version / author | 1.0.0 / K70 Network Solution |
| Upload | `Cairnfield-1.0.0.zip` built from the commit this PR merges (rebuild after merge; validator `scripts/validate_theme_store_zip.py` must PASS) |
| Price | **420 USD** (allowed range 100–500 in steps of 10) |
| Metadata description | Cairnfield is a Shopify theme for outdoor, travel and active-life brands: cinematic imagery, clear collection browsing, detailed product pages, English/Arabic RTL support and an optional branch-locations map. |
| Contact email for review | kadirab1999@gmail.com (owner to confirm) |
| Support / docs | https://cairnfield-theme-support.vercel.app/ · https://cairnfield-theme-support.vercel.app/docs.html (both HTTP 200 on 2026-11-10) |
| Submission notes | Built for outdoor and travel retailers with medium catalogs. Merchant benefits: section-based homepages, filterable collections, quick add, cart drawer with free-shipping progress, size chart and specification metafields, native language switcher with full RTL. All scripts are served from Shopify (MapLibre GL JS 6.17.0 is bundled, BSD-3-Clause). |

## Preset 1 — Cairnfield (dark)

| Field | Value |
| --- | --- |
| Preset name | Cairnfield |
| Tagline (≤70) | Cinematic storefronts for outdoor and adventure brands (54) |
| Industry | Sports and recreation (outdoor/camping equipment) — pick the closest of Shopify's 20 options |
| Catalog size | Some — demo store has 12 active products |
| Demo store | https://cairnfield-outdoor-demo-y0g6jech.myshopify.com — **see blocker: Cairnfield must be the published theme there** |
| Demo password | storefront password (same for both demo stores; owner enters it) |
| Desktop screenshot 2000×2496 | `cairnfield-desktop-home.png` — alt: "Cairnfield homepage with a hiker overlooking a mountain lake and the headline Further by Nature" |
| Mobile screenshot 750×1334 | `cairnfield-mobile-home.png` — alt: "Cairnfield mobile homepage with hero image, Explore Gear button and bottom navigation bar" |
| Highlight 1 (1600×1200) | `cairnfield-highlight-1-home.png` — **Cinematic storefront** — Full-width imagery and bold typography introduce collections with an outdoor point of view. — alt: "Full-width mountain hero with headline and call-to-action" |
| Highlight 2 | `cairnfield-highlight-2-collection.png` — **Explore with confidence** — Filterable collection grids with availability and price filters help customers find gear fast. — alt: "Dark collection page with filter sidebar and product grid of outdoor gear" |
| Highlight 3 | `cairnfield-highlight-3-product.png` — **Product detail, in focus** — Gallery, variant picker, quantity and dynamic checkout buttons on one clear product page. — alt: "Product page for Wildlands Shelter with gallery, price and add to cart" |

## Preset 2 — Daylight (light)

| Field | Value |
| --- | --- |
| Preset name | Daylight |
| Tagline (≤70) | An airy editorial look for bags and everyday essentials (55) |
| Industry | Bags and luggage (closest option) |
| Catalog size | Some — only once its own demo store has a matching catalog |
| Demo store | **Missing — a second store is required** |
| Desktop / mobile screenshots | `daylight-desktop-home.png`, `daylight-mobile-home.png` — **provisional**: captured from a Daylight-preset preview on the Cairnfield store; recapture on the Daylight demo store |
| Highlights | `daylight-highlight-1-home.png`, `-2-collection.png`, `-3-product.png` — same captions as Cairnfield with "light" wording; provisional for the same reason |

Screenshot files live outside the repo in `~/cairnfield-release/listing/` (SHA-256 prefixes: cairnfield desktop `546ee2376648f69f`, mobile `0aee58a944f35a04`; daylight desktop `591195036734053b`, mobile `4d916c09f532f619`).

## Features to tick (present in the theme code)

Mega menu, predictive search, quick add, collection filtering and sorting, product image zoom, product video in gallery, size chart, product specifications (metafields), product recommendations, cart drawer, cart notes, free-shipping progress bar, color swatches, sticky add-to-cart on mobile, multi-language switcher, right-to-left (Arabic) support, store/branch locator (optional map), blog/journal, FAQ page, contact form, newsletter sign-up. Tick only what the demo store actually shows.

## Reviewer testing instructions (draft)

1. Enter the storefront password on each demo store.
2. Checkout uses Shopify's test payment gateway (active on the Cairnfield store): card number `1` approves an order, `2` declines; any future expiry and 3-digit code.
3. Switch language with EN/عربي in the header (desktop) or the menu drawer (mobile); Arabic renders right-to-left.
4. Product: `/products/basecamp-three-person-shelter`; collection: `/collections/all`.
5. The Branch locations section shows a list without a map until a merchant adds a MapTiler key; no business locations are invented.

## Done on 2026-11-10

- MapLibre bundled (no external CDN script), map messages localized — this PR.
- All bundled media licensed (Pexels; `docs/pexels/`), testimonial placeholders removed, accessibility audit: axe 0 violations on 22 page-views.
- Test payment gateway activated on the Cairnfield store.
- Preview themes: Cairnfield `188693217389`, Daylight `188707537005` (both unpublished; live Horizon untouched).

## Pre-submission checks (2026-11-10)

- Theme Check: 211 files, 0 offenses. Repo tests (language toggle, branch locations, hero/gallery, JSON) pass. ZIP validator PASS.
- Lighthouse (LHCI 0.13, hosted previews, storefront login in-browser, 1 run each on a laptop — lower mobile scores than GitHub runners):

| Preset | Mobile perf home / collection / product | Desktop perf | Accessibility |
| --- | --- | --- | --- |
| Cairnfield | 41–48 (after hero preload; was 36) / 49 / 54 | 74 / 86 / 77 | 100 |
| Daylight | 35–36 / 67 / 59 | 71 / 96 / 71 | 96–100 |

  Mobile average is **below the Theme Store minimum of 60** on this machine. Fixed: the first hero image is now preloaded (Cairnfield home LCP 16.9 s → 4.2–5.6 s). Remaining cause on Daylight home: autoplay advances to slide 2 during page load (3 s interval, starts without interaction — a deliberate setting enforced by `scripts/test_hero_gallery.cjs`), so the LCP becomes slide 2's late image. Owner decision needed (see below). Re-measure with the GitHub Lighthouse CI workflow once it points at the Cairnfield store.

## Needs the owner

1. Approve publishing Cairnfield as the live theme on the Cairnfield demo store (replaces Horizon) — or provide a different store.
2. Create the Daylight demo store (Dev Dashboard login), with a bags/travel catalog; then Daylight screenshots are recaptured there.
3. Sign in to the Partner/Dev Dashboard; review and accept the Partner Program Agreement and any attestations yourself; approve the final submit.
4. Decide hero autoplay: keep 'starts on load, 3 s' (current, hurts mobile LCP and WCAG 2.2.2 motion) or switch to 'starts on first interaction, ≥7 s' (recommended); the hero test encodes the current choice.
5. Point the Lighthouse CI secrets at the Cairnfield store (SHOP_STORE / app credentials / storefront password) for an authoritative runner measurement.
