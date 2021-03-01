import {createInlineWorkerFactory as nodeCreateInlineWorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::node::createInlineWorkerFactory';
import {createInlineWorkerFactory as browserCreateInlineWorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createInlineWorkerFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createInlineWorkerFactory(fn, sourcemapArg) {
    if (isNodeJS()) {
        return nodeCreateInlineWorkerFactory(fn, sourcemapArg);
    }
    return browserCreateInlineWorkerFactory(fn, sourcemapArg);
}
