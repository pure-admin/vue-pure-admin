// 多组件库的国际化和本地项目国际化兼容
import { App } from "vue";
import { createI18n } from "vue-i18n";
import { localesConfigs } from "./config";
import { storageLocal } from "/@/utils/storage";

export const i18n = createI18n({
  locale: storageLocal.getItem("responsive-locale")?.locale ?? "zh",
  fallbackLocale: "en",
  messages: localesConfigs
});

export function usI18n(app: App) {
  app.use(i18n);
}

/**
 * 国际化转换工具函数
 * @param message message
 * @param isI18n  如果true,获取对应的消息,否则返回本身
 * @returns message
 */
export function transformI18n(message: string | object = "", isI18n = false) {
  if (!message) {
    return "";
  }

  // 处理存储动态路由的title,格式 {zh:"",en:""}
  if (typeof message === "object") {
    return message[i18n.global?.locale];
  }

  if (isI18n) {
    //@ts-ignore
    return i18n.global.tc.call(i18n.global, message);
  } else {
    return message;
  }
}
