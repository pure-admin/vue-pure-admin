const path = require('path');

function outputOptions(state, config, options) {
    if (!config.inline && options.file && !options.dir) {
        state.configuredFileName = path.basename(options.file);
        return Object.assign({}, options, {
            file: null,
            dir: path.dirname(options.file),
        });
    }
    return null;
}

module.exports = outputOptions;
