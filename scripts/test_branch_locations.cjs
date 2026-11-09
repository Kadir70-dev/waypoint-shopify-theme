// Offline tests for the Shopify branch-location map module.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const filename = path.join(__dirname, '..', 'assets', 'branch-locations.js');
const source = fs.readFileSync(filename, 'utf8');
const fakeDocument = {
  matches: () => false,
  querySelectorAll: () => [],
  addEventListener: () => {},
};
const context = vm.createContext({ document: fakeDocument, window: {}, console, WeakMap, Set });
vm.runInContext(source, context, { filename, timeout: 1500 });
const coord = data => Array.from(vm.runInContext('coordinates', context)({ dataset: data }) || []);
const cases = [
  [{ locationLat: '25.2048', locationLng: '55.2708' }, [55.2708, 25.2048]],
  [{ locationLat: '0', locationLng: '0' }, [0, 0]],
  [{ locationLat: '-90', locationLng: '180' }, [180, -90]],
  [{ locationLat: '90.0001', locationLng: '0' }, []],
  [{ locationLat: '0', locationLng: '-180.001' }, []],
  [{ locationLat: '', locationLng: '0' }, []],
  [{ locationLat: '25.2north', locationLng: '55' }, []],
  [{ locationLat: 'NaN', locationLng: '55' }, []],
  [{ locationLat: '25', locationLng: '55;alert(1)' }, []],
];
cases.forEach(([dataset, expected], i) => {
  assert.deepEqual(coord(dataset), expected, 'coordinate case ' + i);
});
assert(source.includes("'hybrid-v4'"), 'Satellite uses the supported hybrid style identifier');
assert(source.includes("'streets-v4'"), 'Street map style is available');
assert(source.includes('if (!root || instances.has(root)) return'), 'Shopify section re-init is idempotent');
assert(source.includes('function destroy()'), 'Shopify editor cleanup exists');
console.log('PASS: 9 coordinate cases + 4 map implementation invariants.');


// Browser-lite interaction checks: filter selection and safe directions fallback.
function fakeEl(properties = {}) {
  const handlers = {};
  const classes = new Set();
  const attributes = new Map();
  return Object.assign({
    hidden: false,
    dataset: {},
    textContent: '',
    classList: {
      add: key => classes.add(key),
      remove: key => classes.delete(key),
      toggle: (key, flag) => flag ? classes.add(key) : classes.delete(key),
      contains: key => classes.has(key),
    },
    setAttribute: (key, value) => attributes.set(key, value),
    getAttribute: key => attributes.get(key),
    hasAttribute: key => attributes.has(key),
    addEventListener: (name, fn) => { handlers[name] = fn; },
    removeEventListener: name => { delete handlers[name]; },
    fire: name => handlers[name]?.(),
    scrollIntoView: () => {},
  }, properties);
}
function card(id, type, lat, lng, address) {
  const name = fakeEl({textContent: id});
  const select = fakeEl();
  const directions = fakeEl();
  if (address) {
    directions.href = 'https://www.google.com/maps/search/?api=1&query=' + address;
    directions.setAttribute('href', directions.href);
  }
  const obj = fakeEl({
    dataset: {locationId:id,locationType:type,locationLat:lat,locationLng:lng},
    querySelector: selector => ({
      '.waypoint-locations__name': name,
      '[data-location-select]': select,
      '[data-location-directions]': directions,
    })[selector] || null,
  });
  return {obj,select,directions};
}
const a = card('Valid office','office','25.2','55.27','valid-address');
const b = card('Invalid branch','branch','bad','55','safe-address');
const c = card('Second branch','branch','24.4','54.3','another-address');
const allFilter = fakeEl({dataset:{locationFilter:'all'}});
const officeFilter = fakeEl({dataset:{locationFilter:'office'}});
const branchFilter = fakeEl({dataset:{locationFilter:'branch'}});
const count = fakeEl();
const root = fakeEl({
  dataset:{mapKey:'',initialView:'satellite','3dDefault':'true'},
  isConnected:true,
  querySelectorAll: selector => selector === '[data-location-card]'
    ? [a.obj,b.obj,c.obj]
    : selector === '[data-location-filter]' ? [allFilter,officeFilter,branchFilter] : [],
  querySelector: selector => ({
    '[data-location-map]':fakeEl(),
    '[data-map-empty]':fakeEl(),
    '[data-location-status]':fakeEl(),
    '[data-locations-controls]':fakeEl(),
    '[data-locations-list]':fakeEl(),
    '[data-locations-count]':count,
    '[data-map-3d]':fakeEl(),
    '[data-map-fit]':fakeEl(),
  })[selector] || null,
});
vm.runInContext('init',context)(root);
assert(a.directions.href.includes('destination=25.2%2C55.27'), 'verified coordinates create directions link');
assert(b.directions.href.includes('query=safe-address'), 'invalid coordinates retain safe address link');
assert.equal(b.directions.hidden,false, 'address fallback stays visible');
assert.equal(b.directions.textContent,'', 'invalid coordinates never create a directions link');
assert.equal(count.textContent,'3 locations');
branchFilter.fire('click');
assert.equal(a.obj.hidden,true);
assert.equal(b.obj.hidden,false);
assert.equal(c.obj.hidden,false);
assert.equal(count.textContent,'2 locations');
assert.equal(c.select.getAttribute('aria-pressed'),'true','first valid filtered location selected');
officeFilter.fire('click');
assert.equal(a.obj.hidden,false);
assert.equal(a.select.getAttribute('aria-pressed'),'true');
assert.equal(b.select.getAttribute('aria-pressed'),'false');
allFilter.fire('click');
assert.equal(count.textContent,'3 locations');
console.log('PASS: safe directions links, filter state, selected branch and counts.');
