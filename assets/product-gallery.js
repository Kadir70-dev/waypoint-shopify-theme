/**
 * AERA — PDP media gallery (Milestone 11 / Module 06).
 * Native scroll-snap swipe gallery + synced thumbnails + a dependency-free
 * zoom dialog. No Swiper, no PhotoSwipe — IntersectionObserver keeps the
 * thumbnail rail in sync while the visitor swipes/scrolls the main strip;
 * variant-driven media switching (variant-picker.js's setActiveMedia)
 * already scrolls the target slide into view, so this file only owns the
 * reverse direction (manual scroll -> thumb highlight) plus the zoom UI.
 */
(function () {
  'use strict';

  document.querySelectorAll('[data-product-gallery]').forEach(function (gallery) {
    var scroller = gallery.querySelector('[data-gallery-scroller]');
    var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-main-item]'));
    if (!scroller || items.length < 2) return;

    // ---- swipe -> thumbnail sync ----
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
          var mediaId = entry.target.getAttribute('data-media-id');
          gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
            var active = String(thumb.getAttribute('data-media-id')) === String(mediaId);
            thumb.classList.toggle('is-active', active);
            thumb.setAttribute('aria-selected', String(active));
          });
        });
      },
      { root: scroller, threshold: [0.6] }
    );
    items.forEach(function (item) { observer.observe(item); });
  });

  // ---- zoom dialog ----
  document.querySelectorAll('[data-gallery-zoom-dialog]').forEach(function (dialog) {
    var stage = dialog.querySelector('[data-gallery-zoom-stage]');
    var images = Array.prototype.slice.call(dialog.querySelectorAll('[data-gallery-zoom-image]'));
    if (!stage || images.length === 0) return;

    var currentIndex = 0;

    function show(index) {
      currentIndex = (index + images.length) % images.length;
      images.forEach(function (img, i) {
        img.hidden = i !== currentIndex;
        img.classList.remove('is-zoomed');
        img.style.transformOrigin = '';
      });
    }

    function openAt(mediaId) {
      var index = images.findIndex(function (img) { return String(img.getAttribute('data-media-id')) === String(mediaId); });
      show(index === -1 ? 0 : index);
      if (typeof dialog.showModal === 'function') dialog.showModal();
    }

    document.querySelectorAll('[data-gallery-zoom-trigger]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openAt(trigger.getAttribute('data-media-id'));
      });
    });

    var closeBtn = dialog.querySelector('[data-gallery-zoom-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });

    var prevBtn = dialog.querySelector('[data-gallery-zoom-prev]');
    var nextBtn = dialog.querySelector('[data-gallery-zoom-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

    // click backdrop to close (native <dialog> only auto-closes on Escape)
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function () {
      images.forEach(function (img) { img.classList.remove('is-zoomed'); });
    });

    // click/tap image to toggle a simple 2x zoom centered on the click point
    stage.addEventListener('click', function (e) {
      var img = e.target.closest('[data-gallery-zoom-image]');
      if (!img) return;
      var wasZoomed = img.classList.contains('is-zoomed');
      if (!wasZoomed) {
        var rect = img.getBoundingClientRect();
        var originX = ((e.clientX - rect.left) / rect.width) * 100;
        var originY = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = originX + '% ' + originY + '%';
      }
      img.classList.toggle('is-zoomed', !wasZoomed);
    });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  });
}());
