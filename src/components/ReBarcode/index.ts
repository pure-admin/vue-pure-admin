import { App } from "vue";
import reBarcode from "./src/index.vue";

/** 条形码组件 */
export const ReBarcode = Object.assign(reBarcode, {
  install(app: App) {
    app.component(reBarcode.name, reBarcode);
  }
});

export default ReBarcode;
