import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import EnclosureHttp from "./utils/http"

// 内置ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// 导入公共样式
import './assets/index.css'

const app = createApp(App)

// 全局注册Axios
// app.config.globalProperties.$http = new EnclosureHttp()

app.use(store).use(router).use(ElementPlus).mount('#app')
