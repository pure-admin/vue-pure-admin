import { App } from "vue";
import reSelector from "./src";

/** 选择器组件 */
export const ReSelector = Object.assign(reSelector, {
  install(app: App) {
    app.component(reSelector.name, reSelector);
  }
});

export default ReSelector;
