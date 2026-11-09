# Waypoint Premium Demo — Release Gates (9 November 2026)

## Scope / safety
- Store: `aera-dev-ysurfe4h.myshopify.com`
- Current published MAIN theme: `189745430590` (do not overwrite)
- Premium preview theme: `189774528574` (UNPUBLISHED)
- Pull request: https://github.com/Kadir70-dev/waypoint-shopify-theme/pull/1
- Shopify-admin changes to JSON templates and menus differ from bare repository defaults. Reconcile **both directions** before merging/publishing. Do not force-push `main` into the live theme.

## Completed, verified in Shopify Admin
- 13 QA fixture products archived, none active; the concept tent is DRAFT with zero inventory.
- Tent holds 4 AI-generated images labeled as concept renders; no real specifications, availability or preorder claims.
- Preview page templates: demo, catalog, lookbook, FAQ, size guide, upcoming collection, our-story, and locations.
- 3D/satellite locations section and CSS/JS assets installed in unpublished preview, plus linked preview navigation.
- Branch directory accepts up to 30 real locations; no fictional business addresses or coordinates loaded.
- Premium CSS for locations and demo components uploaded successfully to preview.
- The `shipping-returns` page remains private until shipping and refund policies are approved.
- Repository static CI checks JSON, Liquid schema, JavaScript syntax and location coordinate cases.

## Automated checks and launch-blocking evidence
- Static CI: passing on the previous commit; always inspect the current PR HEAD checks before release.
- Lighthouse workflow is *configured*, not executed as a completed browser audit. It now targets homepage, locations, demo, and lookbook preview paths and uses current preview theme ID. Execution requires GitHub Actions secrets `SHOP_STORE`, `SHOP_CLIENT_ID`, `SHOP_CLIENT_SECRET`, and `SHOP_PASSWORD` (only when password protected). Do not paste these secrets into chat.
- External browser access to Shopify preview is blocked from the assistant environment; therefore no verified WebGL rendering, Safari/Android QA, checkout proof, performance score, or accessibility score exists.

## Launch gates that require merchant-supplied reality
1. **Locations:** Enter genuine headquarters/branch names, addresses and confirmed decimal GPS coordinates in the branch blocks; upload licensed actual branch photos. Configure a **public browser MapTiler key** restricted to the storefront origin; do not embed a private server credential. Verify satellite tiles, map attribution, Streets/Satellite controls, 3D terrain/building tilt, fit-to-all, filtered pins and Google Maps directions in a real browser.
2. **Products:** obtain manufacturer-approved titles, image rights, GTIN/SKU, composition, measurements, capacity, weight, weather claims, cost/price, tax and actual inventory. Replace AI concept imagery before selling a real tent. Maintain zero stock and DRAFT until complete.
3. **Customer terms:** approve real shipping zones/rates, refund/return policy, cancellation/refund terms for preorders, tax, legal company details and privacy/contact details. Do not invent them.
4. **Preorder:** choose an authorized compatible Shopify preorder app and confirm it creates a valid selling plan/purchase option with a real delivery range and customer-consented payment terms. Do not accept money early via a cosmetic button.
5. **Browser acceptance:** verify 360/390/768/1024/1440px sizes, Dark/Daylight, reduced-motion, keyboard operation, contrast, images, cart, variants, search, filters, newsletter, 404 and checkout. Run Lighthouse mobile & desktop against actual storefront, not /password redirects.
6. **Release:** review the GitHub diff to avoid clobbering Shopify editor data, merge after checks, then promote via a deliberate Shopify admin publish action with snapshot/rollback. The Shopify connector does not allow live theme publishing from this workflow.

## Exact review links
- Preview: https://aera-dev-ysurfe4h.myshopify.com/?preview_theme_id=189774528574
- Locations: https://aera-dev-ysurfe4h.myshopify.com/pages/locations?preview_theme_id=189774528574
- PR: https://github.com/Kadir70-dev/waypoint-shopify-theme/pull/1

**Release verdict: NOT READY for commercial sales or a verified 3D map launch.** The creative/code preview and automated static QA are not substitutes for verified merchant facts and storefront browser tests.
