// 响应式storage
import { App } from "vue";
import Storage from "responsive-storage";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
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
            i18n: true,
            icon: "HomeFilled",
            showLink: true
          }
        }
      ]
    },
    // 国际化 默认中文zh
    locale: {
      type: Object,
      default: Storage.getData(undefined, "locale") ?? {
        locale: config.Locale ?? "zh"
      }
    },
    // layout模式以及主题
    layout: {
      type: Object,
      default: Storage.getData(undefined, "layout") ?? {
        layout: config.Layout ?? "vertical",
        theme: config.Theme ?? "default"
      }
    },
    sets: {
      type: Object,
      default: Storage.getData(undefined, "sets") ?? {
        grey: config.Grey ?? false,
        weak: config.Weak ?? false,
        hideTabs: config.HideTabs ?? false
      }
    }
  });
};
