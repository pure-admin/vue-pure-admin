import { App } from "vue";
import reSeamlessScroll from "./src/index.vue";

/** 无缝滚动组件 */
export const ReSeamlessScroll = Object.assign(reSeamlessScroll, {
  install(app: App) {
    app.component(reSeamlessScroll.name, reSeamlessScroll);
  }
});

export default ReSeamlessScroll;
