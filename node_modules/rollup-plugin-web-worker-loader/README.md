# rollup-plugin-web-worker-loader

Rollup plugin to handle Web Workers.

Can inline the worker code or emit a script file using code-splitting.
Handles Worker dependencies and can emit source maps.
Worker dependencies are added to Rollup's watch list.
Supports bundling workers for Node.js environments

### Getting started

```
yarn add rollup-plugin-web-worker-loader --dev
```

Add the plugin to your rollup configuration:

```javascript
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
    entry: 'src/index.js',
    plugins: [
        webWorkerLoader(/* configuration */),
    ],
    format: 'esm',
};
```

Bundle the worker code using the RegEx pattern specified in the plugin's configuration.
By default you can add the prefix `web-worker:` to your imports:

```javascript
// here we use the default pattern but any RegEx can be configured
import DataWorker from 'web-worker:./DataWorker';

const dataWorker = new DataWorker();
dataWorker.postMessage('Hello World!');
```

### Configuration
The plugin responds to the following configuration options:
```javascript
webWorkerLoader({
    targetPlatform?: string,        // The platform workers should be built for, can be 'auto', 'browser' or 'node'.
                                    // specifying either 'browser' or 'node' reduces the amount of loader code.
                                    // Default: 'auto'

    pattern?: RegEx,                // A RegEx instance describing the pattern that matches the files to import as
                                    // web workers. If capturing groups are present, the plugin uses the contents of the
                                    // last capturing group as the path to the worker script. Default: /web-worker:(.+)/
    
    extensions?: string[],          // An array of strings to use as extensions when resolving worker files.
                                    // Default: ['.js']


    sourcemap?: boolean,            // When inlined, should a source map be included in the final output. Default: false

    inline?: boolean,               // Should the worker code be inlined (Base64). Default: true

    forceInline?: boolean,          // *EXPERIMENTAL* when inlined, forces the code to be included every time it is imported
                                    // useful when using code splitting: Default: false

    preserveSource?: boolean,       // When inlined and this option is enabled, the full source code is included in the
                                    // built file, otherwise it's embedded as a base64 string. Default: false

    enableUnicodeSupport?: boolean, // When inlined in Base64 format, this option enables unicode support (UTF16). This
                                    // flag is disabled by default because supporting UTF16 doubles the size of the final
                                    // payload. Default: false

    outputFolder?: string,          // When code splitting is used (`inline: false`), folder in which the worker scripts
                                    // should be written to. Default: '' (same as build output folder)

    loadPath?: string,              // This option is useful when the worker scripts need to be loaded from another folder.
                                    // Default: ''

    skipPlugins?: Array             // Plugin names to skip for web worker build
                                    // Default: [ 'liveServer', 'serve', 'livereload' ]
})
```

### TypeScript
An example project that uses this plugin with TypeScript can be found [here](https://github.com/darionco/rollup-typescript-webworkers)

### Notes
**WARNING:** To use code-splitting for the worker scripts, Rollup v1.9.2 or higher is required. See https://github.com/rollup/rollup/issues/2801 for more details.

The `sourcemap` configuration option is ignored when `inline` is set to `false`, in that case the project's sourcemap configuration is inherited.

`loadPath` is meant to be used in situations where code-splitting is used (`inline = false`) and the entry script is hosted in a different folder than the worker code.


### Roadmap
- [x] Bundle file as web worker blob
- [x] Support for dependencies using `import`
- [x] Include source map
- [x] Configuration options to inline or code-split workers
- [ ] ~~Provide capability checks and fallbacks~~ DROPPED (all modern environments support workers) 
- [ ] ~~Avoid code duplication~~ DROPPED (there are better solutions for this purpose)


