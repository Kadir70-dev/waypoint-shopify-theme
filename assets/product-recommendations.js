/**
 * AERA — product recommendations (Milestone 4).
 * Fetches the section from Shopify's native recommendations endpoint
 * (data-url, already carrying product_id/section_id/limit/intent) and
 * swaps in the response — same fetch-and-replace pattern as the PDP
 * buy box's Section Rendering API call. No product list is ever
 * generated client-side; if the fetch fails or returns no matches the
 * element is simply left empty.
 */
(function () {
  'use strict';

  if (customElements.get('product-recommendations')) return;

  customElements.define('product-recommendations', class extends HTMLElement {
    connectedCallback() {
      var url = this.getAttribute('data-url');
      if (!url) return;

      var self = this;
      fetch(url)
        .then(function (response) {
          if (!response.ok) throw new Error('Recommendations fetch failed: ' + response.status);
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var fresh = doc.querySelector('product-recommendations');
          if (fresh && fresh.innerHTML.trim()) self.innerHTML = fresh.innerHTML;
        })
        .catch(function () {
          // Leave the element empty — the section already renders nothing
          // rather than a broken state when recommendations aren't available.
        });
    }
  });
})();
