import {createURLWorkerFactory as nodeCreateURLWorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::node::createURLWorkerFactory';
import {createURLWorkerFactory as browserCreateURLWorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createURLWorkerFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createURLWorkerFactory(url) {
    if (isNodeJS()) {
        return nodeCreateURLWorkerFactory(url);
    }
    return browserCreateURLWorkerFactory(url);
}
