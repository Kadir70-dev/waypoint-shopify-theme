/**
 * Waypoint — predictive search (Milestone 3).
 * Fetches Shopify's native Predictive Search API via the Section Rendering
 * API (?section_id=predictive-search) so results are rendered by Liquid —
 * this file only fetches, swaps HTML, and manages state. It never renders
 * markup itself, so results can't drift from the rest of the site's visual
 * language, and no custom search index is built. See
 * sections/predictive-search.liquid + snippets/predictive-search-results.liquid.
 */
(function () {
  'use strict';

  var DEBOUNCE_MS = 180;
  var MIN_CHARS = 2;

  document.querySelectorAll('[data-predictive-search-input]').forEach(function (input) {
    var overlay = input.closest('[data-overlay]');
    if (!overlay) return;

    var prompt = overlay.querySelector('[data-predictive-search-prompt]');
    var target = overlay.querySelector('[data-predictive-search-target]');
    if (!target) return;

    var debounceTimer = null;
    var activeController = null;
    var lastQuery = null;

    function setResultsVisible(showResults) {
      if (prompt) prompt.hidden = showResults;
      target.hidden = !showResults;
    }

    function focusableResults() {
      return Array.prototype.slice.call(target.querySelectorAll('a'));
    }

    function runSearch(term) {
      if (activeController) activeController.abort();
      activeController = ('AbortController' in window) ? new AbortController() : null;

      var url = '/search/suggest?q=' + encodeURIComponent(term) +
        '&resources[type]=product,collection,article&resources[limit]=4' +
        '&section_id=predictive-search';

      target.setAttribute('aria-busy', 'true');

      fetch(url, activeController ? { signal: activeController.signal } : {})
        .then(function (response) {
          if (!response.ok) throw new Error('Predictive search request failed: ' + response.status);
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var results = doc.getElementById('predictive-search-results');
          target.innerHTML = results ? results.innerHTML : '';
          target.removeAttribute('aria-busy');
          setResultsVisible(true);
        })
        .catch(function (error) {
          if (error.name === 'AbortError') return;
          // Network/API failure: fail back to the prompt state rather than
          // leaving a stale or broken results panel showing.
          target.removeAttribute('aria-busy');
          target.innerHTML = '';
          setResultsVisible(false);
        });
    }

    input.addEventListener('input', function () {
      var term = input.value.trim();
      clearTimeout(debounceTimer);

      if (term.length < MIN_CHARS) {
        if (activeController) activeController.abort();
        setResultsVisible(false);
        lastQuery = null;
        return;
      }

      debounceTimer = setTimeout(function () {
        if (term === lastQuery) return;
        lastQuery = term;
        runSearch(term);
      }, DEBOUNCE_MS);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown') return;
      var first = focusableResults()[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    });

    target.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var items = focusableResults();
      var index = items.indexOf(document.activeElement);
      e.preventDefault();
      if (e.key === 'ArrowDown') {
        var next = items[index + 1];
        if (next) next.focus();
      } else if (index <= 0) {
        input.focus();
      } else {
        items[index - 1].focus();
      }
    });

    // Reset to the prompt state on reopen so a stale query/result set from
    // last time never flashes before the user has typed anything new.
    overlay.addEventListener('overlay:open', function () {
      input.value = '';
      target.innerHTML = '';
      setResultsVisible(false);
      lastQuery = null;
    });
  });
})();
