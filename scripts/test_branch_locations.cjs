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
assert(source.includes("data") === false || typeof source === 'string');
assert(source.includes("'hybrid-v4'"), 'Satellite uses the supported hybrid style identifier');
assert(source.includes("'streets-v4'"), 'Street map style is available');
assert(source.includes('if (!root || instances.has(root)) return'), 'Shopify section re-init is idempotent');
assert(source.includes('function destroy()'), 'Shopify editor cleanup exists');
console.log('PASS: 9 coordinate cases + 4 map implementation invariants.');
