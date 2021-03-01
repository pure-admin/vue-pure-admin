import {funcToSource} from '\0rollup-plugin-web-worker-loader::helper::funcToSource';
import {WorkerClass} from '\0rollup-plugin-web-worker-loader::helper::node::WorkerClass';

export function createInlineWorkerFactory(fn, sourcemapArg) {
    var lines = funcToSource(fn, sourcemapArg);
    var concat = lines.join('\n');
    return function WorkerFactory(options) {
        return new WorkerClass(concat, Object.assign({}, options, { eval: true }));
    };
}
