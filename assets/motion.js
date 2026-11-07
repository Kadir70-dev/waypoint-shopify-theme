/**
 * Waypoint — motion system (Milestone 2).
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
    var dotsContainer = slider.querySelector('[data-hero-dots]');
    if (slides.length < 2) return;

    var current = 0;
    var autoplay = slider.getAttribute('data-autoplay') === 'true' && !reducedMotion;
    var interval = parseInt(slider.getAttribute('data-interval'), 10) || 5000;
    var timer = null;
    var paused = false;
    var activated = false;

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
      if (!dotsContainer) return;
      dotsContainer.classList.remove('is-running');
      if (autoplay && activated && !paused && !document.hidden) {
        void dotsContainer.offsetWidth;
        dotsContainer.classList.add('is-running');
      }
    }

    function clearTimer() {
      if (timer) window.clearTimeout(timer);
      timer = null;
      if (dotsContainer) dotsContainer.classList.remove('is-running');
    }

    function schedule() {
      clearTimer();
      resetProgress();
      if (!autoplay || !activated || paused || document.hidden) return;
      timer = window.setTimeout(function () {
        show(current + 1, false, 'next');
        schedule();
      }, interval);
    }

    function show(index, manual, directionOverride) {
      var previous = current;
      var direction = directionOverride || (index < current && !(index === 0 && current === slides.length - 1) ? 'prev' : 'next');
      if (slides[current]) {
        slides[current].removeAttribute('data-active');
        slides[current].setAttribute('data-leaving', 'true');
        slides[current].setAttribute('data-direction', direction);
        slides[current].setAttribute('aria-hidden', 'true');
      }
      if (dots[current]) dots[current].setAttribute('aria-current', 'false');
      current = (index + slides.length) % slides.length;
      loadSlideBackground(slides[current]);
      slides[current].removeAttribute('data-leaving');
      slides[current].setAttribute('data-entering', 'true');
      slides[current].setAttribute('data-direction', direction);
      slides[current].setAttribute('data-active', 'true');
      slides[current].setAttribute('aria-hidden', 'false');
      if (dots[current]) dots[current].setAttribute('aria-current', 'true');
      window.requestAnimationFrame(function () {
        slides[current].removeAttribute('data-entering');
      });
      window.setTimeout(function () {
        slides[previous].removeAttribute('data-leaving');
      }, parseInt(slider.getAttribute('data-transition'), 10) || 600);
      if (manual) activate();
    }

    // Autoplay stays idle until the first genuine user interaction.
    var activationEvents = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'];
    function activate() {
      activationEvents.forEach(function (name) { window.removeEventListener(name, activate); });
      activated = true;
      schedule();
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
    slider.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current - 1, true, 'prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + 1, true, 'next');
      }
    });

    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', restart);
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

    slider.classList.add('is-ready');
    show(0, false);
    // No timer runs at load: slides 2+ stay deferred until the user interacts.
    if (autoplay) {
      activationEvents.forEach(function (name) {
        window.addEventListener(name, activate, { passive: true });
      });
    }
  });

  // ---------- lazy CSS background images ----------
  // Below-the-fold sections set their background-image custom properties via
  // data-lazy-style so the image is only requested as the section nears the viewport.
  var lazyStyleEls = document.querySelectorAll('[data-lazy-style]');
  function applyLazyStyle(el) {
    (el.getAttribute('data-lazy-style') || '').split(';').forEach(function (decl) {
      var i = decl.indexOf(':');
      if (i > 0) el.style.setProperty(decl.slice(0, i).trim(), decl.slice(i + 1).trim());
    });
    el.removeAttribute('data-lazy-style');
  }
  if (lazyStyleEls.length) {
    if ('IntersectionObserver' in window) {
      var lazyIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { applyLazyStyle(entry.target); lazyIo.unobserve(entry.target); }
        });
      }, { rootMargin: '600px 0px' });
      lazyStyleEls.forEach(function (el) { lazyIo.observe(el); });
    } else {
      lazyStyleEls.forEach(applyLazyStyle);
    }
  }

  // ---------- lazy background video ----------
  // The source is only attached when the video nears the viewport; it plays
  // while visible and pauses off-screen. Reduced motion: load the first frame only.
  document.querySelectorAll('video[data-lazy-video]').forEach(function (video) {
    var loaded = false;
    function attach() {
      if (loaded) return;
      loaded = true;
      video.querySelectorAll('source[data-src]').forEach(function (source) {
        source.src = source.getAttribute('data-src');
        source.removeAttribute('data-src');
      });
      video.preload = reducedMotion ? 'metadata' : 'auto';
      video.load();
    }
    if (!('IntersectionObserver' in window)) {
      attach();
      if (!reducedMotion) video.play().catch(function () {});
      return;
    }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          attach();
          if (!reducedMotion && video.dataset.userPaused !== 'true') video.play().catch(function () {});
        } else if (loaded) {
          video.pause();
        }
      });
    }, { rootMargin: '300px 0px' }).observe(video);
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

/* Light/dark toggle: flips data-preset on <html> (tokens.css already defines both
   schemes), remembers the visitor's choice, and keeps the button's label in sync.
   layout/theme.liquid applies the saved choice before first paint. */
(function () {
  'use strict';
  var html = document.documentElement;
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-scheme-toggle]'));
  if (!toggles.length) return;

  function sync() {
    var isLight = html.getAttribute('data-preset') === 'daylight';
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-label', isLight ? btn.getAttribute('data-label-dark') : btn.getAttribute('data-label-light'));
    });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-preset') === 'daylight' ? 'dark' : 'daylight';
      html.setAttribute('data-preset', next);
      try { localStorage.setItem('waypoint-scheme', next); } catch (e) {}
      sync();
    });
  });
  sync();
})();

/* Video section pause/play control (WCAG 2.2.2): a visitor's pause sticks, so the
   in-view observer above won't restart it; under reduced motion the clip starts
   paused on its poster and this button is the only way to play it. */
(function () {
  'use strict';
  var reducedMotion = document.documentElement.classList.contains('reduced-motion');
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var video = btn.parentElement.querySelector('video');
    if (!video) return;
    function setState(paused) {
      btn.setAttribute('data-state', paused ? 'paused' : 'playing');
      btn.setAttribute('aria-label', paused ? btn.getAttribute('data-label-play') : btn.getAttribute('data-label-pause'));
    }
    if (reducedMotion) { video.dataset.userPaused = 'true'; setState(true); }
    // Keep the button honest when the in-view observer pauses/resumes the clip.
    video.addEventListener('pause', function () { setState(true); });
    video.addEventListener('play', function () { setState(false); });
    btn.addEventListener('click', function () {
      if (video.paused) {
        video.dataset.userPaused = 'false';
        var pending = video.querySelectorAll('source[data-src]');
        pending.forEach(function (s) { s.src = s.getAttribute('data-src'); s.removeAttribute('data-src'); });
        if (pending.length) video.load();
        video.play().catch(function () {});
        setState(false);
      } else {
        video.dataset.userPaused = 'true';
        video.pause();
        setState(true);
      }
    });
  });
})();
