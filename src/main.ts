import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 内置ElementPlus
import ElementPlus from 'element-plus'

// 内置国际化语言包
import { createI18n } from 'vue-i18n'
import ch from "./locales/ch.json"
import en from "./locales/en.json"
const i18n = createI18n({
  locale: 'ch', //默认使用中文
  messages: {
    ch,
    en
  }
})

// 导入公共样式
import "./assets/index.css"
// 导入字体图标
import "./assets/iconfont/iconfont.js"
import "./assets/iconfont/iconfont.css"

const app = createApp(App)

app.use(store).use(router).use(i18n).use(ElementPlus).mount('#app')
