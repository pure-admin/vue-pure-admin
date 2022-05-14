import { App } from "vue";
import reFlop from "./src/index.vue";

/** 时间翻牌组件 */
export const ReFlop = Object.assign(reFlop, {
  install(app: App) {
    app.component(reFlop.name, reFlop);
  }
});

export default ReFlop;
