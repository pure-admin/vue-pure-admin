function extractSource(code, asFunction = true) {
    if (asFunction) {
        return `/* rollup-plugin-web-worker-loader */function () {\n${
            code.replace(/(['"])use strict(['"])/g, '$1__worker_loader_strict__$2')
        }}\n`;
    }
    return `/* rollup-plugin-web-worker-loader */\n${code}\n`;
}

module.exports = extractSource;
