/**
 * AERA — Quick Add popover (Module 08).
 * Fetches templates/product.quick-add.json (layout: false) via the same
 * Section Rendering API pattern as the main PDP (assets/variant-picker.js):
 * JS only matches the selected options to a variant id client-side, then
 * re-fetches the whole fragment server-rendered for that variant — price,
 * availability and the add-to-cart button state are never computed here.
 * Single-variant products keep the plain one-click form in card-product.
 * liquid untouched; this only powers the [data-quick-add-trigger] path.
 */
(function () {
  'use strict';

  var dialog = document.getElementById('QuickAddDialog');
  var content = dialog ? dialog.querySelector('[data-quick-add-content]') : null;
  if (!dialog || !content) return;

  var activeController = null;

  function bindNewForm() {
    var form = content.querySelector('[data-cart-add-form]');
    if (form && window.AeraCart && window.AeraCart.bindAddForm) {
      window.AeraCart.bindAddForm(form);
    }
  }

  function load(url, signal) {
    content.setAttribute('aria-busy', 'true');
    return fetch(url, signal ? { signal: signal } : {})
      .then(function (res) {
        if (!res.ok) throw new Error('Quick add fetch failed: ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-quick-add-root]');
        if (!fresh) throw new Error('Quick add fragment missing');
        content.innerHTML = '';
        content.appendChild(fresh);
        var freshScript = doc.querySelector('[data-quick-add-json]');
        if (freshScript) content.appendChild(freshScript);
        content.removeAttribute('aria-busy');
        bindNewForm();
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        var message = content.getAttribute('data-error-text') || 'Something went wrong.';
        content.innerHTML = '<p class="quick-add__error" role="alert"></p>';
        content.firstChild.textContent = message;
        content.removeAttribute('aria-busy');
      });
  }

  function openFor(productUrl) {
    if (activeController) activeController.abort();
    activeController = ('AbortController' in window) ? new AbortController() : null;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    // Content loads async after showModal(), so native initial-focus (which
    // runs against the still-empty dialog) has nothing to land on — the
    // close button is the one control guaranteed to exist immediately.
    if (closeBtn) closeBtn.focus();
    load(productUrl + '?view=quick-add', activeController && activeController.signal);
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-quick-add-trigger]');
    if (!trigger) return;
    e.preventDefault();
    openFor(trigger.getAttribute('data-product-url'));
  });

  var closeBtn = dialog.querySelector('[data-quick-add-close]');
  if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    if (activeController) activeController.abort();
    content.innerHTML = '';
  });

  // ---- option change -> refetch the whole fragment for the matched variant ----
  function getProductData() {
    var script = content.querySelector('[data-quick-add-json]');
    if (!script) return null;
    try { return JSON.parse(script.textContent); } catch (e) { return null; }
  }

  function getSelectedOptions(root) {
    var selected = [];
    root.querySelectorAll('.option-selector').forEach(function (fieldset) {
      var checked = fieldset.querySelector('input:checked');
      if (checked) selected[parseInt(checked.getAttribute('data-option-position'), 10) - 1] = checked.value;
    });
    return selected;
  }

  content.addEventListener('change', function (e) {
    var input = e.target.closest('.option-selector__input');
    if (!input) return;
    var root = content.querySelector('[data-quick-add-root]');
    var data = getProductData();
    if (!root || !data) return;
    var selected = getSelectedOptions(root);
    var variant = data.variants.filter(function (v) {
      return v.options.length === selected.length && v.options.every(function (opt, i) { return opt === selected[i]; });
    })[0];
    if (!variant) return;
    if (activeController) activeController.abort();
    activeController = ('AbortController' in window) ? new AbortController() : null;
    load(data.url + '?view=quick-add&variant=' + encodeURIComponent(variant.id), activeController && activeController.signal);
  });

  // ---- quantity stepper (delegated — content is replaced on every fetch) ----
  content.addEventListener('click', function (e) {
    var stepperBtn = e.target.closest('[data-quantity-decrease], [data-quantity-increase]');
    if (!stepperBtn) return;
    var input = stepperBtn.parentElement.querySelector('[data-quantity-input]');
    if (!input) return;
    var min = parseInt(input.getAttribute('min'), 10) || 1;
    var value = parseInt(input.value, 10) || min;
    input.value = stepperBtn.hasAttribute('data-quantity-decrease') ? Math.max(min, value - 1) : value + 1;
  });
}());
