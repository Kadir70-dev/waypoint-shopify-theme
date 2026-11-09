# Cairnfield — genuine Shopify pre-order integration

## Why a theme cannot independently create a true pre-order
Cairnfield is a theme, not a purchase-options app. Shopify pre-orders require a **compatible installed pre-order app** which creates app-managed `selling_plan_groups` and `selling_plan_allocations` on the merchant's products. Shopify owns the actual payment and deferred-delivery logic. Merely changing the Add to Cart label or creating a "Pre-order" template does not create a pre-order.

Shopify documentation: https://help.shopify.com/en/manual/products/purchase-options/pre-orders/setup
Theme integration: https://shopify.dev/docs/storefronts/themes/pricing-payments/preorder-tbyb/add-preorder-tbyb-to-your-theme

## Setup for a merchant
1. Install a Shopify-compatible pre-order app, verify it supports your store's payment provider and market, and accept its purchase-option terms.
2. Configure a product in the app and provide a truthful expected dispatch timeframe, pre-payment/deposit and cancellation policy. If unavailable for shipping within the promised date, comply with Shopify's notice, cancellation and refund rules.
3. Confirm `product.selling_plan_groups` and the selected variant's `selling_plan_allocations` are populated.
4. Assign the product to the `product.preorder` theme template if you want the campaign below the buy box, and set its product-page campaign details.
5. Use `page.preorder` for an optional campaign landing page. Its CTA **links to a product**, not directly to a fabricated payment flow. Configure an actual product in the app before promising pre-orders.
6. Test one-time versus required-plan products, variant changes, non-JavaScript form submission, cart selling-plan labels, and ordinary Shopify checkout in **test mode**. Accelerated payment buttons are hidden for products with selling plans.
7. On the demo store, never run actual charges for sample/nonexistent merchandise. A "Preview only · Pre-orders not active" disclosure is shown when no app purchase option is configured.

## Current test constraints
- The Cairnfield demo store's 12 sample items currently have **no selling plan groups**, so a real pre-order checkout cannot be demonstrated yet.
- The theme renders the real Shopify selling plan radio choices when available for the selected variant; it posts `selling_plan` in the product form, uses Shopify's native cart, and displays the selected plan name on cart line items.
- A product with a required selling plan but zero available allocations has its standard product form disabled.
- This is a code-level implementation, not proof of a completed app checkout. Verify browser behavior on a test-store account with an authorized pre-order app.
- No invented shipment dates, fake inventory, review claims, or fabricated deposit amounts are permitted.
