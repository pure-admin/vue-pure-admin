import {
  shadeBgColor,
  createNewStyle,
  writeNewStyle
} from "/@/layout/theme/element-plus";
import type { App, Plugin } from "vue";

export const withInstall = <T>(component: T) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name, component);
  };
  return component as T & Plugin;
};

export const setStyle = (color: string) => {
  const body = document.documentElement as HTMLElement;
  // @ts-expect-error
  writeNewStyle(createNewStyle(color));
  body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
};
