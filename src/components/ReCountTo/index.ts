import { App } from "vue";
import reNormalCountTo from "./src/normal";
import reboundCountTo from "./src/rebound";

export const ReNormalCountTo = Object.assign(reNormalCountTo, {
  install(app: App) {
    app.component(reNormalCountTo.name, reNormalCountTo);
  }
});

export const ReboundCountTo = Object.assign(reboundCountTo, {
  install(app: App) {
    app.component(reboundCountTo.name, reboundCountTo);
  }
});
