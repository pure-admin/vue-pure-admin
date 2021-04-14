import { App } from "vue"
import breadCrumb from "./src/BreadCrumb.vue"

export const BreadCrumb = Object.assign(breadCrumb, {
  install(app: App) {
    app.component(breadCrumb.name, breadCrumb)
  }
})

export default BreadCrumb