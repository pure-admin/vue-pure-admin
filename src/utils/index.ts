import type { App, Plugin } from "vue";

export const withInstall = <T>(component: T) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name, component);
  };
  return component as T & Plugin;
};
