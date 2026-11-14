const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const hookPath = 'hooks/useEntries.hook.ts';

test('imported entries are saved for the next app launch', async () => {
  const source = fs.readFileSync(path.join(root, hookPath), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;

  const imported = [{ date: '2026-11-03', grateful: ['A good day'] }];
  const values = new Map();
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => values.set(key, value),
  };
  const dayjs = () => ({ isToday: () => false });
  dayjs.extend = () => {};
  const mocks = {
    react: {
      useCallback: (callback) => callback,
      useEffect: () => {},
      useState: (value) => [value, () => {}],
    },
    '@react-native-async-storage/async-storage': { default: storage },
    dayjs: { default: dayjs },
    'dayjs/plugin/isToday': { default: () => {} },
    'react-native-toast-message': { default: { show: () => {} } },
    '../helpers/entry-storage.helper': {
      importEntriesFromStorage: async () => imported,
      exportEntriesToStorage: async () => {},
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.ok(Object.hasOwn(mocks, name), `Unexpected import: ${name}`);
      return mocks[name];
    },
  });

  await module.exports.useEntries().importEntries();
  assert.deepEqual(JSON.parse(await storage.getItem('journalData')), imported);
});
