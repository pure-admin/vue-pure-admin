export function importModule(dir, name) {
  return import(`./${dir}/${name}.js`);
}
