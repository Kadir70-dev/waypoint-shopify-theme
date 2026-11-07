/**
 * Waypoint — size chart dialog (Module 12).
 * Delegated from [data-product-buybox], which variant-picker.js replaces
 * by innerHTML (never itself removed), so this survives every variant
 * re-fetch with no rebinding needed — same pattern as quick-add's own
 * dialog handling.
 */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-size-chart-trigger]');
    if (trigger) {
      var dialog = document.getElementById(trigger.getAttribute('aria-controls'));
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        var closeBtn = dialog.querySelector('[data-size-chart-close]');
        if (closeBtn) closeBtn.focus();
      }
      return;
    }

    var closeBtn = e.target.closest('[data-size-chart-close]');
    if (closeBtn) {
      var dialogToClose = closeBtn.closest('[data-size-chart-dialog]');
      if (dialogToClose) dialogToClose.close();
      return;
    }

    var backdropDialog = e.target.closest('[data-size-chart-dialog]');
    if (backdropDialog && e.target === backdropDialog) backdropDialog.close();
  });
}());
