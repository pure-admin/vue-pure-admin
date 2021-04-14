import { App } from "vue"
import selector from "./src/Selector"

export const Selector = Object.assign(selector, {
  install(app: App) {
    app.component(selector.name, selector)
  }
})

export default Selector