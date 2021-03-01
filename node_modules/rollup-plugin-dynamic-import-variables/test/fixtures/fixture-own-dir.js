export function importModule(name) {
  return import(`./root-module-${name}.js`);
}
