function generateBundle(state, config, options, bundle, isWrite) {
    if (!config.inline && isWrite) {
        if (state.configuredFileName && Object.keys(bundle).length === 1) {
            bundle[Object.keys(bundle)[0]].fileName = state.configuredFileName;
        }
        for (const worker of state.idMap) {
            if (worker[1].chunk && !bundle[worker[1].workerID]) {
                bundle[worker[1].workerID] = worker[1].chunk;
            }
        }
    }
}

module.exports = generateBundle;
