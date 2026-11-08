/* Native scrolling remains usable without JavaScript. */
(() => {
  if (customElements.get('waypoint-gallery')) return;
  customElements.define('waypoint-gallery', class extends HTMLElement {
    connectedCallback() {
      this.abort = new AbortController();
      const signal = this.abort.signal;
      this.track = this.querySelector('.waypoint-gallery__track');
      this.slides = [...this.querySelectorAll('.waypoint-gallery__slide')];
      if (!this.slides.length) { if (!window.Shopify?.designMode) this.hidden = true; return; }
      this.index = 0;
      this.preference = matchMedia('(prefers-reduced-motion: reduce)');
      this.stopped = this.dataset.autoplay !== 'true' || this.preference.matches || document.documentElement.dataset.premiumMotion === 'false' || !!window.Shopify?.designMode;
      const controls = this.querySelector('.waypoint-gallery__controls');
      if (controls) controls.hidden = this.slides.length < 2;
      this.pause = this.querySelector('[data-pause]');
      this.pause.hidden = this.stopped || this.slides.length < 2;
      const stop = () => { this.stopped = true; clearInterval(this.timer); this.pause.setAttribute('aria-pressed', 'true'); };
      this.querySelector('[data-prev]').addEventListener('click', () => { stop(); this.move(-1); }, {signal});
      this.querySelector('[data-next]').addEventListener('click', () => { stop(); this.move(1); }, {signal});
      this.pause.addEventListener('click', stop, {signal});
      this.addEventListener('focusin', stop, {signal});
      this.addEventListener('pointerdown', stop, {signal});
      this.addEventListener('pointerenter', stop, {signal});
      this.preference.addEventListener('change', stop, {signal});
      this.track.addEventListener('keydown', e => {
        if (e.target !== this.track || !['ArrowLeft','ArrowRight'].includes(e.key)) return;
        e.preventDefault(); stop();
        const rtl = getComputedStyle(this).direction === 'rtl';
        this.move((e.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1));
      }, {signal});
      this.track.addEventListener('scroll', () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => {
          const box = this.track.getBoundingClientRect();
          const center = (box.left + box.right) / 2;
          let distance = Infinity;
          this.slides.forEach((slide, i) => {
            const rect = slide.getBoundingClientRect();
            const d = Math.abs((rect.left + rect.right) / 2 - center);
            if (d < distance) { distance = d; this.index = i; }
          });
          this.update();
        });
      }, {signal, passive:true});
      this.update();
      if (!this.stopped && this.slides.length > 1) this.timer = setInterval(() => {
        const box = this.getBoundingClientRect();
        if (!this.stopped && !document.hidden && box.top < innerHeight && box.bottom > 0 && !this.contains(document.activeElement)) this.move(1);
      }, Math.max(5000, Number(this.dataset.interval) || 7000));
    }
    update() { this.querySelector('[data-count]').textContent = `${this.index + 1} / ${this.slides.length}`; }
    move(step) {
      this.index = (this.index + step + this.slides.length) % this.slides.length;
      const slide = this.slides[this.index].getBoundingClientRect();
      const track = this.track.getBoundingClientRect();
      this.track.scrollBy({left:(slide.left + slide.right - track.left - track.right)/2, behavior:this.preference.matches || document.documentElement.dataset.premiumMotion === 'false' ? 'instant' : 'smooth'});
      this.update();
    }
    disconnectedCallback() { this.abort?.abort(); clearInterval(this.timer); cancelAnimationFrame(this.frame); }
  });
})();
