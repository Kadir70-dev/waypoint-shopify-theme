/**
 * AERA — shared overlay controller.
 * Powers the mobile nav panel and the search overlay shell in Milestone 1.
 * The cart drawer, mobile filter drawer, and quick-view (later milestones)
 * reuse this same class instead of each hand-rolling open/close/focus-trap
 * logic — see Mobile Navigation / Filter Architecture in the OS 2.0 spec.
 */
(function () {
  'use strict';

  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Reference-counted so two trapped overlays opening in quick succession
  // (e.g. add-to-cart opens the cart drawer while the mobile nav is still
  // open) don't have the second close() un-inert the page too early.
  var trappedOpenCount = 0;
  function setBackgroundInert(inert) {
    trappedOpenCount += inert ? 1 : -1;
    var shouldBeInert = trappedOpenCount > 0;
    ['#MainContent', '.site-footer'].forEach(function (selector) {
      var el = document.querySelector(selector);
      if (!el) return;
      if (shouldBeInert) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });
  }

  function AeraOverlay(el, options) {
    options = options || {};
    this.el = el;
    // trap = true: dialog-like (mobile nav, search, cart drawer).
    // trap = false: disclosure (mega-menu) — Tab is allowed to leave it.
    this.trap = options.trap !== false;
    this.trigger = null;
    this._generation = 0;
    this._onKeydown = this._onKeydown.bind(this);
    this._onBackdropClick = this._onBackdropClick.bind(this);
  }

  AeraOverlay.prototype.isOpen = function () {
    return this.el.getAttribute('data-state') === 'open';
  };

  AeraOverlay.prototype.open = function (trigger) {
    if (this.isOpen()) return;
    this._generation++;
    this.trigger = trigger || document.activeElement;
    this.el.hidden = false;
    this.el.getBoundingClientRect(); // flush layout so the transition runs
    this.el.setAttribute('data-state', 'open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (this.trap) setBackgroundInert(true);

    document.addEventListener('keydown', this._onKeydown, true);
    this.el.addEventListener('click', this._onBackdropClick);

    var focusTarget =
      this.el.querySelector('[data-overlay-autofocus]') || this.el.querySelector(FOCUSABLE);
    if (focusTarget) focusTarget.focus();

    this.el.dispatchEvent(new CustomEvent('overlay:open'));
  };

  AeraOverlay.prototype.close = function () {
    if (!this.isOpen()) return;
    this._generation++;
    var generation = this._generation;
    this.el.setAttribute('data-state', 'closing');
    if (this.trap) setBackgroundInert(false);

    document.removeEventListener('keydown', this._onKeydown, true);
    this.el.removeEventListener('click', this._onBackdropClick);

    var reducedMotion = document.documentElement.classList.contains('reduced-motion');
    var finish = function () {
      // A rapid reopen (or another close()) since this close() started
      // bumps _generation — a stale transitionend/timeout must not force
      // the overlay shut again out from under that newer state.
      if (generation !== this._generation) return;
      this.el.setAttribute('data-state', 'closed');
      this.el.hidden = true;
      if (this.trigger) {
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.focus();
      }
      this.el.dispatchEvent(new CustomEvent('overlay:close'));
    }.bind(this);

    if (reducedMotion) {
      finish();
      return;
    }

    var done = false;
    var onEnd = function (e) {
      if (e.target !== this.el || done) return;
      done = true;
      this.el.removeEventListener('transitionend', onEnd);
      finish();
    }.bind(this);
    this.el.addEventListener('transitionend', onEnd);
    setTimeout(function () {
      if (!done) {
        done = true;
        finish();
      }
    }, 400);
  };

  AeraOverlay.prototype._onKeydown = function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key !== 'Tab' || !this.trap) return;

    var focusable = Array.prototype.slice
      .call(this.el.querySelectorAll(FOCUSABLE))
      .filter(function (node) {
        return node.offsetParent !== null;
      });
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  AeraOverlay.prototype._onBackdropClick = function (e) {
    if (e.target.hasAttribute('data-overlay-backdrop') || e.target.closest('[data-overlay-close]')) {
      this.close();
    }
  };

  window.AeraOverlay = AeraOverlay;

  // Generic wiring: any [data-overlay] element becomes a controlled overlay;
  // any [data-overlay-trigger="<that id>"] toggles it. One shared init path
  // for every call site (mobile nav, search now; cart/filter/quick-view later).
  document.addEventListener('DOMContentLoaded', function () {
    window.AeraOverlays = window.AeraOverlays || {};

    document.querySelectorAll('[data-overlay]').forEach(function (el) {
      var id = el.id;
      if (!id) return;
      var trap = el.getAttribute('data-overlay-trap') !== 'false';
      var instance = new AeraOverlay(el, { trap: trap });
      window.AeraOverlays[id] = instance;

      document.querySelectorAll('[data-overlay-trigger="' + id + '"]').forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', function () {
          if (instance.isOpen()) {
            instance.close();
          } else {
            instance.open(trigger);
          }
        });
      });
    });
  });
})();
