import { App } from "vue";
import countTo from "./src/CountTo";

export const CountTo = Object.assign(countTo, {
  install(app: App) {
    app.component(countTo.name, countTo);
  },
});

export default CountTo;
