import { App } from "vue";
import reNormalCountTo from "./src/normal";
import reboundCountTo from "./src/rebound";

/** 普通数字动画组件 */
const ReNormalCountTo = Object.assign(reNormalCountTo, {
  install(app: App) {
    app.component(reNormalCountTo.name, reNormalCountTo);
  }
});

/** 回弹式数字动画组件 */
const ReboundCountTo = Object.assign(reboundCountTo, {
  install(app: App) {
    app.component(reboundCountTo.name, reboundCountTo);
  }
});

export { ReNormalCountTo, ReboundCountTo };
