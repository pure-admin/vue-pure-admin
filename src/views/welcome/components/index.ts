import reInfinite from "./Infinite.vue";
import reGithub from "./Github.vue";
import reLine from "./Line.vue";
import reBar from "./Bar.vue";
import rePie from "./Pie.vue";
import { App } from "vue";

const ReInfinite = Object.assign(reInfinite, {
  install(app: App) {
    app.component(reInfinite.name, reInfinite);
  }
});

const ReGithub = Object.assign(reGithub, {
  install(app: App) {
    app.component(reGithub.name, reGithub);
  }
});

const ReLine = Object.assign(reLine, {
  install(app: App) {
    app.component(reLine.name, reLine);
  }
});

const ReBar = Object.assign(reBar, {
  install(app: App) {
    app.component(reBar.name, reBar);
  }
});

const RePie = Object.assign(rePie, {
  install(app: App) {
    app.component(rePie.name, rePie);
  }
});

export { ReInfinite, ReGithub, ReLine, ReBar, RePie };
