# Waypoint — Shopify Theme Store Submission Plan ($420 USD)
Last verified: 2026-11-09. This document supersedes the "launch as a physical-goods store" focus of RELEASE-GATES-2026-11-09.md for the **commercial objective**.

## Actual objective
Publish **Waypoint as a paid Shopify Theme Store product priced at $420 USD**, for merchants to license and install. **Do not publish a store with tent inventory for real sales** as a prerequisite. The connected Shopify store is a **development/demo/testing environment**, not the business model.

The Shopify Theme Store listing guidance allows $100-$500 USD in increments of $10, so **$420 is permitted as a proposed list price**. Shopify alone decides whether a submission is approved.

Primary references:
- https://shopify.dev/docs/storefronts/themes/store/requirements
- https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
- https://shopify.dev/docs/storefronts/themes/store/review-process/listings

## Current repo / Shopify facts verified
- Theme in repo: `config/settings_schema.json` identifies Waypoint v1.0.0, author K70 Network Solution.
- Preset listing directories: `listings/waypoint`, `listings/daylight`.
- Templates include the standard OS 2.0 templates; `sections/custom-liquid.liquid` is present.
- Branch Locations section + optional MapLibre/MapTiler integration included.
- Premium demo preview in connected Shopify store: theme `189774528574` (UNPUBLISHED); MAIN theme `189745430590` not overwritten.
- Connected store has **zero ACTIVE products**; 13 QA fixtures are ARCHIVED and the tent is DRAFT with four illustrative AI renders and no confirmed inventory.
- GitHub PR #1: `feat/demo-pages-preorder`; static integrity CI has passed, but this **does not** represent the full Theme Store review or live browser testing.
- Existing README mentions Lighthouse scores from an earlier QA setup; do not present those as current official benchmark results.

## Blocking gates before Shopify submission
1. **Originality / eligibility (P0):** verify the entire architecture and creative design are genuinely original or derived only from Shopify Skeleton Theme. Theme Store new submissions derived from Dawn or Horizon are ineligible. Ensure Waypoint and Daylight are meaningfully different from existing Theme Store offerings and theme name is unique. Git history/licensing must be defensible.
2. **Functional compliance (P0):** independently audit against the **current full official Theme Store requirements**: product variants / unit and compare prices / media / swatches / accelerated checkout / pickup / selling plans, discounts / cart notes / search / filters / accounts, gift card, responsive and accessible UI. Validate app block and custom Liquid support, section groups, translations, theme settings, and SEO structured data. Fix code, do not merely document missing features.
3. **Third-party dependencies (P0):** assess MapLibre from external unpkg CDN and MapTiler API-key requirement against Shopify's themes asset-hosting and prohibition on app-like API-dependent functionality. Consider shipping the licensed library as a theme asset and making location mapping fully optional, or removing non-compliant functionality. Don't claim that external-key-dependent satellite/3D mapping is guaranteed on install.
4. **Per-preset demos (P0):** each preset requires its own *realistic, fully functioning* merchant-facing **client transfer** demo store, with genuine usable demo catalog (products, variants, images, policies/test checkout). A physical tent supplier is **not** required for selling the theme; use a licensed, plausible demonstration catalog and test gateway rather than representing products as real inventory for sale. A single store with zero active products is not an acceptable premium Theme Store demo.
5. **Brand/media rights (P0):** confirm license and explicit permission where required for each demo asset, product brand or third-party image. Avoid invented reviews, falsified stock, fake scarcity and unrealistic claims. Demo content must look commercially credible. 
6. **Performance/accessibility (P0):** Shopify baseline requires average Lighthouse **performance >=60** and **accessibility >=90** for home, collection and product pages, on both mobile and desktop, using meaningful populated sections. Actual measured reports needed. Also test Safari, Chrome, Android and customer flows.
7. **Presets/package (P1):** verify both `listings/waypoint` and `listings/daylight` install states match their respective demo stores; avoid demo-store-specific IDs in distributed theme defaults. Run `shopify theme check` and `shopify theme package`; validate final ZIP (not a GitHub source ZIP).
8. **Documentation & support (P1):** prepare publicly accessible merchant docs, FAQ, support contact form and support policy; theme support email alone is insufficient. Maintain version number and release notes. Ensure branding, metadata and theme name satisfy uniqueness/naming rules.
9. **Listing assets (P1):** prepare **for each preset** desktop homepage screenshot at 1000×1248 or 2000×2496, mobile at 750×1334, and 3 feature highlights (static highlights at 1600×1200). Provide accessible alt text, unique tagline <=70 chars, listing categories, marketing text and reviewer test notes.
10. **Submission (human/account action):** developer/partner logs into Shopify Partner Dashboard → Themes → Submit a theme, uploads validated ZIP, selects **$420 USD** listing price, connects each preset to its demo store, completes listing/support/preview details and submits for review. **Review approval, $420 listing and publication are not automatic**; no tool in this chat can submit on behalf of the Partner account.

## Priorities that changed
- Not a blocker to Theme Store listing: supplier-confirmed tent stock, real branch addresses, live merchant shipping rates, real pre-order payments. These matter only if the demos claim to sell actual branded goods or the features require them for a credible review.
- Critical: populated demo products, actual cart/checkout test gateway, per-preset demo stores, permitted third-party assets, merchant support, original source eligibility, complete review checklist and submission ZIP.
- Never activate real payments or publish an unreviewed theme simply to make a demo appear active.

## Accurate release verdict
**$420 price is allowed. Waypoint is NOT YET SUBMITTED or approved on the Shopify Theme Store.** Complete gates above before sending a review submission. Keep MAIN theme unchanged while preparing separate reviewable demo stores and clean submission artifacts.


## 2026-11-09 distribution hardening (verified)
- Sanitized **27** distribution JSON templates and preset listing templates to remove **181** product/page/collection handles specific to the example store. Shopify demo store Theme Editor settings were not modified.
- Added portable-defaults validation to `scripts/validate_theme_json.py`.
- GitHub Actions Theme Check + submission ZIP generation passed at commit `b2c2ff2`.
- Verified current generated `Waypoint-1.0.0.zip` archive has **256 files**, valid ZIP CRC, **zero** resource handles in distributed section settings, and SHA-256 `4f03caf7175c5be6d9b2c198b6067c59f3b65d4764b732c887f575ff047861ff`.
- GitHub Actions artifact from run `42528808151` is an automated build of that ZIP (artifact expires after 1 day); the validated ZIP has also been extracted as the conversation attachment.
- **Do not confuse technical ZIP validation with Shopify Theme Store approval**. Partner Dashboard submission not performed; current Shopify connector does not expose it.
- **Outstanding code risk:** `assets/branch-locations.js` loads MapLibre GL JS as a remote ES module from unpkg when a merchant supplies a MapTiler key. Shopify requires theme scripts to be on Shopify's CDN except approved third-party libraries, and app-like external API integrations are restricted. Resolve this with an eligible, Shopify-hosted implementation or remove the optional module from the distribution if reviewers require it.
- **Outstanding review prerequisites:** separate client-transfer demo stores for Waypoint and Daylight with populated realistic catalogs and test checkout, actual mobile/desktop Lighthouse measurements, public developer documentation plus support contact form, rights/originality verification, and screenshot assets. No proof these are complete.
