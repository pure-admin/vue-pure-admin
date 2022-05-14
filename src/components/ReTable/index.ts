import { App } from "vue";
import epTableProBar from "./src/bar";

/** table-crud组件 */
export const EpTableProBar = Object.assign(epTableProBar, {
  install(app: App) {
    app.component(epTableProBar.name, epTableProBar);
  }
});
