import { App } from "vue";
import reImageVerify from "./src/index.vue";

export const ReImageVerify = Object.assign(reImageVerify, {
  install(app: App) {
    app.component(reImageVerify.name, reImageVerify);
  }
});

export default {
  ReImageVerify
};
