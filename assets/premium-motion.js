/* Progressive enhancement: content stays visible before JS and during loading. */
(function () {
  'use strict';
  var root = document.documentElement;
  if (root.dataset.premiumMotion === 'false' || !window.matchMedia ||
      !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var candidates = '.waypoint-page__intro, .waypoint-page__card, .waypoint-preorder__media, .waypoint-preorder__details, .section-header, .faq-content .accordion, .editorial-card, .trust-bar, .waypoint-gallery .section-header';
  var seen = new WeakSet();
  var active = new Set();
  var pending = new Set();
  function reduced() {
    return preference.matches || root.classList.contains('reduced-motion');
  }
  function play(el, distance, duration) {
    if (reduced() || !el.isConnected) return;
    var animation = el.animate(
      [{ translate: '0 ' + distance + 'px' }, { translate: '0 0' }],
      { duration: duration, easing: 'cubic-bezier(.16,1,.3,1)' }
    );
    var record = { element: el, animation: animation };
    active.add(record);
    function clear() { active.delete(record); }
    animation.onfinish = clear;
    animation.oncancel = clear;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !pending.has(entry.target)) return;
      observer.unobserve(entry.target);
      pending.delete(entry.target);
      play(entry.target, window.innerWidth < 750 ? 8 : 16, 480);
    });
  }, { threshold: .08 });
  function init(scope) {
    if (reduced()) return;
    scope.querySelectorAll(candidates).forEach(function (el) {
      if (seen.has(el) || el.closest('[data-reveal], [data-hero-slider]')) return;
      seen.add(el);
      // Leave the initial viewport, including LCP candidates, completely static.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      pending.add(el);
      observer.observe(el);
    });
  }
  function stop() {
    observer.disconnect();
    pending.clear();
    active.forEach(function (record) { record.animation.cancel(); });
    active.clear();
  }
  init(document);
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
  document.addEventListener('shopify:section:unload', function (event) {
    pending.forEach(function (el) {
      if (event.target.contains(el)) { observer.unobserve(el); pending.delete(el); }
    });
    active.forEach(function (record) {
      if (event.target.contains(record.element)) record.animation.cancel();
    });
  });
  document.addEventListener('toggle', function (event) {
    var details = event.target;
    if (!details.matches || !details.matches('details.accordion') || !details.open) return;
    var content = details.querySelector('.accordion__content');
    if (content) play(content, 5, 200);
  }, true);
  if (preference.addEventListener) {
    preference.addEventListener('change', function () {
      stop();
      seen = new WeakSet();
      if (!reduced()) init(document);
    });
  }
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) { seen = new WeakSet(); init(document); }
  });
})();
