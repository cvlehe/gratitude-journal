const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => (resolve = done));
  return { promise, resolve };
};

const makeGate = ({ hardware = true, enrolled = true } = {}) => {
  const source = fs.readFileSync(path.join(__dirname, '../components/BiometricGate.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  const state = [];
  const refs = [];
  const prompts = [];
  const options = [];
  let stateIndex = 0;
  let refIndex = 0;
  let effect;
  let listener;
  let cancellations = 0;
  const appState = {
    currentState: 'active',
    addEventListener: (_event, callback) => {
      listener = callback;
      return { remove: () => (listener = undefined) };
    },
  };
  const createElement = (type, props) => ({ type, props });
  const mocks = {
    react: {
      useCallback: (callback) => callback,
      useEffect: (callback) => {
        if (!effect) effect = callback;
      },
      useRef: (initial) => {
        const index = refIndex++;
        if (!(index in refs)) refs[index] = { current: initial };
        return refs[index];
      },
      useState: (initial) => {
        const index = stateIndex++;
        if (!(index in state)) state[index] = initial;
        return [state[index], (value) => (state[index] = value)];
      },
    },
    'react/jsx-runtime': { jsx: createElement, jsxs: createElement },
    'react-native': {
      ActivityIndicator: 'ActivityIndicator',
      AppState: appState,
      Platform: { OS: 'android' },
      Pressable: 'Pressable',
      StyleSheet: { create: (styles) => styles },
      Text: 'Text',
      View: 'View',
    },
    'expo-local-authentication': {
      hasHardwareAsync: async () => hardware,
      isEnrolledAsync: async () => enrolled,
      authenticateAsync: (promptOptions) => {
        options.push(promptOptions);
        const prompt = deferred();
        prompts.push(prompt);
        return prompt.promise;
      },
      cancelAuthenticate: async () => {
        cancellations++;
      },
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

  const marker = { type: 'Journal', props: {} };
  const render = () => {
    stateIndex = 0;
    refIndex = 0;
    return module.exports.BiometricGate({ children: marker });
  };
  const find = (node, testID) => {
    if (!node || typeof node !== 'object') return undefined;
    if (node.props?.testID === testID) return node;
    const children = node.props?.children;
    return (Array.isArray(children) ? children : [children])
      .map((child) => find(child, testID))
      .find(Boolean);
  };
  const emit = (nextState) => {
    appState.currentState = nextState;
    listener(nextState);
  };

  return {
    mount: () => {
      render();
      effect();
    },
    render,
    find,
    emit,
    prompts,
    options,
    get cancellations() {
      return cancellations;
    },
  };
};

test('journal stays hidden until biometrics succeed and locks again on background', async () => {
  const gate = makeGate();
  gate.mount();
  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  assert.equal(gate.find(gate.render(), 'journal-content'), undefined);

  await tick();
  assert.equal(gate.prompts.length, 1);
  assert.equal(gate.options[0].disableDeviceFallback, true);
  gate.prompts[0].resolve({ success: true });
  await tick();
  assert.equal(gate.find(gate.render(), 'biometric-lock-screen'), undefined);
  assert.ok(gate.find(gate.render(), 'journal-content'));

  gate.emit('background');
  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  assert.equal(gate.find(gate.render(), 'journal-content').props.style[1].display, 'none');

  gate.emit('active');
  await tick();
  assert.equal(gate.prompts.length, 2);
  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  gate.prompts[1].resolve({ success: true });
  await tick();
  assert.equal(gate.find(gate.render(), 'biometric-lock-screen'), undefined);
});

test('failed authentication never opens the journal', async () => {
  const gate = makeGate();
  gate.mount();
  await tick();
  gate.prompts[0].resolve({ success: false, error: 'authentication_failed' });
  await tick();

  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  assert.equal(gate.find(gate.render(), 'journal-content'), undefined);
});

test('missing biometric enrollment keeps the journal locked', async () => {
  const gate = makeGate({ enrolled: false });
  gate.mount();
  await tick();

  assert.equal(gate.prompts.length, 0);
  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  assert.equal(gate.find(gate.render(), 'journal-content'), undefined);
});

test('a prompt completed after backgrounding cannot unlock the journal', async () => {
  const gate = makeGate();
  gate.mount();
  await tick();

  gate.emit('background');
  gate.emit('active');
  gate.prompts[0].resolve({ success: true });
  await tick();
  assert.equal(gate.cancellations, 1);
  assert.ok(gate.find(gate.render(), 'biometric-lock-screen'));
  assert.equal(gate.prompts.length, 2);

  gate.prompts[1].resolve({ success: true });
  await tick();
  assert.equal(gate.find(gate.render(), 'biometric-lock-screen'), undefined);
});
