import { App } from "vue";
import epTableProBar from "./src/bar";

export const EpTableProBar = Object.assign(epTableProBar, {
  install(app: App) {
    app.component(epTableProBar.name, epTableProBar);
  }
});
