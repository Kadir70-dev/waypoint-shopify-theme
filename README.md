# Waypoint — Shopify theme

An editorial, performance-minded Online Store 2.0 theme. No third-party JavaScript; native Shopify patterns (Section Rendering API for filters, server-rendered Quick Add, native `<dialog>`/inert drawers).

## Install
1. Upload the theme ZIP (Online Store → Themes → Add theme → Upload zip), or use the Shopify CLI (`shopify theme push --unpublished`).
2. Open **Customize**. Every section shows placeholder content until you choose your own collection, products and images.
3. Publish when you are happy with the preview.

## Theme settings (Customize → Theme settings)
Colors (dark / light "Daylight" preset, accent override), Typography (Shopify font picker), Layout, Cart, Product grid, Product page, Icons, Social links, SEO.

## Header & mega menu
Header and Announcement bar live in the Header group. The mega menu is built from your **Online Store → Navigation** menu: top-level items with child links open as a mega panel on desktop and a drill-down panel on mobile. Add images and promo copy to the mega-menu section blocks.

## Homepage sections
Hero slider, Category grid, Featured collection, Latest releases, Feature spotlight, Performance feature, Split promo, Testimonials, Trust bar, Journal teaser, Newsletter. Add, reorder and remove them freely. Empty sections show neutral placeholders.

## Collections & filters
Enable filters in **Online Store → Navigation → Collection and search filters**. Filters, sorting and price range update without a full page reload and degrade to normal links without JavaScript. Choose grid/list density in the collection section.

## Product page
Gallery (scroll-snap, zoom dialog, video), variant picker with sold-out/unavailable states, quantity, selling plans (if your products have them), pickup availability, size chart, specifications (metafield `specs`), accordions, recommendations. Alternative templates: editorial, featured, quick-add.

## Cart
Cart drawer and full cart page, free-shipping progress bar (set the threshold in Theme settings → Cart), cart notes and recommendations.

## Customer accounts
Classic customer accounts: login, register, recover/reset, account, order, addresses, activate. Enable them in Settings → Customer accounts.

## Demo content
The theme ships with **no demo or fixture content** and all placeholder imagery comes from Shopify's built-in placeholders (plus three bundled hero images used only when a hero slide has no image).

## Languages & RTL
Storefront strings live in `locales/`. English (default) and Arabic (`ar.json`) are included; add more via the Shopify language editor or by copying `en.default.json`. The layout sets `dir="rtl"` for Arabic, Hebrew, Persian and Urdu and uses CSS logical properties. Editor (schema) labels are English only.

## Troubleshooting
- *Filters missing*: enable them in Navigation settings (see above).
- *Mega menu empty*: the top-level menu item needs child links.
- *Free-shipping bar absent*: set a threshold greater than 0 in Theme settings → Cart.
- *Quick Add shows an error*: the product needs at least one available variant; otherwise it links to the product page.
