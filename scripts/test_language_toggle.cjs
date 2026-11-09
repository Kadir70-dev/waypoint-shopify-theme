#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = filename => fs.readFileSync(filename, 'utf8');

const header = read('sections/header.liquid');
const switcher = read('snippets/language-toggle.liquid');
const css = read('assets/component-nav.css');
const layout = read('layout/theme.liquid');
const english = JSON.parse(read('locales/en.default.json'));
const arabic = JSON.parse(read('locales/ar.json'));

assert.ok(header.includes("render 'language-toggle', placement: 'header'"), 'Desktop selector should be present');
assert.ok(header.includes("render 'language-toggle', placement: 'drawer'"), 'Mobile drawer selector should be present');
assert.ok(header.includes('mobile-nav__locale'), 'Mobile drawer selector needs a labeled area');
assert.ok(switcher.includes("form 'localization'"), 'Selector must use native Shopify localization form');
assert.ok(switcher.includes('name="language_code"'), 'Shopify localization must submit language_code');
assert.ok(!switcher.includes('name="locale_code"'), 'locale_code is NOT a valid Shopify language form parameter');
assert.ok(switcher.includes('localization.available_languages.size > 1'), 'Do not show unavailable languages');
assert.ok(switcher.includes('aria-current="true"'), 'Current language must be conveyed to assistive technology');
assert.ok(switcher.includes("placement | default: 'header'"), 'Header and drawer require unique form IDs');
assert.ok(css.includes('.mobile-nav__locale .lang-toggle'), 'Language selector must be styled in mobile nav');
assert.ok(css.includes('.lang-toggle__option:focus-visible'), 'Keyboard focus styling is required');
assert.ok(layout.includes('dir="{% if rtl_locales contains request.locale.iso_code %}rtl{% else %}ltr{% endif %}"'), 'Arabic must use document RTL');
for (const key of ['offer_20_off','offer_15_off','offer_10_off','offer_limited','offer_new','offer_bestseller','offer_preorder','offer_bundle']) {
  assert.ok(english.products[key], 'Missing English badge translation: ' + key);
  assert.ok(arabic.products[key], 'Missing Arabic badge translation: ' + key);
  assert.match(read('snippets/offer-badge.liquid'), new RegExp("products\\." + key), 'Badge must render translated key: ' + key);
}
console.log('Language toggle, RTL and Arabic badge localization checks passed.');
