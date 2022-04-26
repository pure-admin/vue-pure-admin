import { h, resolveComponent } from "vue";

export const dynamicComponent = (component: string) =>
  h(resolveComponent(component));
