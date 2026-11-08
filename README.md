# Waypoint — Shopify theme

An editorial, performance-minded Online Store 2.0 theme using native Shopify patterns (Section Rendering API for filters, server-rendered Quick Add, native `<dialog>`/inert drawers). Optional Branch Locations mapping currently loads MapLibre GL JS from a third-party CDN when configured; verify Shopify Theme Store policy and bundle locally before declaring the package review-ready.

**Version 1.0.0** · by K70 Network Solution · Support: kadirab1999@gmail.com · Docs: https://github.com/Kadir70-dev/waypoint-shopify-theme

## Install
1. Upload the theme ZIP (Online Store → Themes → Add theme → Upload zip), or use the Shopify CLI (`shopify theme push --unpublished`).
2. Open **Customize**. Every section shows placeholder content until you choose your own collection, products and images.
3. Publish when you are happy with the preview.

## Theme settings (Customize → Theme settings)
Colors (dark / light "Daylight" preset, accent override), Typography (Shopify font picker), Layout, Cart, Product grid, Product page, Icons, Social links, SEO.

## Presets
- **Waypoint** — dark, cinematic look for outdoor, travel and technical-gear brands with strong photography.
- **Daylight** — light version of the same layout for catalogues that need a brighter, product-first page.

Both presets share every section; switch at any time in Theme settings → Colors.

## Header & mega menu
Header and Announcement bar live in the Header group. The mega menu is built from your **Online Store → Navigation** menu: top-level items with child links open as a mega panel on desktop and a drill-down panel on mobile. Add images and promo copy to the mega-menu section blocks.

## Homepage sections
Hero slider, Category grid, Featured collection, Latest releases, Feature spotlight, Performance feature, Split promo, Testimonials, Trust bar, Journal teaser, Newsletter. Add, reorder and remove them freely. Empty sections show neutral placeholders.

## Collections & filters
Enable filters in **Online Store → Navigation → Collection and search filters**. Filters, sorting and price range update without a full page reload and degrade to normal links without JavaScript. Choose grid/list density in the collection section.

## Product page
Gallery (scroll-snap, zoom dialog, video), variant picker with sold-out/unavailable states, quantity, selling plans (if your products have them), pickup availability, size chart, specifications, accordions, recommendations. Alternative templates: editorial, featured, quick-add.

**Metafields used**
- *Specifications*: every product metafield in the `specs` namespace is listed as a label/value pair (Settings → Custom data → Products → add definitions with namespace `specs`, e.g. `specs.weight`, `specs.material`).
- *Star rating*: the standard product-review metafields `reviews.rating` and `reviews.rating_count` (filled by most review apps).

## Cart
Cart drawer and full cart page, free-shipping progress bar (set the threshold in Theme settings → Cart), cart notes and recommendations.

## Customer accounts
Works with both account types (Settings → Customer accounts):
- *Customer accounts* (Shopify-hosted): the header shows Shopify's account button (`shopify-account`) on desktop and mobile.
- *Legacy customer accounts*: the theme's own templates for login, register, recover/reset, account, order, addresses and activate.

## Demo content
The theme ships with no products or store content. Empty sections show Shopify's built-in placeholders, except two fallbacks bundled in `assets/`: hero images (`hero-slide-1.jpg`, `hero-slide-1-mobile.jpg`, `hero-slide-2.jpg`, `hero-slide-3.jpg`) used when a hero slide has no image, and `breakervideo.mp4` used when the Video page breaker has no video.

## Languages & RTL
Storefront strings live in `locales/`. English (default) and Arabic (`ar.json`) are included; add more via the Shopify language editor or by copying `en.default.json`. The layout sets `dir="rtl"` for Arabic, Hebrew, Persian and Urdu and uses CSS logical properties. Editor (schema) labels are English only.

## Accessibility & performance
- Keyboard navigable drawers and dialogs (native `<dialog>`/`inert`), visible focus states and skip link.
- Respects `prefers-reduced-motion`: hero motion, reveals and autoplay are switched off.
- Historical Lighthouse runs recorded scores of mobile performance 83 / accessibility 97 and desktop performance 93 / accessibility 99 in an earlier QA setup. These are **not current Theme Store submission benchmark results**. Re-run populated home, product, and collection pages on both presets and retain new reports before submitting.

## Credits & licenses
Photography and video on the demo store are from [Pexels](https://www.pexels.com/) under the [Pexels License](https://www.pexels.com/license/) (free for commercial use, attribution not required). They are store content and are **not** bundled with the theme. Full source records (Pexels IDs, photographers, download URLs, checksums): [`docs/pexels/`](docs/pexels/).

| Use | Pexels page | Creator |
|---|---|---|
| Hero 1 | [6465964](https://www.pexels.com/photo/unrecognizable-traveler-standing-on-mountain-top-and-admiring-landscape-6465964/) | Stan Swinnen |
| Hero 2 | [35696066](https://www.pexels.com/photo/hiker-climbs-snowy-mountain-ridge-in-winter-storm-35696066/) | eberhard grossgasteiger |
| Hero 3 | [33775543](https://www.pexels.com/photo/scenic-camping-in-the-wind-river-range-wyoming-33775543/) | Alex Moliski |
| Category: Backpacks | [35393324](https://www.pexels.com/photo/tactical-backpack-in-algerian-canyon-scene-35393324/) | Abdellah Benziane |
| Category: Camp & Shelter | [11424971](https://www.pexels.com/photo/a-white-tent-in-grass-beside-body-of-water-and-trees-under-a-blue-sky-11424971/) | Christian Clado |
| Category: Tools & Equipment | [16007988](https://www.pexels.com/photo/close-up-of-an-axe-thermos-and-an-oil-lamp-standing-on-the-ground-by-a-tent-in-a-forest-16007988/) | Araz Yurtseven |
| Category: Apparel | [37171598](https://www.pexels.com/photo/outdoor-portrait-of-person-in-winter-gear-37171598/) | Edu Raw |
| Route notebook | [14436286](https://www.pexels.com/photo/notebook-on-a-map-14436286/) | Ylanite Koppens |
| Gloves | [11584891](https://www.pexels.com/photo/a-person-wearing-winter-gloves-11584891/) | SERHAT TUĞ |
| Camp mug | [12037258](https://www.pexels.com/photo/close-up-photo-of-a-white-cup-12037258/) | Andrzej Gdula |
| Field bottle | [29307238](https://www.pexels.com/photo/stainless-steel-thermos-on-wooden-table-outdoors-29307238/) | Edita Brus |
| Felt hat | [16739699](https://www.pexels.com/photo/hat-on-rock-in-mountains-16739699/) | Ali Kazal |
| Daypack | [13792297](https://www.pexels.com/photo/backpack-on-rock-near-pond-13792297/) | Lotphey |
| Shell jacket | [32901030](https://www.pexels.com/photo/yellow-raincoat-with-drawstring-close-up-32901030/) | Haitham Almasari |
| Lantern | [30763208](https://www.pexels.com/photo/black-lantern-hanging-on-snowy-background-30763208/) | Araz Yurtseven |
| Camp stove | [29295215](https://www.pexels.com/photo/portable-camping-stove-in-rustic-outdoor-setting-29295215/) | Cedé Joey |
| Tent | [21939709](https://www.pexels.com/photo/tent-under-trees-by-lake-21939709/) | Sedat Taşkan |
| Hiking boots | [29490907](https://www.pexels.com/photo/worn-hiking-boots-on-rocky-shoreline-29490907/) | apertur 2.8 |
| Beanie (red) | [11512730](https://www.pexels.com/photo/red-winter-hat-11512730/) | Özgür Beşli |
| Beanie (blue) | [11630885](https://www.pexels.com/photo/blue-knit-cap-on-white-wooden-table-11630885/) | Tatiane Herder |
| Beanie (cream stripe) | [30263573](https://www.pexels.com/photo/cozy-winter-knits-beanie-and-sweaters-on-display-30263573/) | Gülşah Aydoğan |
| Beanie (charcoal) | [37484033](https://www.pexels.com/photo/cozy-knitted-winter-hats-on-wooden-surface-37484033/) | Lee Hanson |
| Video: home page | [32562962](https://www.pexels.com/video/hiker-ascends-misty-mountain-in-france-32562962/) | Florian Delée |
| Video: product page | [30240552](https://www.pexels.com/video/trekking-in-patagonia-s-misty-mountains-30240552/) | Florian Delée |

**Bundled fallback media** (`assets/hero-slide-*.jpg`, `assets/breakervideo.mp4`): source and license not yet documented — to be confirmed or replaced before release.

## Changelog
- **1.0.0** — First Theme Store release.

## Troubleshooting
- *Filters missing*: enable them in Navigation settings (see above).
- *Mega menu empty*: the top-level menu item needs child links.
- *Free-shipping bar absent*: set a threshold greater than 0 in Theme settings → Cart.
- *Specifications or stars not showing*: check the product has values in the `specs` namespace or the `reviews.rating` metafield.

## Support
Email kadirab1999@gmail.com with your store URL, theme version and steps to reproduce. Support covers the theme's own features and settings; third-party apps and custom code changes are out of scope.
- *Quick Add shows an error*: the product needs at least one available variant; otherwise it links to the product page.

## Demo pages and pre-order campaigns

See [Demo storefront setup](docs/DEMO-STOREFRONT.md) for page assignments, navigation, catalog layouts, and pre-order app configuration. The repository supplies templates; Shopify store records and purchase-option apps must be configured separately.

