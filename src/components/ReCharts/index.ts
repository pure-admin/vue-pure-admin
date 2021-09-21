import { App } from "vue";
import reBar from "./src/Bar.vue";
import reGithub from "./src/Github.vue";
import reInfinite from "./src/Infinite.vue";
import reLine from "./src/Line.vue";
import rePie from "./src/Pie.vue";

export const ReBar = Object.assign(reBar, {
  install(app: App) {
    app.component(reBar.name, reBar);
  }
});

export const ReGithub = Object.assign(reGithub, {
  install(app: App) {
    app.component(reGithub.name, reGithub);
  }
});

export const ReInfinite = Object.assign(reInfinite, {
  install(app: App) {
    app.component(reInfinite.name, reInfinite);
  }
});

export const ReLine = Object.assign(reLine, {
  install(app: App) {
    app.component(reLine.name, reLine);
  }
});

export const RePie = Object.assign(rePie, {
  install(app: App) {
    app.component(rePie.name, rePie);
  }
});
