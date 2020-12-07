import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 内置ElementPlus
import ElementPlus from 'element-plus'

// 导入公共样式
import "./assets/index.css"

const app = createApp(App)

app.use(store).use(router).use(ElementPlus).mount('#app')
