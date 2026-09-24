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
    var slides = slider.querySelectorAll('[data-hero-slide]');
    var dots = slider.querySelectorAll('[data-hero-dot]');
    if (slides.length < 2) return;

    var current = 0;
    var autoplay = slider.getAttribute('data-autoplay') === 'true' && !reducedMotion;
    var interval = parseInt(slider.getAttribute('data-interval'), 10) || 6000;
    var timer = null;

    function loadSlideBackground(slide) {
      // Lazy, one-time: a slide with data-bg-mobile hasn't had its real
      // background set yet. Removing the attributes after use marks it
      // "already loaded" so re-activating the same slide is a no-op.
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

    function show(index) {
      slides[current].removeAttribute('data-active');
      if (dots[current]) dots[current].setAttribute('aria-current', 'false');
      current = (index + slides.length) % slides.length;
      loadSlideBackground(slides[current]);
      slides[current].setAttribute('data-active', 'true');
      if (dots[current]) dots[current].setAttribute('aria-current', 'true');
    }

    function restart() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, interval);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    // Pause on hover/focus so autoplay never fights a reading user.
    slider.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', function () {
      clearInterval(timer);
    });
    slider.addEventListener('focusout', restart);

    restart();
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
