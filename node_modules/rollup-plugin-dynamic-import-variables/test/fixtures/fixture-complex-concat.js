export function importModule(dirName, name) {
  return import(`./${`module-dir-${dirName}`}` + '/' + name + '.js');
}
