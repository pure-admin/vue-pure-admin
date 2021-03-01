export class Foo {
  importModule(name) {
    return import(`./module-dir-a/${name}.js`);
  }
}

import(`./module-dir-a/${name}.js`).then((module) => {
  console.log('imported', module);
});

export function importModuleFromDir(dir, name) {
  return import(`./${dir}/${name}.js`);
}
