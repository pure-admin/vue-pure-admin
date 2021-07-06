// 多组件库的国际化和本地项目国际化兼容
import { App } from "vue";
import { createI18n } from "vue-i18n";
import { localesConfigs } from "./config";

export const i18n = createI18n({
  locale: "zh", // set locale
  fallbackLocale: "en", // set fallback locale
  messages: localesConfigs
});

export function usI18n(app: App) {
  app.use(i18n);
}
