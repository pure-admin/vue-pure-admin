import { App } from "vue";
import reCropper from "./src";

export const ReCropper = Object.assign(reCropper, {
  install(app: App) {
    app.component(reCropper.name, reCropper);
  }
});

export default ReCropper;
