/**
 * AERA — mobile navigation drill-down.
 * Two sibling panels swap via a data attribute (see Motion System
 * Implementation Plan) rather than routing. Open/close/focus-trap is
 * handled entirely by overlay.js; this file only owns which panel shows.
 */
(function () {
  'use strict';

  var nav = document.getElementById('MobileNav');
  if (!nav) return;

  var panels = nav.querySelectorAll('[data-nav-panel]');
  var drillButtons = nav.querySelectorAll('[data-nav-drill]');

  function showPanel(name) {
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-nav-panel') !== name;
    });
    drillButtons.forEach(function (button) {
      button.setAttribute('aria-expanded', String(button.getAttribute('data-nav-drill') === name));
    });
    var target = nav.querySelector('[data-nav-panel="' + name + '"]');
    if (!target) return;
    var focusEl = target.querySelector('[data-overlay-autofocus]') || target.querySelector('a, button');
    if (focusEl) focusEl.focus();
  }

  nav.addEventListener('click', function (e) {
    var drill = e.target.closest('[data-nav-drill]');
    if (drill) {
      showPanel(drill.getAttribute('data-nav-drill'));
      return;
    }
    if (e.target.closest('[data-nav-back]')) {
      showPanel('root');
    }
  });

  // Always re-open on the top-level panel, never mid-drill-down.
  document.addEventListener('DOMContentLoaded', function () {
    var overlay = window.AeraOverlays && window.AeraOverlays.MobileNav;
    if (!overlay) return;
    var open = overlay.open.bind(overlay);
    overlay.open = function (trigger) {
      showPanel('root');
      open(trigger);
    };
  });
})();
