import { App } from "vue"
import seamlessScroll from "./src/SeamlessScroll.vue"

export const SeamlessScroll = Object.assign(seamlessScroll, {
  install(app: App) {
    app.component(seamlessScroll.name, seamlessScroll)
  }
})

export default SeamlessScroll