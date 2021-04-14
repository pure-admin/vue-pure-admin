import { App } from "vue"
import flop from "./src/index.vue"

export const Flop = Object.assign(flop, {
  install(app: App) {
    app.component(flop.name, flop)
  }
})

export default Flop