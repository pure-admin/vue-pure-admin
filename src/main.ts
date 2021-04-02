import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { TroisJSVuePlugin } from 'troisjs'

// 内置ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// 内置vxe-table
import "font-awesome/css/font-awesome.css"
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

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
import './style/index.scss'
// 导入字体图标
import "./assets/iconfont/iconfont.js"
import "./assets/iconfont/iconfont.css"

import { setConfig, getConfig } from "./config"
import axios from 'axios'

const app = createApp(App)
app.config.globalProperties.$config = getConfig()

// import vConsole from 'vconsole'
// app.config.globalProperties.$vConsole = new vConsole()

// 获取项目动态全局配置
export const getServerConfig = async (): Promise<any> => {
  return axios({
    baseURL: "",
    method: "get",
    url: process.env.NODE_ENV === 'production' ? "/manages/serverConfig.json" : "/serverConfig.json"
  }).then(({ data: config }) => {
    let $config = app.config.globalProperties.$config
    // 自动注入项目配置
    if (app && $config && typeof config === "object") {
      $config = Object.assign($config, config)
      app.config.globalProperties.$config = $config
      // 设置全局配置
      setConfig($config)
    }
    // 设置全局baseURL
    app.config.globalProperties.$baseUrl = $config.baseURL
    return $config
  }).catch(() => { throw "请在public文件夹下添加serverConfig.json配置文件" })
}

getServerConfig().then(() => {
  app
    .use(store)
    .use(router)
    .use(i18n)
    .use(ElementPlus)
    .use(VXETable)
    .use(TroisJSVuePlugin)
    .mount('#app')
})


