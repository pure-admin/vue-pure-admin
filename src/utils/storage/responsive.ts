// 响应式storage
import { App } from "vue";
import Storage from "responsive-storage";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  const configObj = Object.assign(
    {
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
    },
    config.MultiTagsCache
      ? {
          // 默认显示首页tag
          tags: {
            type: Array,
            default: Storage.getData(undefined, "tags") ?? [
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
          }
        }
      : {}
  );

  app.use(Storage, configObj);
};
