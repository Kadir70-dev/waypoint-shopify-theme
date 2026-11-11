#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const read = path => fs.readFileSync(path, 'utf8');
const sectionSchema = path => {
  const match = read(path).match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  assert.ok(match, path + ': schema is present');
  return JSON.parse(match[1]);
};
const hero = sectionSchema('sections/hero-slider.liquid');
const heroSetting = name => hero.settings.find(setting => setting.id === name);
assert.equal(heroSetting('autoplay').default, false, 'Hero autoplay off by default (LCP)');
assert.equal(heroSetting('autoplay_interval').default, 3);
assert.equal(heroSetting('transition_duration').default, 800);

const home = JSON.parse(read('templates/index.json'));
assert.equal(home.sections.hero.type, 'hero-slider');
assert.equal(home.sections.hero.settings.autoplay, false);
assert.equal(home.sections.hero.settings.autoplay_interval, 3);
assert.equal(home.sections.hero.settings.transition_duration, 800);
assert.equal(home.sections.hero.block_order?.length || Object.keys(home.sections.hero.blocks).length, 3);

const gallery = sectionSchema('sections/rotating-gallery.liquid');
const galleryMarkup = read('sections/rotating-gallery.liquid');
assert.equal(gallery.settings.find(setting => setting.id === 'autoplay').default, true);
assert.equal(gallery.presets[0].blocks.length, 7);
assert.ok(galleryMarkup.includes('gallery_product.images'), 'Product fallback must be preserved');
assert.ok(galleryMarkup.includes('configured_images == 0'), 'Empty preset blocks must not block fallback');
assert.ok(galleryMarkup.includes('for repeat in (1..2)'), 'Two identical marquee groups');
assert.ok(galleryMarkup.includes('aria-hidden="true"'), 'Duplicate images hidden from screen readers');
assert.ok(!galleryMarkup.includes('<figcaption'), 'No visible gallery captions');

for (const path of ['templates/page.lookbook.json', 'templates/product.portable-tent.json']) {
  const doc = JSON.parse(read(path));
  const gallerySection = Object.values(doc.sections).find(section => section.type === 'rotating-gallery');
  assert.ok(gallerySection, path + ': gallery section exists');
  assert.equal(gallerySection.settings.autoplay, true);
}
const css = read('assets/component-rotating-gallery.css');
assert.match(css, /animation:\s*waypoint-marquee\s+32s\s+linear\s+infinite/);
assert.match(css, /translateX\(-50%\)/);
assert.ok(css.includes('padding-inline-end: 20px'), 'Equal group spacing required for seamless loop');
assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion CSS required');
assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
assert.ok(!/,\s*@media/.test(css), 'No invalid selector/media nesting');
const motion = read('assets/motion.js');
const marquee = read('assets/rotating-gallery.js');
assert.ok(motion.includes('if (autoplay) activate();'), 'Hero autoplay starts without user interaction when enabled');
assert.ok(marquee.includes('visibilitychange'), 'Gallery tab visibility handling');
assert.ok(marquee.includes('IntersectionObserver'), 'Gallery viewport handling');
assert.ok(marquee.includes('aria-pressed'), 'Gallery user pause control');
console.log('Hero/gallery regression checks passed.');
