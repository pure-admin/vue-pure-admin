declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "vuedraggable/src/vuedraggable";
declare module "vue-virtual-scroller";
declare module "@pureadmin/components";
declare module "@pureadmin/theme";
declare module "@pureadmin/theme/dist/browser-utils";
