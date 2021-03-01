const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const fixMapSources = require('../utils/fixMapSources');
const extractSource = require('../utils/extractSource');
const buildWorkerCode = require('../utils/buildWorkerCode');

const helperPattern = /^\0(?:[0-9]+::)?rollup-plugin-web-worker-loader::helper(?:::)?/;

function loadHelperFile(id, match, resolve, reject) {
    const helperParts = id.substr(match[0].length).split('::');
    const helperPath = path.resolve(__dirname, '../helper', ...helperParts) + '.js';
    fs.readFile(helperPath, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    });
}

function findChunk(rollupOutput) {
    for (const chunk of rollupOutput) {
        if (!chunk.isAsset) { // here to support older rollup versions will be removed soon
            return chunk;
        }
    }
    return null;
}

function updateWatchModules(modules, addWatchFile) {
    /* add dependencies to watch list */
    const deps = Object.keys(modules);
    for (const dep of deps) {
        addWatchFile(dep);
    }
}

function handleBundleGenerated(state, config, addWatchFile, id, workerID, result) {
    const chunk = findChunk(result.output);
    if (chunk !== null) {
        updateWatchModules(chunk.modules, addWatchFile);

        let map = null;
        let source;
        if (config.inline) {
            source = extractSource(chunk.code, config.preserveSource);
            map = null;
            if (config.sourcemap) {
                map = fixMapSources(chunk, state.basePath);
            }
        } else {
            const workerPath = path.posix.join(config.outputFolder, workerID);
            source = path.posix.join(config.loadPath, workerPath);
            chunk.fileName = workerPath;
            state.idMap.get(id).chunk = chunk;
        }
        return {
            code: buildWorkerCode(source, map, {
                inline: config.inline,
                preserveSource: config.preserveSource,
                enableUnicode: config.enableUnicode,
                targetPlatform: config.targetPlatform,
            }),
        };
    }
    return null;
}

function load(state, config, addWatchFile, id) {
    return new Promise((resolve, reject) => {
        const helperMatch = helperPattern.exec(id);
        if (helperMatch) {
            loadHelperFile(id, helperMatch, resolve, reject);
        } else if (state.idMap.has(id) && !state.exclude.has(id)) {
            const {inputOptions, workerID, target} = state.idMap.get(id);
            state.exclude.add(id);
            state.exclude.add(target);
            rollup.rollup(inputOptions).then(bundle => {
                state.exclude.delete(id);
                state.exclude.delete(target);
                bundle.generate({format: 'iife', name: 'worker_code', sourcemap: true}).then(result => {
                    resolve(handleBundleGenerated(state, config, addWatchFile, id, workerID, result));
                }).catch(reject);
            }).catch(reason => {
                state.exclude.delete(id);
                state.exclude.delete(target);
                reject(reason);
            });
        } else {
            resolve(null);
        }
    });
}

module.exports = load;
