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
