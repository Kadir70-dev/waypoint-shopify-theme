/**
 * AERA — AJAX faceted filtering + sort (Module 07).
 * Progressive enhancement over the plain <a href>/<form method="get">
 * filter markup already in main-collection-grid.liquid/filter-groups.liquid:
 * every filter link, the price-range form, the sort <select> and
 * pagination links still point at real, working collection URLs (no-JS
 * fallback stays correct); this file intercepts them, fetches the same
 * URL via Shopify's Section Rendering API (?section_id=...), and swaps
 * only the meta/sidebar/main/mobile-drawer regions in place instead of
 * a full page reload.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-collection-facets]');
  if (!root) return;

  var sectionId = root.getAttribute('data-section-id');
  var mobilePanel = document.getElementById('MobileFiltersPanel-' + sectionId);
  var swapIds = ['CollectionMeta-' + sectionId, 'CollectionSidebar-' + sectionId, 'CollectionMain-' + sectionId, 'MobileFiltersPanel-' + sectionId];

  function setBusy(busy) {
    var main = document.getElementById('CollectionMain-' + sectionId);
    var sidebar = document.getElementById('CollectionSidebar-' + sectionId);
    if (main) main.setAttribute('aria-busy', String(busy));
    if (sidebar) sidebar.setAttribute('aria-busy', String(busy));
  }

  // Re-bind the mobile-filter-drawer open trigger after a DOM swap — the
  // shared overlay system (overlay.js) binds [data-overlay-trigger] once
  // at DOMContentLoaded, not via delegation, so a replaced trigger button
  // loses that listener otherwise.
  function rebindFilterTrigger() {
    var trigger = document.querySelector('[data-overlay-trigger="MobileFilters"]');
    var instance = window.AeraOverlays && window.AeraOverlays.MobileFilters;
    if (!trigger || !instance) return;
    trigger.setAttribute('aria-expanded', String(instance.isOpen()));
    trigger.addEventListener('click', function () {
      if (instance.isOpen()) instance.close();
      else instance.open(trigger);
    });
  }

  function render(html, targetUrl) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var statusText = doc.querySelector('#CollectionMeta-' + sectionId + ' .eyebrow');
    swapIds.forEach(function (id) {
      var next = doc.getElementById(id);
      var current = document.getElementById(id);
      if (current && next) current.replaceWith(next);
      else if (current && !next) current.remove(); // e.g. filters removed entirely
    });
    rebindFilterTrigger();
    // The swapped regions are replaced wholesale, not mutated in place, so
    // a live region living inside one of them can't be relied on to
    // announce — this status node stays put across every render() call.
    var status = document.querySelector('[data-collection-status]');
    if (status && statusText) status.textContent = statusText.textContent.trim();
    if (targetUrl) window.history.pushState({ collectionFacets: true }, '', targetUrl);
    setBusy(false);
    if (document.getElementById('CollectionMain-' + sectionId)) {
      document.getElementById('CollectionMain-' + sectionId).scrollIntoView({ block: 'nearest' });
    }
  }

  function load(targetUrl, pushUrl) {
    setBusy(true);
    var fetchUrl = targetUrl + (targetUrl.indexOf('?') === -1 ? '?' : '&') + 'section_id=' + sectionId;
    fetch(fetchUrl)
      .then(function (res) { return res.text(); })
      .then(function (html) { render(html, pushUrl); })
      .catch(function () { setBusy(false); }); // network failure: leave current results, no crash
  }

  function isFacetLink(link) {
    return link && link.matches('.filter-option, .filter-chip, .filter-chips__clear, .mobile-filter-drawer__clear, .pagination__link:not(.pagination__link--disabled):not(.pagination__link--current)');
  }

  function onClick(e) {
    var link = e.target.closest('a');
    if (!isFacetLink(link)) return;
    e.preventDefault();
    load(link.href, link.href);
  }

  // Delegated from stable containers that are never themselves replaced
  // (only their children, via swapIds) — survives every DOM swap.
  root.addEventListener('click', onClick);
  if (mobilePanel) mobilePanel.parentElement.addEventListener('click', onClick);

  function onSubmit(e) {
    var form = e.target.closest('form.collection-sort, form.filter-group__price');
    if (!form || !form.closest('[data-collection-facets], #MobileFilters')) return;
    e.preventDefault();
    var params = new URLSearchParams(new FormData(form)).toString();
    var url = form.action + (params ? '?' + params : '');
    load(url, url);
  }

  document.addEventListener('submit', onSubmit);

  window.addEventListener('popstate', function () {
    load(window.location.href, null);
  });

  window.history.replaceState({ collectionFacets: true }, '', window.location.href);
}());
