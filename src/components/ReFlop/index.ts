import { App } from "vue";
import reFlop from "./src/index.vue";

export const ReFlop = Object.assign(reFlop, {
  install(app: App) {
    app.component(reFlop.name, reFlop);
  }
});

export default ReFlop;
