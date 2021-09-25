import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { getServerConfig } from "./config";
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

const app = createApp(App);

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
  },
  // layout模式以及主题
  layout: {
    type: Object,
    default: Storage.getData(undefined, "layout") ?? {
      layout: {
        model: "vertical",
        theme: "dark"
      }
    }
  }
});

// 自定义指令
import * as directives from "/@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

getServerConfig(app).then(async () => {
  setupStore(app);
  app.use(router).use(useElementPlus).use(useTable).use(usI18n);
  await router.isReady();
  app.mount("#app");
});
