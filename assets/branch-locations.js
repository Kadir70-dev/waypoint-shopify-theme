/**
 * Waypoint Branch Locations
 * Merchant-supplied pins only; MapTiler hybrid satellite + MapLibre 3D terrain.
 * No geocoding guesses, no fictitious branches, no automatic "open now" claims.
 */
const MAPLIBRE_MODULE = 'https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.mjs';
const instances = new WeakMap();
let maplibrePromise;

function library() {
  if (!maplibrePromise) maplibrePromise = import(MAPLIBRE_MODULE);
  return maplibrePromise;
}
function coordinates(card) {
  const latText = (card.dataset.locationLat || '').trim();
  const lngText = (card.dataset.locationLng || '').trim();
  if (!latText || !lngText || !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(latText) ||
      !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(lngText)) return null;
  const lat = Number(latText), lng = Number(lngText);
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lng, lat] : null;
}
function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function init(root) {
  if (!root || instances.has(root)) return;
  const allCards = Array.from(root.querySelectorAll('[data-location-card]'));
  const records = allCards.map(card => ({
    card,
    id: card.dataset.locationId,
    name: card.querySelector('.waypoint-locations__name')?.textContent.trim() || 'Location',
    type: card.dataset.locationType || 'branch',
    coords: coordinates(card),
    button: card.querySelector('[data-location-select]'),
    marker: null
  }));
  const key = (root.dataset.mapKey || '').trim();
  const mapNode = root.querySelector('[data-location-map]');
  const empty = root.querySelector('[data-map-empty]');
  const status = root.querySelector('[data-location-status]');
  const controls = root.querySelector('[data-locations-controls]');
  const list = root.querySelector('[data-locations-list]');
  const count = root.querySelector('[data-locations-count]');
  const styleButtons = Array.from(root.querySelectorAll('[data-map-style]'));
  const threeDBtn = root.querySelector('[data-map-3d]');
  const allPinsBtn = root.querySelector('[data-map-fit]');
  const valid = records.filter(record => record.coords !== null);
  let map = null;
  let maplibre = null;
  let active = null;
  let mode = root.dataset.initialView === 'streets' ? 'streets' : 'satellite';
  let show3D = root.dataset['3dDefault'] === 'true';
  let currentFilter = 'all';
  let disposed = false;
  let loader = null;
  const disposers = [];

  function listen(el, event, handler) {
    if (!el) return;
    el.addEventListener(event, handler);
    disposers.push(() => el.removeEventListener(event, handler));
  }
  function notify(message) {
    if (status) status.textContent = message;
  }
  function visibleRecords() {
    return records.filter(record => currentFilter === 'all' || record.type === currentFilter);
  }
  function updateCount() {
    if (!count) return;
    const number = visibleRecords().length;
    count.textContent = number + (number === 1 ? ' location' : ' locations');
  }
  function activate(record, fly = true) {
    if (!record) return;
    active = record;
    records.forEach(item => {
      const selected = item === record;
      item.card.classList.toggle('is-active', selected);
      item.button?.setAttribute('aria-pressed', String(selected));
      item.marker?.getElement().classList.toggle('is-active', selected);
    });
    if (map && record.coords && fly) {
      const pitch = show3D && !reducedMotion() ? 58 : 0;
      map.flyTo({
        center: record.coords, zoom: 15.1, pitch,
        bearing: pitch ? -18 : 0, essential: true,
        animate: !reducedMotion(), duration: 900
      });
    }
    if (!record.coords && !map) {
      notify('Coordinates not yet supplied for ' + record.name + '. Check its verified address.');
    }
  }
  function fitAll() {
    if (!map || !maplibre) return;
    const visible = visibleRecords().filter(record => record.coords);
    if (!visible.length) return;
    if (visible.length === 1) {
      activate(visible[0]);
      return;
    }
    const bounds = new maplibre.LngLatBounds();
    visible.forEach(record => bounds.extend(record.coords));
    map.fitBounds(bounds, {
      padding: {top: 90, bottom: 90, left: 55, right: 55},
      maxZoom: 13.6,
      duration: reducedMotion() ? 0 : 850,
      pitch: show3D && !reducedMotion() ? 48 : 0,
      bearing: 0
    });
  }
  function setFilter(next) {
    currentFilter = next;
    const filterButtons = root.querySelectorAll('[data-location-filter]');
    filterButtons.forEach(button => {
      const selected = button.dataset.locationFilter === next;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    records.forEach(record => {
      const show = next === 'all' || record.type === next;
      record.card.hidden = !show;
      if (record.marker) record.marker.getElement().hidden = !show;
    });
    updateCount();
    if (!active || active.card.hidden) activate(visibleRecords()[0] || null, false);
    if (map) fitAll();
  }
  function styleUrl(next) {
    const id = next === 'streets' ? 'streets-v4' : 'hybrid-v4';
    return 'https://api.maptiler.com/maps/' + id + '/style.json?key=' + encodeURIComponent(key);
  }
  function apply3D() {
    if (!map || !map.isStyleLoaded()) return;
    // Terrain may be unavailable for a particular region or API plan.
    try {
      if (show3D) {
        if (!map.getSource('waypoint-terrain')) {
          map.addSource('waypoint-terrain', {
            type: 'raster-dem',
            url: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=' + encodeURIComponent(key),
            tileSize: 256
          });
        }
        map.setTerrain({source: 'waypoint-terrain', exaggeration: 1});
      } else if (map.getTerrain()) {
        map.setTerrain(null);
      }
    } catch (error) {
      console.warn('Waypoint: terrain layer unavailable; keeping map usable.', error);
    }

    // Where the selected vector style contains building footprints and heights,
    // show schematic 3D buildings. This is NOT photorealistic city imagery.
    try {
      const id = 'waypoint-3d-buildings';
      if (!show3D && map.getLayer(id)) map.removeLayer(id);
      if (show3D && !map.getLayer(id)) {
        const layers = map.getStyle()?.layers || [];
        const building = layers.find(layer => layer['source-layer'] === 'building' && layer.source);
        const firstLabel = layers.find(layer => layer.type === 'symbol' && layer.layout?.['text-field']);
        if (building && map.getSource(building.source)) {
          map.addLayer({
            id,
            type: 'fill-extrusion',
            source: building.source,
            'source-layer': 'building',
            minzoom: 14,
            paint: {
              'fill-extrusion-color': '#c7b499',
              'fill-extrusion-opacity': 0.75,
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 0],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0]
            }
          }, firstLabel?.id);
        }
      }
    } catch (error) {
      console.warn('Waypoint: 3D building overlays unavailable; keeping base map.', error);
    }
    map.easeTo({
      pitch: show3D && !reducedMotion() ? 58 : 0,
      bearing: show3D && !reducedMotion() ? -18 : 0,
      duration: reducedMotion() ? 0 : 500
    });
  }
  function updateButtons() {
    styleButtons.forEach(button => {
      const on = button.dataset.mapStyle === mode;
      button.classList.toggle('is-active', on);
      button.setAttribute('aria-pressed', String(on));
    });
    if (threeDBtn) {
      threeDBtn.classList.toggle('is-active', show3D);
      threeDBtn.setAttribute('aria-pressed', String(show3D));
    }
  }

  records.forEach(record => listen(record.button, 'click', () => {
    activate(record);
    if (map) {
      record.card.scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth', block: 'nearest'});
    }
  }));
  const types = new Set(records.map(record => record.type));
  root.querySelectorAll('[data-location-filter]').forEach(button => {
    const type = button.dataset.locationFilter;
    if (type !== 'all') button.hidden = !types.has(type);
    listen(button, 'click', () => setFilter(type));
  });
  styleButtons.forEach(button => listen(button, 'click', () => {
    if (!map) return;
    mode = button.dataset.mapStyle === 'streets' ? 'streets' : 'satellite';
    updateButtons();
    map.setStyle(styleUrl(mode));
  }));
  listen(threeDBtn, 'click', () => {
    if (!map) return;
    show3D = !show3D;
    updateButtons();
    apply3D();
  });
  listen(allPinsBtn, 'click', fitAll);
  setFilter('all');
  if (records.length) activate(valid[0] || records[0], false);
  updateButtons();

  async function build() {
    if (disposed || !mapNode || !key || !valid.length || map) return;
    notify('Loading satellite imagery and exact branch locations…');
    try {
      maplibre = await library();
      if (disposed || !root.isConnected) return;
      if (!maplibre.supported()) throw new Error('This browser does not support WebGL maps.');
      map = new maplibre.Map({
        container: mapNode,
        style: styleUrl(mode),
        center: valid[0].coords,
        zoom: 10,
        pitch: show3D && !reducedMotion() ? 55 : 0,
        bearing: show3D && !reducedMotion() ? -18 : 0,
        maxPitch: 80,
        attributionControl: true,
        cooperativeGestures: true,
        antialias: true
      });
      map.addControl(new maplibre.NavigationControl({showCompass: true, visualizePitch: true}), 'bottom-right');
      map.on('style.load', () => {
        if (disposed) return;
        apply3D();
      });
      map.on('load', () => {
        if (disposed) return;
        valid.forEach(record => {
          const el = document.createElement('button');
          el.type = 'button';
          el.className = 'waypoint-locations__pin';
          el.setAttribute('aria-label', 'View ' + record.name + ' on the map');
          el.title = record.name;
          el.addEventListener('click', () => {
            activate(record);
            record.card.scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth', block: 'nearest'});
          });
          record.marker = new maplibre.Marker({element: el, anchor: 'bottom'}).setLngLat(record.coords).addTo(map);
        });
        if (empty) empty.hidden = true;
        if (controls) controls.hidden = false;
        if (active) activate(active, false);
        fitAll();
        map.resize();
      });
      map.on('error', event => {
        if (!map.loaded() && !disposed) {
          notify('Map imagery could not load. Check your MapTiler key, allowed domain and internet connection. Branch addresses remain available on the left.');
        }
        if (event?.error) console.warn('Waypoint map provider error', event.error);
      });
    } catch (error) {
      notify('Interactive map unavailable. Check the public MapTiler key, domain restrictions, and browser WebGL support.');
      console.warn('Waypoint map initialization failed', error);
    }
  }
  if (key && valid.length) {
    if ('IntersectionObserver' in window) {
      loader = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          loader.disconnect();
          loader = null;
          build();
        }
      }, {rootMargin: '280px'});
      loader.observe(root);
    } else {
      build();
    }
  }
  function destroy() {
    disposed = true;
    loader?.disconnect();
    disposers.forEach(fn => fn());
    records.forEach(record => record.marker?.remove());
    map?.remove();
    instances.delete(root);
  }
  instances.set(root, {destroy});
}
function mount(scope = document) {
  if (scope.matches?.('[data-waypoint-locations]')) init(scope);
  scope.querySelectorAll?.('[data-waypoint-locations]').forEach(init);
}
function unmount(scope) {
  if (scope.matches?.('[data-waypoint-locations]')) instances.get(scope)?.destroy();
  scope.querySelectorAll?.('[data-waypoint-locations]').forEach(root => instances.get(root)?.destroy());
}
mount();
document.addEventListener('shopify:section:load', event => mount(event.target));
document.addEventListener('shopify:section:unload', event => unmount(event.target));
