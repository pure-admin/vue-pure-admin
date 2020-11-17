import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import EnclosureHttp from "./api/utils/core"

const app = createApp(App)

// 全局注册Axios
app.config.globalProperties.$http = new EnclosureHttp()

app.use(store).use(router).mount('#app')
