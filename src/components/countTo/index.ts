import { App } from "vue";
import countTo from "./src/countTo";

export const CountTo = Object.assign(countTo, {
  install(app: App) {
    app.component(countTo.name, countTo);
  },
});

export default CountTo;
