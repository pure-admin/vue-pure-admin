const path = require('path');

function transform(state, config, code, id) {
    if (state.idMap.has(id) && !state.exclude.has(id)) {
        const {inputOptions} = state.idMap.get(id);
        return { code, map: `{"version":3,"file":"${path.basename(inputOptions.input)}","sources":[],"sourcesContent":[],"names":[],"mappings":""}` };
    }
    return null;
}

module.exports = transform;
