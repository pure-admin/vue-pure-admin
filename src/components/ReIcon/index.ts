import { App } from "vue";
import icon from "./src/Icon.vue";

export const Icon = Object.assign(icon, {
  install(app: App) {
    app.component(icon.name, icon);
  }
});

export default {
  Icon
};
