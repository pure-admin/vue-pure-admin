const kDefaultsOptions = {
    inline: true,
    preserveSource: false,
    enableUnicode: false,
    targetPlatform: 'browser',
};

function getFactoryFuncName(options) {
    if (options.inline) {
        if (options.preserveSource) {
            return 'createInlineWorkerFactory';
        }
        return 'createBase64WorkerFactory';
    }
    return 'createURLWorkerFactory';
}

function getArgsString(source, sourcemap, options) {
    if (options.inline) {
        const sourcemapArg = sourcemap ? `'${sourcemap.toUrl()}'` : 'null';
        if (options.preserveSource) {
            return `${source.substring(0, source.length - 1)}, ${sourcemapArg}`;
        }
        const sourceArg = Buffer.from(source, options.enableUnicode ? 'utf16le' : 'utf8').toString('base64');
        return `'${sourceArg}', ${sourcemapArg}, ${options.enableUnicode.toString()}`;
    }
    return `'${source}'`;
}

function buildWorkerCode(source, sourcemap = null, optionsArg = kDefaultsOptions) {
    const options = Object.assign({}, kDefaultsOptions, optionsArg);
    const factoryFuncName = getFactoryFuncName(options);
    const argsString = getArgsString(source, sourcemap, options);
    return `
/* eslint-disable */
import {${factoryFuncName}} from '\0rollup-plugin-web-worker-loader::helper::${options.targetPlatform}::${factoryFuncName}';
var WorkerFactory = ${factoryFuncName}(${argsString});
export default WorkerFactory;
/* eslint-enable */\n`;
}

module.exports = buildWorkerCode;
