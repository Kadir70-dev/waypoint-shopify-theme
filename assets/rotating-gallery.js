/* Marquee animation is CSS-driven. JavaScript pauses it when not visible,
   in the Shopify editor, or when the user requests less motion. */
(() => {
  if (customElements.get('waypoint-gallery')) return;
  customElements.define('waypoint-gallery', class extends HTMLElement {
    connectedCallback() {
      if (this.dataset.marquee !== 'true') return;
      this.controller = new AbortController();
      const signal = this.controller.signal;
      const preference = matchMedia('(prefers-reduced-motion: reduce)');
      const button = this.querySelector('[data-marquee-toggle]');
      const icon = this.querySelector('[data-marquee-icon]');
      const isEditor = !!window.Shopify?.designMode;
      let visible = !('IntersectionObserver' in window);
      let userPaused = false;

      const update = () => {
        const disabled = preference.matches ||
          document.documentElement.classList.contains('reduced-motion') ||
          document.documentElement.dataset.premiumMotion === 'false' || isEditor;
        const available = this.dataset.autoplay === 'true' &&
          Number(this.dataset.imageCount) > 1 && !disabled;
        this.dataset.playing = available && visible && !userPaused && !document.hidden ? 'true' : 'false';
        if (button) {
          button.hidden = !available;
          button.setAttribute('aria-pressed', String(userPaused));
          button.setAttribute('aria-label', userPaused ? 'Resume moving gallery' : 'Pause moving gallery');
        }
        if (icon) icon.textContent = userPaused ? '▶' : 'Ⅱ';
      };

      if (button) button.addEventListener('click', () => {
        userPaused = !userPaused;
        update();
      }, { signal });
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(entries => {
          visible = !!entries[0]?.isIntersecting;
          update();
        });
        this.observer.observe(this);
      }
      document.addEventListener('visibilitychange', update, { signal });
      preference.addEventListener('change', update, { signal });
      update();
    }
    disconnectedCallback() {
      this.controller?.abort();
      this.observer?.disconnect();
    }
  });
})();
