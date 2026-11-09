# Waypoint / Cairnfield — English & Arabic storefront release

## What is in the theme

- Desktop: language switcher in the header icon area (English / عربي).
- Mobile: switcher inside the hamburger navigation, below the top toolbar, to keep the narrow header usable.
- The form uses Shopify's native `language_code` field; it works without JavaScript.
- Language is shown only when the merchant has more than one language available to the buyer's current market/domain.
- Theme UI strings are in `locales/en.default.json` and `locales/ar.json`.
- The page root uses `dir=rtl` for Arabic.
- Offer badges use translated labels; manually configured promotional text must still be translated in Shopify.

## Merchant steps (store data, not theme code)

1. Confirm the correct Shopify store (Waypoint versus Cairnfield) and the language status in **Settings → Languages**. Arabic must be **Published** for the intended market/domain.
2. Use **Translate & Adapt** to provide Arabic translations for products, collections, navigation/menu items, pages, blogs, meta titles/descriptions, and customizable theme content. Merely publishing Arabic does not translate these automatically; a 'No translations' status requires content work.
3. Verify the theme setting **Show language toggle** is on in the theme editor for *both presets*. The setting defaults to on in the repository, but merchant settings in an existing published theme may override it.
4. Preview on an **unpublished theme** with content populated. Do not overwrite the live `config/settings_data.json` or live JSON templates.
5. Click EN → عربي → EN, checking the URL stays on the correct localized storefront, the selected language is visually marked, and the direction changes without JavaScript.
6. Test 390px, 768px and 1440px including cart, product detail, collection filters, search, mega-menu and mobile drawer. Confirm focus/keyboard, no clipped text, no horizontal overflow, correct arrow icon directions and readable typography.
7. Validate localized shipping, payments, return terms and actual inventory before opening purchasing or preorders.

## Validation scope

`node scripts/test_language_toggle.cjs` verifies the native form field, mobile/desktop selectors, RTL document direction and badge translation keys. Static CI and Theme Check do **not** constitute an authenticated browser/storefront test.
