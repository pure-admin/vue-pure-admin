declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue3-puzzle-vcode";
declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
