import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { createApp, Directive } from "vue";
import { usI18n } from "../src/plugins/i18n";
import { useTable } from "../src/plugins/vxe-table";
import { useElementPlus } from "../src/plugins/element-plus";

import "animate.css";
// 导入公共样式
import "./style/index.scss";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "v-contextmenu/dist/themes/default.css";

import { setConfig, getConfig } from "./config";
import axios from "axios";

const app = createApp(App);

app.config.globalProperties.$config = getConfig();

// 响应式storage
import Storage from "responsive-storage";
// @ts-ignore
app.use(Storage, {
  // 默认显示首页tag
  routesInStorage: {
    type: Array,
    default: Storage.getData(undefined, "routesInStorage") ?? [
      {
        path: "/welcome",
        parentPath: "/",
        meta: {
          title: "message.hshome",
          icon: "el-icon-s-home",
          showLink: true,
          savedPosition: false
        }
      }
    ]
  },
  // 国际化 默认中文zh
  locale: {
    type: Object,
    default: Storage.getData(undefined, "locale") ?? {
      locale: "zh"
    }
  }
});

// 自定义指令
import * as directives from "/@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 获取项目动态全局配置
export const getServerConfig = async (): Promise<undefined> => {
  return axios({
    baseURL: "",
    method: "get",
    url:
      process.env.NODE_ENV === "production"
        ? "/manages/serverConfig.json"
        : "/serverConfig.json"
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // 自动注入项目配置
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // 设置全局配置
        setConfig($config);
      }
      // 设置全局baseURL
      app.config.globalProperties.$baseUrl = $config.baseURL;
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加serverConfig.json配置文件";
    });
};

getServerConfig().then(async () => {
  setupStore(app);
  app.use(router).use(useElementPlus).use(useTable).use(usI18n);
  await router.isReady();
  app.mount("#app");
});
