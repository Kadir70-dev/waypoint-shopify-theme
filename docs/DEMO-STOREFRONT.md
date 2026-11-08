# Waypoint demo storefront

These templates provide the UI. Shopify Pages, collections, products, menus and
policies are store records, so committing this repository does not create them.
Use an unpublished preview theme first. Preserve the live theme's settings and
JSON templates; do not overwrite its customizations with the repository defaults.

## Pages to create and assign

Create each page in Shopify admin and select the matching theme template.
If a template is unavailable, confirm it exists in the theme being edited.
Preview pages with that theme before making navigation public.

| Title | Handle | Template suffix |
| --- | --- | --- |
| Explore Waypoint | demo | demo |
| Catalog | catalog | catalog |
| About us | about-us | about |
| Lookbook | lookbook | lookbook |
| FAQ | faq | faq |
| Size guide | size-guide | size-guide |
| Delivery & returns | shipping-returns | shipping-returns |
| Contact | contact | contact-premium |
| Upcoming collection | pre-order | preorder |

For every Page showcase card select an actual page, collection or product in the
theme editor. A missing selected resource renders a card without a link, rather
than inventing a destination. Custom URLs can be configured separately.
Replace the example brand story with the merchant's own story.

Create or select collections for backpacks, camp-shelter, tools-equipment and
apparel. Assign collection images and real products. Default, compact and editorial
collection templates are included. The demo hub also links to those layouts on
the all-products collection using view parameters.

Use the Lookbook card image picker for licensed lifestyle photography. Select a
matching product or collection as each destination. No stock media is bundled by
this change. About uses an editorial lead story, while Catalog uses a category grid.
The size guide explains measurement technique; add verified product size charts
through the product section's existing size-chart block. No measurements are invented.

## Navigation

Configure the existing header Main menu setting and footer menu:

- Shop: All products, Catalog, Compact catalog, Editorial catalog
- Collections: Backpacks, Camp & Shelter, Tools & Equipment, Apparel
- Lookbook
- About us
- Journal: select an actual blog (create journal or change the example link)
- Help: FAQ, Size guide, Delivery & returns, Contact
- Explore demo: the demo page

Fill Shopify's shipping and refund policies before linking the Delivery & returns
page publicly. Both style presets include the additional templates; selecting a
preset alone does not provision store pages or menus.

## Pre-order campaign and product template

The new Pre-order campaign section supports a product, a responsive campaign
image, merchant-written dispatch estimate, payment/cancellation terms, policy page
and app blocks. It can be added to the homepage or the dedicated page.
The dedicated product.preorder template combines the normal product form with
campaign information; it does not itself turn a product into a pre-order.

1. Configure a Shopify-compatible pre-order purchase-options app for a test product.
2. Assign product.preorder to that product and add the app's product block in the
   existing main-product section. Follow the app's placement and integration guide.
3. Add accurate dispatch information and payment/cancellation terms to the campaign.
   On a product template leave the campaign product picker empty to use that product.
   Use a separate template per campaign if different products have different dates.
4. Select the product in the standalone campaign. Its CTA opens product details;
   it never charges customers or silently changes inventory.
5. Verify the chosen app's selling plan, amounts due now/later, variant changes,
   cart, checkout and cancellation flow in a test environment. App-specific
   checkout behavior has not been tested in this repository.

Do not label an ordinary Add to Cart action as Pre-order without configuring the
purchase option. Existing selling-plan and app-block support is reused; this change
does not implement a payment, reservation or inventory backend.

References:
- https://shopify.dev/docs/storefronts/themes/pricing-payments/preorder-tbyb
- https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks

## Preview checklist

Check all nine page URLs and both presets at mobile and desktop sizes. Confirm
one page-title H1 per page, keyboard links/focus, readable text, no side scrolling,
accurate images and working destinations. Use the product page size chart for
real size data. Review the demo hub and both catalog layout links after assigning
content. Publish only the reviewed store content and theme version.

## Premium finishing and motion

Theme settings → Premium finishing controls the added micro-interactions. Shared buttons and navigation receive subtle hover movement and animated underlines; demo cards gain lift and image zoom. Below-fold demo content and section headings move into place once, and FAQ answers have a short opening motion. Initial viewport content remains visible and static, including when JavaScript is unavailable.

Hover movement is limited to devices with a fine pointer. The enhancements respect reduced-motion preferences and clean up when Theme Editor sections are removed. The switch controls the new enhancements; existing hero, product-card and drawer behavior remains separate. Verify both presets and mobile layouts in Shopify before publishing.

## Rotating gallery and portable tent

Add **Rotating image gallery** to any supported JSON template in Customize. It is already included in Lookbook and the new `product.portable-tent` template. Select a product to pull its image gallery, or add up to 12 image blocks with captions. With no blocks selected, a product page uses its current product's images. Unconfigured galleries stay hidden on the storefront. This is a slideshow, not fabricated 360-degree photography.

Gallery controls support touch scrolling, keyboard arrows (including RTL), previous/next navigation and an image counter. Auto-rotation is optional and disabled by default. When enabled, it stops on interaction, focus or reduced-motion changes, and does not advance offscreen or in a background tab. Theme Editor auto-rotation is disabled. Existing product variant/gallery integration is unchanged.

`docs/demo-products/portable-tent.csv` contains one **draft**, unpublished, zero-stock demo product. Import it via Products → Import; do not enable overwriting existing products. Its 199.00 price is a demonstration price in the store currency, not a verified selling price. The description identifies it as a demo and makes no capacity/weather/weight claims. Set actual details and price before publishing.

After the theme branch is uploaded to a preview theme, assign the `portable-tent` product template. Add rights-cleared photographs of the SAME tent to the product media. No unrelated stock photos, logo edits or invented angles are included. The section automatically uses those product photos. For an existing matching tent photograph, verify its recorded source/license before reuse. This repository change does not create the Shopify product, upload media or publish the theme.

## Curated demo release checklist

The homepage now prioritizes hero → demo navigation → categories → collection → portable tent → existing video (where configured) → journal → newsletter. Existing media settings are preserved. Unverified performance panels remain disabled and the newsletter no longer promises an unconfigured discount. Hero auto-rotation is off by default. Both preset homepage structures have the same shopping hierarchy.

Product field guide is included in `product.portable-tent`. Fill capacity, floor dimensions, peak height, packed dimensions/weight, materials, included items and weather rating with supplier-confirmed information. Connect product metafields for multiple products. Setup/care and delivery/returns are merchant-authored rich text; blanks stay hidden. The section never invents specifications.

Demo navigation automatically links only to pages that exist and are published; Shop all always uses Shopify's localized route. Create the documented pages, assign templates, and configure the primary header/footer menus in Shopify admin. This does not overwrite existing navigation or store content.

### Media needed before presentation

- One actual portable tent with matching front, side, interior, packed and detail photos; record source/license for each.
- Replace unrelated QA product photographs on the store. Do not use different products as alternate views or variants.
- Review the legacy bundled hero/video licenses before shipping a theme ZIP.

### Verification status for this branch

Code/static checks are not storefront acceptance. Run these on an authenticated unpublished Shopify preview with the actual products:

- Dark and Daylight at 390px, 768px and 1440px: no overflow; visible focus, readable forms and no clipped menus.
- Catalog → product → variant change → add to cart → quantity change/remove → checkout link; verify product, variant, price and quantity throughout.
- Search existing/nonexistent terms, filter/sort collections, empty collection and empty cart.
- Gallery swipe/buttons/keyboard, reduced motion, and disabled autoplay; images belong to the selected product.
- About, Lookbook, FAQ, Contact and Shipping/Returns resolve from navigation; submit forms only with an agreed test identity.
- Safari/iPhone and Android touch behavior; verify sticky controls do not cover content.

Store data/media replacement and this authenticated browser pass have not been executed by these repository changes. Do not mark them complete based on Theme Check alone.
