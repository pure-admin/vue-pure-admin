import { App } from "vue";
import reBarcode from "./src/index.vue";

export const ReBarcode = Object.assign(reBarcode, {
  install(app: App) {
    app.component(reBarcode.name, reBarcode);
  }
});

export default ReBarcode;
