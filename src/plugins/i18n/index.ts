// 多组件库的国际化和本地项目国际化兼容
import { App } from "vue";
import { set } from "lodash-es";
import { createI18n } from "vue-i18n";
import { localesConfigs } from "./config";
import { storageLocal } from "/@/utils/storage";

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

/**
 * 从模块中抽取国际化
 * @param langs 存放国际化模块
 * @param prefix 语言 默认 zh-CN
 * @returns obj 格式：{模块名.**}
 */
export function siphonI18n(
  langs: Record<string, Record<string, any>>,
  prefix = "zh-CN"
) {
  const langsObj: Recordable = {};
  Object.keys(langs).forEach((key: string) => {
    let fileName = key.replace(`./${prefix}/`, "").replace(/^\.\//, "");
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
    const keyList = fileName.split("/");
    const moduleName = keyList.shift();
    const objKey = keyList.join(".");
    const langFileModule = langs[key].default;

    if (moduleName) {
      if (objKey) {
        set(langsObj, moduleName, langsObj[moduleName] || {});
        set(langsObj[moduleName], objKey, langFileModule);
      } else {
        set(langsObj, moduleName, langFileModule || {});
      }
    }
  });
  return langsObj;
}

// 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除
export const $t = (key: string) => key;

export const i18n = createI18n({
  locale: storageLocal.getItem("responsive-locale")?.locale ?? "zh",
  fallbackLocale: "en",
  messages: localesConfigs
});

export function usI18n(app: App) {
  app.use(i18n);
}
