declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "vue3-puzzle-vcode";
declare module "vue-virtual-scroller";
declare module "vuedraggable/src/vuedraggable";
declare module "element-plus/dist/locale/en.mjs";
declare module "element-plus/dist/locale/zh-cn.mjs";
declare module "plus-pro-components/locale/en.mjs";
declare module "plus-pro-components/locale/zh-cn.mjs";
