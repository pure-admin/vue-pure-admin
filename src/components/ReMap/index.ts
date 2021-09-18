import { App } from "vue";
import amap from "./src/Amap.vue";

export const Amap = Object.assign(amap, {
  install(app: App) {
    app.component(amap.name, amap);
  }
});

export default {
  Amap
};
