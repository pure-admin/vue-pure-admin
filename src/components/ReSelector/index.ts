import { App } from "vue";
import reSelector from "./src";

export const ReSelector = Object.assign(reSelector, {
  install(app: App) {
    app.component(reSelector.name, reSelector);
  }
});

export default ReSelector;
