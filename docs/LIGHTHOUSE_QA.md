# Lighthouse QA (not yet run on the real theme — no scores recorded)

`lighthouse` is installed locally (`~/.nvm/versions/node/v20.19.4/bin/lighthouse`). Run against the dev-store preview URL for **home**, **collection**, **PDP**, mobile and desktop; record the real numbers here.

```
lighthouse "<preview-url>" --preset=perf --form-factor=mobile --output=json --output-path=./lh-home.json
```

Targets: no severe CLS (<0.1); LCP image not lazy-loaded and not oversized; no unnecessary render-blocking assets; no oversized/undescribed images (`sizes`/`widths`); reasonable JS execution time; no third-party requests.

Static findings so far: all scripts are `defer`; `account.js` loads only on customer templates; hero first slide loads eagerly; remaining global scripts (`product-gallery`, `size-chart`, `variant-picker`, `product-recommendations`, `collection-facets`) load on every page and could be gated by template once Quick Add dependencies are confirmed; several sections ship inline `<style>` blocks (e.g. `latest-releases-editorial`, `main-product`) that could move to asset CSS.
