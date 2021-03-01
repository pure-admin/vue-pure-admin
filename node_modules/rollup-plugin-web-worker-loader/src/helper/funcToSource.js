export function funcToSource(fn, sourcemapArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var source = fn.toString();
    var lines = source.split('\n');
    lines.pop();
    lines.shift();
    var blankPrefixLength = lines[0].search(/\S/);
    var regex = /(['"])__worker_loader_strict__(['"])/g;
    for (var i = 0, n = lines.length; i < n; ++i) {
        lines[i] = lines[i].substring(blankPrefixLength).replace(regex, '$1use strict$2') + '\n';
    }
    if (sourcemap) {
        lines.push('\/\/# sourceMappingURL=' + sourcemap + '\n');
    }
    return lines;
}
