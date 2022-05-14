import { App } from "vue";
import reCropper from "./src";

/** 图片裁剪组件 */
export const ReCropper = Object.assign(reCropper, {
  install(app: App) {
    app.component(reCropper.name, reCropper);
  }
});

export default ReCropper;
