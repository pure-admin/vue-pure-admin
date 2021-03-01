import {createBase64WorkerFactory as nodeCreateBase64WorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::node::createBase64WorkerFactory';
import {createBase64WorkerFactory as browserCreateBase64WorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createBase64WorkerFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        return nodeCreateBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
    }
    return browserCreateBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
}
