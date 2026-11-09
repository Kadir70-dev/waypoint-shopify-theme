/**
 * Waypoint — PDP variant picker (Milestone 4).
 * Computes the matching variant client-side from the embedded variants
 * JSON, then re-fetches the buy box via the Section Rendering API
 * (?variant=<id>&section_id=main-product) so price/availability/SKU are
 * always server-rendered — same proven pattern as predictive search.
 * Also handles: unavailable option-combination marking, the quantity
 * stepper, the mobile sticky ATC bar, and gallery media (image/video/
 * external video) switching.
 * Requires JS: with JS disabled the option radios still show the
 * product's default variant correctly, but won't recompute on change
 * (a documented, accepted limitation — see snippets/product-buybox.liquid).
 */
(function () {
  'use strict';

  document.querySelectorAll('[data-product-gallery]').forEach(function (gallery) {
    var dataScript = document.querySelector('[data-product-json]');
    if (!dataScript) return;

    var productData;
    try {
      productData = JSON.parse(dataScript.textContent);
    } catch (e) {
      return; // malformed data — fail silently, static markup already works
    }

    var buybox = document.querySelector('[data-product-buybox]');
    if (!buybox) return;

    var stickyBtn = document.querySelector('[data-sticky-atc]');

    function setActiveMedia(mediaId) {
      if (!mediaId) return;
      var reducedMotion = document.documentElement.classList.contains('reduced-motion');
      var targetItem = null;
      gallery.querySelectorAll('[data-gallery-main-item]').forEach(function (item) {
        var active = String(item.getAttribute('data-media-id')) === String(mediaId);
        item.classList.toggle('is-active', active);
        if (active) {
          targetItem = item;
        } else {
          var video = item.querySelector('video');
          if (video) video.pause();
        }
      });
      if (targetItem && typeof targetItem.scrollIntoView === 'function') {
        targetItem.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
      }
      gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
        var active = String(thumb.getAttribute('data-media-id')) === String(mediaId);
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-selected', String(active));
      });
    }

    // ---- thumbnail clicks (no fetch needed, pure client-side) ----
    gallery.addEventListener('click', function (e) {
      var thumb = e.target.closest('[data-gallery-thumb]');
      if (!thumb) return;
      setActiveMedia(thumb.getAttribute('data-media-id'));
    });

    // ---- thumbnail arrow-key navigation ----
    // role="tablist"/"tab" was already declared on this markup (Milestone
    // 4); the ARIA APG Tabs pattern requires Left/Right (and Home/End) to
    // move between tabs, not just Tab — missing until this Milestone 8 fix.
    gallery.addEventListener('keydown', function (e) {
      var thumb = e.target.closest('[data-gallery-thumb]');
      if (!thumb) return;
      var key = e.key;
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(key) === -1) return;

      var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-thumb]'));
      var currentIndex = thumbs.indexOf(thumb);
      if (currentIndex === -1) return;

      var nextIndex = currentIndex;
      if (key === 'ArrowLeft') nextIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
      if (key === 'ArrowRight') nextIndex = (currentIndex + 1) % thumbs.length;
      if (key === 'Home') nextIndex = 0;
      if (key === 'End') nextIndex = thumbs.length - 1;

      e.preventDefault();
      var nextThumb = thumbs[nextIndex];
      nextThumb.focus();
      setActiveMedia(nextThumb.getAttribute('data-media-id'));
    });

    // ---- selected options + unavailable-combination marking ----
    function getSelectedOptions() {
      var selected = [];
      buybox.querySelectorAll('.option-selector').forEach(function (fieldset) {
        var checked = fieldset.querySelector('input[data-option-position]:checked');
        if (checked) selected[parseInt(checked.getAttribute('data-option-position'), 10) - 1] = checked.value;
      });
      return selected;
    }

    function findMatchingVariant(selected) {
      return productData.variants.filter(function (variant) {
        return variant.options.length === selected.length &&
          variant.options.every(function (opt, i) { return opt === selected[i]; });
      })[0];
    }

    // A value is "unavailable" when NO variant exists for it at all in
    // combination with the other currently-selected options — distinct
    // from a variant that exists but is sold out (that stays selectable;
    // the buy box shows its own sold-out state after fetch). Disabling
    // the input is what actually blocks selection, including keyboard
    // radio-group arrow navigation (a click/keydown guard alone would
    // not stop the browser's native "arrow key checks the next radio in
    // the group" behavior); the visible label + visually-hidden tag
    // still communicate why via .is-unavailable / [data-unavailable-tag].
    function markUnavailableCombinations() {
      var selected = getSelectedOptions();
      buybox.querySelectorAll('.option-selector__input[data-option-position]').forEach(function (input) {
        var position = parseInt(input.getAttribute('data-option-position'), 10);
        var candidate = selected.slice();
        candidate[position - 1] = input.value;
        var exists = !!findMatchingVariant(candidate);
        input.disabled = !exists;
        var label = input.nextElementSibling;
        if (!label) return;
        label.classList.toggle('is-unavailable', !exists);
        var tag = label.querySelector('[data-unavailable-tag]');
        if (tag) tag.hidden = exists;
      });
    }

    buybox.addEventListener('click', function (e) {
      var stepperBtn = e.target.closest('[data-quantity-decrease], [data-quantity-increase]');
      if (stepperBtn) {
        var input = stepperBtn.parentElement.querySelector('[data-quantity-input]');
        if (!input) return;
        var min = parseInt(input.getAttribute('min'), 10) || 1;
        var value = parseInt(input.value, 10) || min;
        value = stepperBtn.hasAttribute('data-quantity-decrease') ? Math.max(min, value - 1) : value + 1;
        input.value = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    var activeFetchController = null;

    function syncStickyBar(variant) {
      if (!stickyBtn) return;
      stickyBtn.disabled = !variant.available;
      stickyBtn.textContent = variant.available ? stickyBtn.getAttribute('data-label-add') : stickyBtn.getAttribute('data-label-sold-out');
    }

    function announceStatus(fresh) {
      var status = buybox.querySelector('[data-buybox-status]');
      if (!status) return;
      var title = fresh.querySelector('.product-buybox__title');
      var price = fresh.querySelector('.pcard__price');
      var badge = fresh.querySelector('.badge');
      var parts = [];
      if (title) parts.push(title.textContent.trim());
      if (price) parts.push(price.textContent.trim());
      if (badge) parts.push(badge.textContent.trim());
      status.textContent = parts.join(' — ');
    }

    function refreshBuybox(variant) {
      if (activeFetchController) activeFetchController.abort();
      activeFetchController = ('AbortController' in window) ? new AbortController() : null;

      var sectionEl = buybox.closest('.shopify-section');
      var sectionId = sectionEl ? sectionEl.id.replace(/^shopify-section-/, '') : 'main-product';
      var url = productData.url + '?variant=' + encodeURIComponent(variant.id) + '&section_id=' + encodeURIComponent(sectionId);
      var buyboxId = buybox.id;

      buybox.setAttribute('aria-busy', 'true');

      fetch(url, activeFetchController ? { signal: activeFetchController.signal } : {})
        .then(function (response) {
          if (!response.ok) throw new Error('Variant fetch failed: ' + response.status);
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var fresh = doc.getElementById(buyboxId);
          if (fresh) {
            buybox.innerHTML = fresh.innerHTML;
            // The swapped-in add-to-cart form is new markup: re-wire it so it still
            // opens the cart drawer instead of falling back to a full /cart page post.
            if (window.WaypointCart && window.WaypointCart.bindAddForm) {
              buybox.querySelectorAll('[data-cart-add-form]').forEach(window.WaypointCart.bindAddForm);
            }
            markUnavailableCombinations();
            announceStatus(fresh);
            var pageUrl = new URL(window.location.href);
            pageUrl.searchParams.set("variant", variant.id);
            window.history.replaceState(window.history.state, "", pageUrl.href);
          }
          buybox.removeAttribute('aria-busy');
          syncStickyBar(variant);
          if (variant.featured_media_id) setActiveMedia(variant.featured_media_id);
        })
        .catch(function (error) {
          if (error.name === 'AbortError') return;
          buybox.removeAttribute('aria-busy');
        });
    }

    buybox.addEventListener('change', function (e) {
      if (e.target.matches('.option-selector__input[data-option-position]')) {
        markUnavailableCombinations();
        var variant = findMatchingVariant(getSelectedOptions());
        if (!variant) return; // no exact match for this combination — leave last-known state
        refreshBuybox(variant);
      }
    });

    markUnavailableCombinations();
  });
})();
