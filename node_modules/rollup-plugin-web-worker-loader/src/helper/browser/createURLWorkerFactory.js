export function createURLWorkerFactory(url) {
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}
