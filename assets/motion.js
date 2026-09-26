/**
 * AERA — motion system (Milestone 2).
 * Scroll reveals, the hero slider, and a small carousel prev/next helper.
 * Timing/easing come from tokens.css custom properties, never hardcoded
 * here, so .reduced-motion (set in layout/theme.liquid) corrects every
 * component from one place. See Motion Implementation Plan.
 */
(function () {
  'use strict';

  var reducedMotion = document.documentElement.classList.contains('reduced-motion');

  // ---------- header scroll state (transparent overlay + plain sticky) ----------
  // Mutually exclusive in Liquid (header_transparent forces is_sticky=false),
  // so one header element only ever matches one of these two selectors.
  var scrollHeader = document.querySelector('.site-header--transparent, .site-header[data-sticky="true"]');
  if (scrollHeader) {
    var setHeaderScrolled = function () {
      scrollHeader.setAttribute('data-scrolled', window.scrollY > 10 ? 'true' : 'false');
    };
    setHeaderScrolled();
    window.addEventListener('scroll', setHeaderScrolled, { passive: true });
  }

  // ---------- scroll reveal ----------
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

      revealEls.forEach(function (el) {
        var group = el.closest('[data-reveal-group]');
        var indexInGroup = 0;
        if (group) {
          indexInGroup = Array.prototype.indexOf.call(group.querySelectorAll('[data-reveal]'), el);
        }
        el.style.transitionDelay = Math.min(indexInGroup, 6) * 70 + 'ms';
        io.observe(el);
      });
    } else {
      // No IntersectionObserver support: show everything immediately
      // rather than leaving it in the .js pre-reveal state forever.
      revealEls.forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  }

  // ---------- hero slider ----------
  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var progress = slider.querySelector('[data-hero-progress]');
    if (slides.length < 2) return;

    var current = 0;
    var autoplay = slider.getAttribute('data-autoplay') === 'true' && !reducedMotion;
    var interval = parseInt(slider.getAttribute('data-interval'), 10) || 5000;
    var timer = null;
    var paused = false;

    function loadSlideBackground(slide) {
      var mobileUrl = slide.getAttribute('data-bg-mobile');
      if (!mobileUrl) return;
      slide.style.setProperty('--bg-mobile', 'url(' + mobileUrl + ')');
      slide.style.setProperty('--bg-desktop', 'url(' + (slide.getAttribute('data-bg-desktop') || mobileUrl) + ')');
      var bgPosition = slide.getAttribute('data-bg-position');
      if (bgPosition) slide.style.setProperty('--bg-position', bgPosition);
      slide.removeAttribute('data-bg-mobile');
      slide.removeAttribute('data-bg-desktop');
      slide.removeAttribute('data-bg-position');
    }

    function resetProgress() {
      if (!progress) return;
      progress.classList.remove('is-running');
      if (autoplay && !paused && !document.hidden) {
        void progress.offsetWidth;
        progress.classList.add('is-running');
      }
    }

    function clearTimer() {
      if (timer) window.clearTimeout(timer);
      timer = null;
      if (progress) progress.classList.remove('is-running');
    }

    function schedule() {
      clearTimer();
      resetProgress();
      if (!autoplay || paused || document.hidden) return;
      timer = window.setTimeout(function () {
        show(current + 1, false);
        schedule();
      }, interval);
    }

    function show(index, manual) {
      if (slides[current]) {
        slides[current].removeAttribute('data-active');
        slides[current].setAttribute('aria-hidden', 'true');
      }
      if (dots[current]) dots[current].setAttribute('aria-current', 'false');
      current = (index + slides.length) % slides.length;
      loadSlideBackground(slides[current]);
      slides[current].setAttribute('data-active', 'true');
      slides[current].setAttribute('aria-hidden', 'false');
      if (dots[current]) dots[current].setAttribute('aria-current', 'true');
      if (manual) schedule();
    }

    function pause() {
      paused = true;
      clearTimer();
    }

    function restart() {
      paused = false;
      schedule();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i, true); });
    });
    if (prev) prev.addEventListener('click', function () { show(current - 1, true); });
    if (next) next.addEventListener('click', function () { show(current + 1, true); });

    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', function (event) {
      if (!slider.contains(event.relatedTarget)) restart();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause();
      else restart();
    });
    document.addEventListener('shopify:block:select', function (event) {
      var selected = event.target && event.target.closest ? event.target.closest('[data-hero-slide]') : null;
      var index = selected ? slides.indexOf(selected) : -1;
      if (index >= 0) { pause(); show(index, false); }
    });
    document.addEventListener('shopify:block:deselect', function () { restart(); });

    show(0, false);
    schedule();
  });

  // ---------- carousel prev/next (testimonials, later: cross-sell rows) ----------
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    if (!track) return;

    function scrollByCard(dir) {
      var card = track.querySelector('[data-carousel-item]');
      var amount = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
      track.scrollBy({ left: amount * dir, behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { scrollByCard(-1); });
    if (next) next.addEventListener('click', function () { scrollByCard(1); });
  });
})();
