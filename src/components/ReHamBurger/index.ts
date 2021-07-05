import { App } from "vue";
import reHamBurger from "./src/index.vue";

export const ReHamBurger = Object.assign(reHamBurger, {
  install(app: App) {
    app.component(reHamBurger.name, reHamBurger);
  }
});

export default ReHamBurger;
