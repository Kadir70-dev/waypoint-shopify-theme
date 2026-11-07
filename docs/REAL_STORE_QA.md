# Real-store QA checklist (not yet run — no Shopify dev-store login in the build environment)

Run with `shopify theme dev --store <your-dev-store>` on a store populated per "Fixtures". Record pass/fail per cell; do not mark anything passed without testing it.

**Widths:** 1440 · 1024 · 768 · 390 · 360. **Pages:** Home · Collection · Search · PDP · Cart drawer · Cart page · Login · Register · Customer account (+order, addresses) · Blog · Article · Contact · List collections.

## Fixtures to create
normal product · sale product (compare-at) · sold-out product · multi-variant product · single-variant product · product with a selling plan (if supported) · product with a very long title · empty collection · empty-search term · empty cart · cart with several lines (incl. one sale, one long title).

## Every page × width
- [ ] No horizontal scroll; no clipped/overlapping text; grids don't break
- [ ] Header/mega menu/mobile nav don't overlap content; sticky elements behave
- [ ] Keyboard: Tab order logical, visible focus on every control, Esc closes dialogs/drawers, focus returns to trigger
- [ ] No console errors; no failed network requests

## Page-specific
- **Home:** hero controls, section placeholders with no content, section reorder in editor
- **Collection:** filters (desktop sidebar, mobile drawer), sort, price range, active chips, pagination, empty collection, no-match filter state, grid/list toggle
- **Search:** predictive results, results page, empty search
- **PDP:** gallery swipe/dots/zoom dialog, variant change updates price/URL/availability, sold-out variant, sale price hierarchy, selling plan, quantity, sticky add-to-cart, long title, size chart, recommendations
- **Cart drawer/page:** add, qty +/−, remove, empty, free-shipping bar, notes, multi-line, drawer focus trap/restore
- **Account:** login error, register error, recover, order, add/edit/delete address
- **Blog/Article/Contact:** layouts, long titles, form validation and success message

## RTL (switch storefront language to Arabic)
- [ ] `<html dir="rtl">`; header, nav, mega menu, mobile drawer mirror correctly
- [ ] PDP gallery order, arrows, thumbnails, buy box; product cards (badges, swatches, quick add)
- [ ] Collection filters, sort, chips; cart drawer slides from the correct edge
- [ ] Forms (labels, errors, inputs), account pages, footer
- [ ] Icons that imply direction (arrows, chevrons) point the right way; numbers/prices not reversed
- Known unverified: the testimonials marquee and card hover arrow use `translateX` (direction not mirrored).

## Accessibility (browser)
Skip link, landmarks, heading order, contrast (AA), `prefers-reduced-motion`, screen-reader names on icon buttons, form errors announced.
