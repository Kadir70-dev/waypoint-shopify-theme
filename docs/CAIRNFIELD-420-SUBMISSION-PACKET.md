# Cairnfield — $420 USD Theme Store submission packet

**Prepared 2026-11-10.** This is the current submission checklist/copy for **Cairnfield**, superseding the older Waypoint-named drafts in `docs/THEME-STORE-*-SUBMISSION.md` and `docs/THEME-STORE-LISTING-DRAFT.md`.

**Status: Draft materials only. NOT uploaded to the Partner Dashboard; NOT submitted, approved or live in the Shopify Theme Store.** The connected Shopify Admin API cannot edit the Partner Theme Store listing or acknowledge the legal Partner Agreement.

## Verified identity and pricing

- Theme: **Cairnfield** / version **1.0.0** / author **K70 Network Solution**
- Theme Store asking price: **$420 USD** (Shopify currently allows $100–$500 in increments of $10).
- Presets in submission ZIP: **Cairnfield** (dark) and **Daylight** (light); each requires its own listing, functioning demo store, and marketing images.
- Latest merged i18n/RTL changes: GitHub PR #4, main squash SHA `c42c73bce9c4ef2db1884677b38239906810a143`.
- Theme Check / submission ZIP CI passed on the PR source. A separate, final local ZIP has been reported as validator PASS, but cannot be uploaded from this connection: the ZIP is on the developer's machine (`~/cairnfield-release/Cairnfield-1.0.0.zip`).
- Shopify connected store: `cairnfield-outdoor-demo-y0g6jech.myshopify.com`, 12 ACTIVE demo products at last inspection; Arabic and English published. Horizon is **MAIN**, and `Cairnfield preview 42a1f2c` (theme ID `188693217389`) is **UNPUBLISHED**.
- Support URLs from `settings_schema.json`: https://cairnfield-theme-support.vercel.app/ and https://cairnfield-theme-support.vercel.app/docs.html. Vercel production deployment is READY; **public HTTP reachability and support-form submission remain to be tested**.

## Copy for preset 1 — Cairnfield

**Suggested industry:** Sports (outdoor/camping equipment)  
**Suggested catalog tag:** Some (11–100+), conditional on a representative demo catalog  
**Tagline (max 70 chars):** Cinematic storefronts for outdoor and adventure brands  
**SEO description:** Cairnfield is a Shopify theme for outdoor equipment and adventure brands, combining expressive editorial imagery with clear collection browsing and detailed product pages.

**Short listing introduction:** Give outdoor products a compelling place to be discovered. Cairnfield balances dramatic imagery, structured collections, and informative product presentation in an adaptable storefront.

**Three highlight drafts** (replace descriptions if real demo screenshots do not match):
1. **Cinematic storefront** — Full-width imagery and thoughtful typography introduce collections with an outdoor point of view.
2. **Explore with confidence** — Structured product and collection layouts make essential details easier to find.
3. **Flexible storytelling** — Reusable sections connect campaign imagery, products, and helpful brand content.

## Copy for preset 2 — Daylight

**Suggested industry:** Bags (travel backpacks and everyday carry)  
**Suggested catalog tag:** Some (11–100+), only if the second demo store matches  
**Tagline (max 70 chars):** An airy editorial look for bags and everyday essentials  
**SEO description:** Daylight is a light-toned Cairnfield preset for bags and travel accessories, with calm merchandising, flexible page sections, and product-focused layouts.

**Short listing introduction:** Put products first in a bright, welcoming storefront. Daylight combines clear browsing paths with balanced imagery and layouts suited to bags, accessories, and everyday gear.

**Three highlight drafts**:
1. **Designed for discovery** — Airy collection layouts and clear hierarchy help customers explore everyday essentials.
2. **Product detail, in focus** — Present variants, imagery, and key product information in a readable format.
3. **Your brand's perspective** — Flexible sections connect campaigns, stories, and products.

## Fields that must be completed with authentic evidence

| Field | Cairnfield | Daylight |
| --- | --- | --- |
| Demo URL, password, matching preset | Existing connected store, but full client-transfer demo and test checkout **not verified** | **Second demo store missing** |
| Desktop home screenshot, 1000×1248 or 2000×2496 | Not verified | Missing |
| Mobile home screenshot, 750×1334 | Not verified | Missing |
| Three 1600×1200 highlight stills, or eligible first video | Not verified | Missing |
| Each screenshot's descriptive alt text | Write after capturing the actual image | Write after capturing the actual image |
| Valid demo checkout (Bogus Gateway or Shopify Payments test mode) | Not verified | Not set |
| Populated home, product, collection and accessibility/mobile tests | Not verified | Not verified |
| Merchant docs and public support contact form | Vercel READY; public form delivery not verified | Same support, test pending |

**Theme review gates:** Verify structural originality (no Dawn/Horizon derivative), acceptable third-party scripts (notably MapLibre loading from an external CDN), redistributed media rights, all mandatory Theme Store functional requirements, authentic Arabic content where a bilingual demo is shown, test-mode checkout, browser QA, and Lighthouse averages on home/collection/product for **both** mobile and desktop (performance >=60, accessibility >=90). Technical ZIP validation does NOT prove approval.

Do not describe a cosmetic pre-order component as a working preorder without a genuine purchase option. Do not invent product stock, delivery claims, reviews, or operating business locations.

## Final Partner Dashboard steps (requires authenticated Partner account)

1. Open https://partners.shopify.com/ (or the Partner Dashboard currently linked in Shopify developer docs), sign in, select **Themes → Submit a theme**.
2. Upload the **actual final** `Cairnfield-1.0.0.zip` from the developer's machine. Verify the ZIP validator's detected theme and two preset names before proceeding. The name cannot be changed after upload.
3. Set **theme price = 420 USD**. Populate **both** preset forms using the text above, with their **real** demo URLs, correct industries/catalog sizes, and required captures/alt text. Only claim features verified on the corresponding demo.
4. Confirm developer support/docs URLs are public and work, and give accurate reviewer test information. Review Shopify's legal agreement yourself; **no automated legal attestation**.
5. Submit for review only after the two functional demo stores and quality gates above pass. Shopify's Theme Store approval and publication are not guaranteed.

References:
- https://shopify.dev/docs/storefronts/themes/store/requirements
- https://shopify.dev/docs/storefronts/themes/store/review-process/listings
- https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
