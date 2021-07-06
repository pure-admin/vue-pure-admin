import { App } from "vue";
import amap from "./src/Amap.vue";
import baiduMap from "./src/BaiduMap.vue";

export const Amap = Object.assign(amap, {
  install(app: App) {
    app.component(amap.name, amap);
  }
});

export const BaiduMap = Object.assign(baiduMap, {
  install(app: App) {
    app.component(baiduMap.name, baiduMap);
  }
});

export default {
  Amap,
  BaiduMap
};
