import { join } from 'path';

import test from 'ava';
import { rollup } from 'rollup';

import dynamicImportVars from '..';

process.chdir(join(__dirname, 'fixtures'));

test('single dir', async (t) => {
  const bundle = await rollup({
    input: 'fixture-single-dir.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-single-dir.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('multiple dirs', async (t) => {
  const bundle = await rollup({
    input: 'fixture-multiple-dirs.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-multiple-dirs.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
    require.resolve('./fixtures/module-dir-b/module-b-1.js'),
    require.resolve('./fixtures/module-dir-b/module-b-2.js'),
    require.resolve('./fixtures/sub-dir/fixture-upwards-path.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('upwards dir path', async (t) => {
  const bundle = await rollup({
    input: 'sub-dir/fixture-upwards-path',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/sub-dir/fixture-upwards-path.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('complex concatenation', async (t) => {
  const bundle = await rollup({
    input: 'fixture-complex-concat.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-complex-concat.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
    require.resolve('./fixtures/module-dir-b/module-b-1.js'),
    require.resolve('./fixtures/module-dir-b/module-b-2.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('CallExpression', async (t) => {
  const bundle = await rollup({
    input: 'fixture-call-expression.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-call-expression.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('own directory', async (t) => {
  const bundle = await rollup({
    input: 'fixture-own-dir.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-own-dir.js'),
    require.resolve('./fixtures/root-module-a.js'),
    require.resolve('./fixtures/root-module-b.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('multiple dynamic imports', async (t) => {
  const bundle = await rollup({
    input: 'fixture-multiple-imports.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-multiple-imports.js'),
    require.resolve('./fixtures/module-dir-a/module-a-1.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
    require.resolve('./fixtures/module-dir-b/module-b-1.js'),
    require.resolve('./fixtures/module-dir-b/module-b-2.js'),
    require.resolve('./fixtures/sub-dir/fixture-upwards-path.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test("doesn't change imports that should not be changed", async (t) => {
  const bundle = await rollup({
    input: 'fixture-unchanged.js',
    plugins: [dynamicImportVars()],
  });
  const { output } = await bundle.generate({ format: 'es' });
  const expectedFiles = [
    require.resolve('./fixtures/fixture-unchanged.js'),
    require.resolve('./fixtures/module-dir-a/module-a-2.js'),
  ];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('can exclude files', async (t) => {
  const bundle = await rollup({
    input: 'fixture-excluded.js',
    plugins: [
      dynamicImportVars({
        exclude: ['fixture-excluded.js'],
      }),
    ],
  });
  const { output } = await bundle.generate({ format: 'es' });

  const expectedFiles = [require.resolve('./fixtures/fixture-excluded.js')];

  t.deepEqual(
    expectedFiles,
    output.map((o) => o.facadeModuleId)
  );
  t.snapshot(output[0].code);
});

test('throws an error on failure', async (t) => {
  let thrown;
  try {
    const bundle = await rollup({
      input: 'fixture-extensionless.js',
      plugins: [
        dynamicImportVars({
          exclude: ['fixture-excluded.js'],
        }),
      ],
    });
  } catch (_) {
    thrown = true;
  }
  t.is(thrown, true);
});
