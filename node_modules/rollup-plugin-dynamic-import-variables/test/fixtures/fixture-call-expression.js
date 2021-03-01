export function importModule(dirName, name) {
  return import(`./module-dir-a/${name.substring(0, 2)}.js`);
}
