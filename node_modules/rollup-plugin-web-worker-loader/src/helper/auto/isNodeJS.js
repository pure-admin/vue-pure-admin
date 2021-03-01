var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

export function isNodeJS() {
    return kIsNodeJS;
}
