import { App } from "vue"
import hamBurger from "./src/HamBurger.vue"

export const HamBurger = Object.assign(hamBurger, {
  install(app: App) {
    app.component(hamBurger.name, hamBurger)
  }
})

export default HamBurger