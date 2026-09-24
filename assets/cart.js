/**
 * AERA — cart (Milestone 5).
 * Progressively enhances the real add-to-cart forms already shipped in
 * Milestone 4 (PDP buy box, card-product quick-add) — it never replaces
 * them, only intercepts submit — and drives the cart drawer / full cart
 * page, both of which stay correct with zero JS via their own native
 * <form> (updates[]/checkout submit buttons, formaction="/cart/clear").
 *
 * Every mutation (add/change/clear) re-fetches each cart surface present
 * on the current page via the Section Rendering API and swaps its whole
 * content by container id — same pattern the PDP buy box and product
 * recommendations already use. The drawer is a genuine section
 * (sections/cart-drawer.liquid), fetchable by handle regardless of
 * settings.cart_type, so every successful add opens it as a confirmation
 * even when the header icon itself just links to the full /cart page.
 */
(function () {
  'use strict';

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  var cartUrl = '/cart';
  var routesEl = document.querySelector('[data-cart-routes]');
  if (routesEl) {
    try {
      cartUrl = JSON.parse(routesEl.textContent).cart_url || cartUrl;
    } catch (e) {
      // malformed data — keep the '/cart' default, still correct on stores
      // without a custom cart URL
    }
  }

  // ---------- header cart-count badge ----------
  function updateHeaderCount(cart) {
    qsa('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.hidden = cart.item_count === 0;
    });
  }

  // ---------- screen-reader status announcement ----------
  // Mirrors the PDP buy box's aria-live pattern (Milestone 4) — AJAX cart
  // mutations had no equivalent until now (Milestone 8 accessibility fix).
  function announceCartStatus(action, cart) {
    qsa('[data-cart-status]').forEach(function (el) {
      var actionText = el.getAttribute('data-status-' + action);
      if (!actionText) return;
      var countText;
      if (cart.item_count === 1) {
        countText = el.getAttribute('data-status-count-one');
      } else {
        countText = (el.getAttribute('data-status-count-other') || '').replace('%d', cart.item_count);
      }
      el.textContent = countText ? actionText + '. ' + countText + '.' : actionText + '.';
    });
  }

  // ---------- swap a whole cart surface by container id (drawer / page) ----------
  function swapSurface(sectionId, targetId) {
    var target = document.getElementById(targetId);
    if (!target) return Promise.resolve();

    return fetch(cartUrl + '?section_id=' + sectionId)
      .then(function (response) {
        if (!response.ok) throw new Error('Cart section fetch failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.getElementById(targetId);
        if (fresh) target.innerHTML = fresh.innerHTML;
      });
  }

  function refreshCartSurfaces() {
    var tasks = [swapSurface('cart-drawer', 'CartDrawerContent')];
    if (document.getElementById('CartPageContent')) {
      tasks.push(swapSurface('main-cart', 'CartPageContent'));
    }
    return Promise.all(tasks);
  }

  // ---------- add to cart ----------
  function setAddButtonState(button, state) {
    if (!button) return;
    if (button.hasAttribute('data-label-add')) {
      if (state === 'add') {
        button.textContent = button.getAttribute('data-label-add') + ' →';
      } else {
        var label = button.getAttribute('data-label-' + state);
        if (label) button.textContent = label;
      }
    }
    button.classList.toggle('is-loading', state === 'adding');
    button.classList.toggle('is-added', state === 'added');
    button.disabled = state === 'adding';
  }

  function addToCart(form) {
    var submitButton = form.querySelector('[type="submit"]');
    var formData = new FormData(form);

    setAddButtonState(submitButton, 'adding');

    fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: formData })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            var error = new Error(data.description || 'Unable to add to cart');
            error.data = data;
            throw error;
          }
          return data;
        });
      })
      .then(function () {
        return fetch('/cart.js', { headers: { Accept: 'application/json' } }).then(function (r) {
          return r.json();
        });
      })
      .then(function (cart) {
        updateHeaderCount(cart);
        announceCartStatus('added', cart);
        setAddButtonState(submitButton, 'added');
        return refreshCartSurfaces();
      })
      .then(function () {
        // A native <dialog> (quick add, PDP zoom) may still be open — two
        // modal surfaces competing for the focus trap is a real conflict,
        // not a cosmetic one, so close any before opening the drawer.
        qsa('dialog[open]').forEach(function (openDialog) { openDialog.close(); });
        if (window.AeraOverlays && window.AeraOverlays.CartDrawer) {
          window.AeraOverlays.CartDrawer.open();
        }
        setTimeout(function () {
          setAddButtonState(submitButton, 'add');
        }, 1600);
      })
      .catch(function () {
        // Sold out via a race, network error, etc. — the button and form
        // already reflected the last known-good state; just stop spinning.
        setAddButtonState(submitButton, 'add');
      });
  }

  function bindAddForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      addToCart(form);
    });
  }
  qsa('[data-cart-add-form]').forEach(bindAddForm);

  // Exposed so surfaces that inject a [data-cart-add-form] after this
  // script's initial pass (e.g. the quick-add popover's fetched markup)
  // can wire the same add-to-cart path instead of a second implementation.
  window.AeraCart = window.AeraCart || {};
  window.AeraCart.bindAddForm = bindAddForm;

  // ---------- quantity / remove within a cart surface ----------
  function findLineKey(el) {
    var line = el.closest('[data-cart-line-item]');
    return line ? line.getAttribute('data-line-key') : null;
  }

  // Guards against rapid stepper clicks firing overlapping requests that
  // could resolve out of order and leave stale UI showing — the same
  // AbortController pattern already used in variant-picker.js and
  // predictive-search.js, missing here until this Milestone 8 fix.
  var activeChangeController = null;

  function showCartError(message) {
    qsa('[data-cart-error]').forEach(function (el) {
      el.textContent = message;
      el.hidden = !message;
    });
  }

  function changeLine(key, quantity, scope, onError) {
    if (activeChangeController) activeChangeController.abort();
    activeChangeController = ('AbortController' in window) ? new AbortController() : null;

    if (scope) scope.setAttribute('aria-busy', 'true');
    showCartError('');

    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity }),
      signal: activeChangeController ? activeChangeController.signal : undefined
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            var error = new Error(data.description || data.message || 'Unable to update cart');
            throw error;
          }
          return data;
        });
      })
      .then(function (cart) {
        updateHeaderCount(cart);
        announceCartStatus(quantity === 0 ? 'removed' : 'updated', cart);
        return refreshCartSurfaces();
      })
      .then(function () {
        if (scope) scope.removeAttribute('aria-busy');
      })
      .catch(function (error) {
        if (scope) scope.removeAttribute('aria-busy');
        if (error.name === 'AbortError') return;
        if (onError) onError();
        showCartError(error.message || 'Unable to update cart');
      });
  }

  qsa('[data-cart-form]').forEach(function (form) {
    form.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        e.preventDefault();
        var key = findLineKey(removeBtn);
        if (key) changeLine(key, 0, form);
        return;
      }

      var stepperBtn = e.target.closest('[data-quantity-decrease], [data-quantity-increase]');
      if (stepperBtn) {
        e.preventDefault();
        var input = stepperBtn.parentElement.querySelector('[data-quantity-input]');
        if (!input) return;
        var previous = input.value;
        var min = parseInt(input.getAttribute('min'), 10) || 1;
        var value = parseInt(input.value, 10) || min;
        value = stepperBtn.hasAttribute('data-quantity-decrease') ? Math.max(min, value - 1) : value + 1;
        input.value = value;
        var lineKey = findLineKey(stepperBtn);
        if (lineKey) changeLine(lineKey, value, form, function () { input.value = previous; });
      }
    });

    form.addEventListener('change', function (e) {
      if (!e.target.matches('[data-cart-quantity-input]')) return;
      var previousValue = e.target.defaultValue;
      var value = parseInt(e.target.value, 10);
      if (!value || value < 1) value = 1;
      e.target.value = value;
      var key = findLineKey(e.target);
      if (key) changeLine(key, value, form, function () { e.target.value = previousValue; });
    });
  });

  // ---------- clear cart (AJAX enhancement; formaction="/cart/clear" on
  // the button itself is the real no-JS fallback) ----------
  qsa('[data-cart-clear]').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } })
        .then(function (response) {
          return response.json();
        })
        .then(function (cart) {
          updateHeaderCount(cart);
          announceCartStatus('cleared', cart);
          return refreshCartSurfaces();
        });
    });
  });

  // ---------- header cart icon: only opens the drawer when
  // settings.cart_type is "drawer" (the only time it carries this
  // attribute at all — see sections/header.liquid) — without this, the
  // generic [data-overlay-trigger] wiring in overlay.js would open the
  // drawer AND let the link's default action navigate to /cart. ----------
  qsa('[data-overlay-trigger="CartDrawer"]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
})();
