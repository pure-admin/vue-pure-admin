import { Parser } from 'acorn';
import dynamicImport from 'acorn-dynamic-import';
import test from 'ava';
import {
  dynamicImportToGlob,
  VariableDynamicImportError,
} from '../../src/dynamic-import-to-glob';

const CustomParser = Parser.extend(dynamicImport);

test('template literal with variable filename', (t) => {
  const ast = CustomParser.parse('import(`./foo/${bar}.js`);', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*.js');
});

test('template literal with variable directory', (t) => {
  const ast = CustomParser.parse('import(`./foo/${bar}/x.js`);', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*/x.js');
});

test('template literal with multiple variables', (t) => {
  const ast = CustomParser.parse('import(`./${foo}/${bar}.js`);', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './*/*.js');
});

test('dynamic expression with variable filename', (t) => {
  const ast = CustomParser.parse('import("./foo/".concat(bar,".js"));', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*.js');
});

test('dynamic expression with variable directory', (t) => {
  const ast = CustomParser.parse('import("./foo/".concat(bar, "/x.js"));', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*/x.js');
});

test('dynamic expression with multiple variables', (t) => {
  const ast = CustomParser.parse('import("./".concat(foo, "/").concat(bar,".js"));', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './*/*.js');
});

test('string concatenation', (t) => {
  const ast = CustomParser.parse('import("./foo/" + bar + ".js");', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*.js');
});

test('string concatenation and template literals combined', (t) => {
  const ast = CustomParser.parse('import("./" + `foo/${bar}` + ".js");', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*.js');
});

test('string literal in a template literal expression', (t) => {
  const ast = CustomParser.parse('import(`${"./foo/"}${bar}.js`);', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*.js');
});

test('multiple variables are collapsed into a single *', (t) => {
  const ast = CustomParser.parse('import(`./foo/${bar}${baz}/${x}${y}.js`);', {
    sourceType: 'module',
  });

  const glob = dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  t.is(glob, './foo/*/*.js');
});

test('throws when dynamic import contains a *', (t) => {
  const ast = CustomParser.parse('import(`./*${foo}.js`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  } catch (e) {
    error = e;
  }
  t.is(error.message, 'A dynamic import cannot contain * characters.');
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import contains a non + operator', (t) => {
  const ast = CustomParser.parse('import("foo" - "bar.js");', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0]);
  } catch (e) {
    error = e;
  }
  t.is(error.message, '- operator is not supported.');
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import is a single variable', (t) => {
  const ast = CustomParser.parse('import(foo);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". It cannot be statically analyzed. Variable dynamic imports must start with ./ and be limited to a specific directory. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import starts with a variable', (t) => {
  const ast = CustomParser.parse('import(`${folder}/foo.js`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". It cannot be statically analyzed. Variable dynamic imports must start with ./ and be limited to a specific directory. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import starts with a /', (t) => {
  const ast = CustomParser.parse('import(`/foo/${bar}.js`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". Variable absolute imports are not supported, imports must start with ./ in the static part of the import. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import does not start with ./', (t) => {
  const ast = CustomParser.parse('import(`foo/${bar}.js`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". Variable bare imports are not supported, imports must start with ./ in the static part of the import. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});

test("throws when dynamic import imports it's own directory", (t) => {
  const ast = CustomParser.parse('import(`./${foo}.js`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". Variable imports cannot import their own directory, place imports in a separate directory or make the import filename more specific. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});

test('throws when dynamic import imports does not contain a file extension', (t) => {
  const ast = CustomParser.parse('import(`./foo/${bar}`);', {
    sourceType: 'module',
  });

  let error;
  try {
    dynamicImportToGlob(ast.body[0].expression.arguments[0], '${sourceString}');
  } catch (e) {
    error = e;
  }
  t.is(
    error.message,
    'invalid import "${sourceString}". A file extension must be included in the static part of the import. For example: import(`./foo/${bar}.js`).'
  );
  t.true(error instanceof VariableDynamicImportError);
});
