/**
 * AERA — customer accounts (Milestone 7).
 * Two small, independent progressive enhancements:
 *  1. Login/forgot-password panel toggle — both panels render un-hidden
 *     from Liquid (so the page is fully usable with zero JS: submitting
 *     either form always works, and any error/success message is always
 *     visible). This only adds the single-panel-at-a-time UX on top,
 *     landing on whichever panel actually has a live message.
 *  2. Address book: show/hide the add/edit forms, and a delete
 *     confirmation before submitting the native delete form.
 */
(function () {
  'use strict';

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  // ---------- auth panel toggle (login / forgot password) ----------
  var authPanels = qsa('[data-auth-panel]');
  if (authPanels.length) {
    function showAuthPanel(name) {
      authPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-auth-panel') !== name;
      });
    }

    var initialPanel = 'login';
    authPanels.forEach(function (panel) {
      if (panel.querySelector('.form-message')) initialPanel = panel.getAttribute('data-auth-panel');
    });
    showAuthPanel(initialPanel);

    qsa('[data-auth-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        showAuthPanel(button.getAttribute('data-auth-toggle'));
      });
    });
  }

  // ---------- address book: show/hide forms ----------
  qsa('[data-address-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      var targetName = button.getAttribute('data-address-toggle');
      var target = document.querySelector('[data-address-form="' + targetName + '"]');
      if (!target) return;
      target.hidden = !target.hidden;
      if (!target.hidden) {
        var firstField = target.querySelector('input, select');
        if (firstField) firstField.focus();
      }
    });
  });

  // ---------- address book: delete confirmation ----------
  qsa('[data-address-delete]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var message = form.getAttribute('data-confirm-message') || 'Are you sure?';
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    });
  });
})();
