const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');

const makeScreen = (
  fetchQuote = async () => ({ text: 'Downloaded today', author: 'Today' }),
  setTimer = setTimeout
) => {
  const source = fs.readFileSync(path.join(root, 'components/MainScreen.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  const state = [];
  const refs = [];
  let stateIndex = 0;
  let refIndex = 0;
  const createElement = (type, props) => ({ type, props });
  const QuoteRow = () => {};
  const SubmitButton = () => {};
  const mocks = {
    react: {
      useCallback: (callback) => callback,
      useEffect: () => {},
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
    'react/jsx-runtime': {
      jsx: createElement,
      jsxs: createElement,
      Fragment: Symbol('Fragment'),
    },
    formik: {
      useFormik: ({ initialValues, onSubmit }) => ({
        initialValues,
        values: initialValues,
        setValues: () => {},
        handleChange: () => () => {},
        handleBlur: () => () => {},
        handleSubmit: () => onSubmit(initialValues),
      }),
    },
    '../hooks/useQuotes.hook': {
      default: () => ({ fetchQuote }),
    },
    'react-native-toast-message': { default: { show: () => {} } },
    './QuoteRow': { default: QuoteRow },
    './SubmitButton': { SubmitButton },
    './GratitudeNumberedInputSection': { default: () => {} },
    './GratitudeInputSection': { default: () => {} },
    './Section': { Section: () => {} },
    'react-native-keyboard-aware-scroll-view': { KeyboardAwareScrollView: () => {} },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    setTimeout: setTimer,
    clearTimeout,
    require: (name) => {
      assert.ok(Object.hasOwn(mocks, name), `Unexpected import: ${name}`);
      return mocks[name];
    },
  });

  const render = (props) => {
    stateIndex = 0;
    refIndex = 0;
    return module.exports.MainScreen(props);
  };
  const find = (node, type) => {
    if (!node || typeof node !== 'object') return undefined;
    if (node.type === type) return node;
    const children = node.props?.children;
    return (Array.isArray(children) ? children : [children])
      .map((child) => find(child, type))
      .find(Boolean);
  };
  return { render, find, QuoteRow, SubmitButton };
};

test('navigating to an older entry shows its saved quote', () => {
  const screen = makeScreen();
  const today = { date: new Date(), quote: { text: 'Today quote', author: 'Today' } };
  const earlier = {
    date: new Date('2026-11-01'),
    quote: { text: 'Earlier quote', author: 'Earlier' },
  };

  screen.render({ entry: today, submitPressed: () => {} });
  const previousPage = screen.render({ entry: earlier, submitPressed: () => {} });

  assert.equal(screen.find(previousPage, screen.QuoteRow)?.props.quote.text, 'Earlier quote');
});

test('saving before the quote request finishes still stores the downloaded quote', async () => {
  const screen = makeScreen();
  let stored;
  const newPage = screen.render({
    entry: undefined,
    submitPressed: (entry) => {
      stored = JSON.parse(JSON.stringify(entry));
    },
  });

  await screen.find(newPage, screen.SubmitButton).props.onSubmit();
  assert.deepEqual(stored.quote, { text: 'Downloaded today', author: 'Today' });
});

test('editing an older entry keeps its original quote', async () => {
  const screen = makeScreen();
  const today = { date: new Date(), quote: { text: 'Today quote', author: 'Today' } };
  const earlier = {
    date: new Date('2026-11-01'),
    quote: { text: 'Earlier quote', author: 'Earlier' },
  };
  let saved;

  screen.render({ entry: today, submitPressed: () => {} });
  const previousPage = screen.render({ entry: earlier, submitPressed: (entry) => (saved = entry) });
  await screen.find(previousPage, screen.SubmitButton).props.onSubmit();

  assert.equal(saved.quote.text, 'Earlier quote');
});

test('a failed quote request does not prevent saving an entry', async () => {
  const screen = makeScreen(async () => {
    throw new Error('offline');
  });
  let saved;
  const newPage = screen.render({
    entry: undefined,
    submitPressed: (entry) => (saved = entry),
  });

  await screen.find(newPage, screen.SubmitButton).props.onSubmit();
  assert.ok(saved, 'entry should be saved');
  assert.equal(saved.quote, undefined);
});

test('a stalled quote request does not prevent saving an entry', async () => {
  const screen = makeScreen(
    () => new Promise(() => {}),
    (callback) => {
      callback();
      return 1;
    }
  );
  let saved;
  const newPage = screen.render({
    entry: undefined,
    submitPressed: (entry) => (saved = entry),
  });

  await screen.find(newPage, screen.SubmitButton).props.onSubmit();
  assert.ok(saved, 'entry should be saved');
  assert.equal(saved.quote, undefined);
});
