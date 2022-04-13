import { App } from "vue";
import reCard from "./src/index.vue";

export const ReCard = Object.assign(reCard, {
  install(app: App) {
    app.component(reCard.name, reCard);
  }
});

export default ReCard;
