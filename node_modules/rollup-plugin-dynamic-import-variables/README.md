# Rollup plugin dynamic import variables

Plugin to support variables in dynamic imports in Rollup.

Turns:

```js
function importLocale(locale) {
  return import(`./locales/${locale}.js`);
}
```

Into:

```js
function __variableDynamicImportRuntime__(path) {
  switch (path) {
    case './locales/en-GB.js':
      return import('./locales/en-GB.js');
    case './locales/en-US.js':
      return import('./locales/en-US.js');
    case './locales/nl-NL.js':
      return import('./locales/nl-NL.js');
    default:
      throw new Error('Unknown variable dynamic import: ' + path);
  }
}

function importLocale(locale) {
  return __variableDynamicImportRuntime__(`./locales/${locale}.js`);
}
```

## Usage

```js
import dynamicImportVariables from 'rollup-plugin-dynamic-import-variables';

export default {
  plugins: [
    dynamicImportVariables({
      // options
    }),
  ],
};
```

### Options

#### include

Files to include in this plugin (default all).

#### exclude

Files to exclude in this plugin (default none).

#### warnOnError

By default, the plugin quits the build process when it encounters an error. If you set this option to true, it will throw a warning instead and leave the code untouched.

## How it works

When a dynamic import contains a concatenated string, the variables of the string are replaced with a glob pattern. This glob pattern is evaluated during the build, and any files found are added to the rollup bundle. At runtime, the correct import is returned for the full concatenated string.

Some example patterns and the glob they produce:

```js
`./locales/${locale}.js` -> './locales/*.js'
```

```js
`./${folder}/${name}.js` -> './*/*.js'
```

```js
`./module-${name}.js` -> './module-*.js'
```

```js
`./modules-${name}/index.js` -> './modules-*/index.js'
```

```js
'./locales/' + locale + '.js' -> './locales/*.js'
```

```js
'./locales/' + locale + foo + bar '.js' -> './locales/*.js'
```

```js
'./locales/' + `${locale}.js` -> './locales/*.js'
```

```js
'./locales/' + `${foo + bar}.js` -> './locales/*.js'
```

## Limitations

To know what to inject in the rollup bundle, we have to be able to do some static analysis on the code and make some assumptions about the possible imports. For example, if you use just a variable you could in theory import anything from your entire file system.

```js
function importModule(path) {
  // who knows what will be imported here?
  return import(path);
}
```

To help static analysis, and to avoid possible foot guns, we are limited to a couple of rules:

### Imports must start with `./` or `../`.

All imports must start relative to the importing file. The import should not start with a variable, an absolute path or a bare import:

```js
// Not allowed
import(bar);
import(`${bar}.js`);
import(`/foo/${bar}.js`);
import(`some-library/${bar}.js`);
```

### Imports must end with a file extension

A folder may contain files you don't intend to import. We, therefore, require imports to end with a file extension in the static parts of the import.

```js
// Not allowed
import(`./foo/${bar}`);
// allowed
import(`./foo/${bar}.js`);
```

### Imports to your own directory must specify a filename pattern

If you import your own directory you likely end up with files you did not intend to import, including your own module. It is therefore required to give a more specific filename pattern:

```js
// not allowed
import(`./${foo}.js`);
// allowed
import(`./module-${foo}.js`);
```

### Globs only go one level deep

When generating globs, each variable in the string is converted to a glob `*` with a maximum of one star per directory depth. This avoids unintentionally adding files from many directories to your import.

In the example below this generates `./foo/*/*.js` and not `./foo/**/*.js`.

```js
import(`./foo/${x}${y}/${z}.js`);
```
