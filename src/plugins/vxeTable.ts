import "vxe-table/lib/style.css";
// import "xe-utils";
// import XEUtils from "xe-utils";
import type { App } from "vue";
// import { i18n } from "@/plugins/i18n";
// import zh from "vxe-table/lib/locale/lang/zh-CN";
// import en from "vxe-table/lib/locale/lang/en-US";

import {
  // 全局对象
  VXETable,
  // 表格功能
  // Filter,
  // Edit,
  // Menu,
  // Export,
  // Keyboard,
  // Validator,
  Custom,
  // 可选组件
  Icon,
  Column,
  Grid,
  Pager,
  Select,
  // Colgroup,
  // Tooltip,
  // Toolbar,
  // Form,
  // FormItem,
  // FormGather,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Switch,
  // Input,
  // Optgroup,
  // Option,
  // Textarea,
  // Button,
  // Modal,
  // List,
  // Pulldown,
  // 表格
  Table
} from "vxe-table";

// 全局默认参数
VXETable.setConfig({
  // i18n: (key, args) => {
  //   return unref(i18n.global.locale) === "zh"
  //     ? XEUtils.toFormatString(XEUtils.get(zh, key), args)
  //     : XEUtils.toFormatString(XEUtils.get(en, key), args);
  // },
  // translate(key) {
  //   const NAMESPACED = ["el.", "buttons."];
  //   if (key && NAMESPACED.findIndex(v => key.includes(v)) !== -1) {
  //     return i18n.global.t.call(i18n.global.locale, key);
  //   }
  //   return key;
  // }
});

export function useVxeTable(app: App) {
  // 表格功能
  app
    // .use(Filter)
    // .use(Edit)
    // .use(Menu)
    // .use(Export)
    // .use(Keyboard)
    // .use(Validator)
    .use(Custom)
    // 可选组件
    .use(Icon)
    .use(Column)
    .use(Grid)
    .use(Pager)
    .use(Select)
    // .use(Colgroup)
    // .use(Tooltip)
    // .use(Toolbar)
    // .use(Form)
    // .use(FormItem)
    // .use(FormGather)
    // .use(Checkbox)
    // .use(CheckboxGroup)
    // .use(Radio)
    // .use(RadioGroup)
    // .use(RadioButton)
    // .use(Switch)
    // .use(Input)
    // .use(Optgroup)
    // .use(Option)
    // .use(Textarea)
    // .use(Button)
    // .use(Modal)
    // .use(List)
    // .use(Pulldown)
    // 安装表格
    .use(Table);
}
