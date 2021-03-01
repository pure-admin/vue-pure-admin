const path = require('path');

function optionsImp(state, config, options) {
    if (!state.options) {
        state.options = Object.assign({}, options);
        if (options.plugins && options.plugins.length) {
            const plugins = [];
            options.plugins.forEach(plugin => {
                if (config.skipPlugins.has(plugin.name)) {
                    return;
                }
                plugins.push(plugin);
            });
            state.options.plugins = plugins;

            const cwd = process.cwd();
            if (typeof options.input === 'string') {
                try {
                    const entry = require.resolve(options.input, { paths: [cwd] });
                    state.basePath = path.dirname(entry);
                } catch (e) { /* EMPTY */ }
            } else if (Array.isArray(options.input)) {
                let componentCount = Number.MAX_SAFE_INTEGER;
                let shortestPath = null;
                for (let i = 0, n = options.input.length; i < n; ++i) {
                    try {
                        const entry = require.resolve(options.input[i], { paths: [cwd] });
                        const entryPath = path.dirname(entry);
                        const components = entryPath.split(path.sep);
                        if (components.length < componentCount) {
                            componentCount = components.length;
                            shortestPath = entryPath;
                        }
                    } catch (e) { /* EMPTY */ }
                }
                state.basePath = shortestPath;
            } else {
                const keys = Object.keys(options.input);
                let componentCount = Number.MAX_SAFE_INTEGER;
                let shortestPath = null;
                for (let i = 0, n = keys.length; i < n; ++i) {
                    const input = options.input[keys[i]];
                    try {
                        const entry = require.resolve(input, { paths: [cwd] });
                        const entryPath = path.dirname(entry);
                        const components = entryPath.split(path.sep);
                        if (components.length < componentCount) {
                            componentCount = components.length;
                            shortestPath = entryPath;
                        }
                    } catch (e) { /* EMPTY */ }
                }
                state.basePath = shortestPath;
            }

            if (!state.basePath) {
                state.basePath = '.';
            }
        }
    }

    return null;
}

module.exports = optionsImp;
