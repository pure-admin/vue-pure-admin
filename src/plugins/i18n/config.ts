import { siphonI18n } from "./index";
// vxe-table组件国际化
import zhVxeTable from "vxe-table/lib/locale/lang/zh-CN";
import enVxeTable from "vxe-table/lib/locale/lang/en-US";

// element-plus国际化
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

// 项目内自定义国际化
const zhModules = import.meta.globEager("./zh-CN/**/*.ts");
const enModules = import.meta.globEager("./en/**/*.ts");

export const localesConfigs = {
  zh: {
    ...siphonI18n(zhModules, "zh-CN"),
    ...zhVxeTable,
    ...zhLocale
  },
  en: {
    ...siphonI18n(enModules, "en"),
    ...enVxeTable,
    ...enLocale
  }
};
