import { App } from "vue";
import reCountTo from "./src";

export const ReCountTo = Object.assign(reCountTo, {
  install(app: App) {
    app.component(reCountTo.name, reCountTo);
  }
});

export default ReCountTo;
