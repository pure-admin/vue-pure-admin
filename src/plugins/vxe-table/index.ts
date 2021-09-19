import "xe-utils";
import { App } from "vue";
import { i18n } from "../i18n/index";
import "font-awesome/css/font-awesome.css";
import {
  // 核心
  VXETable,

  // 表格功能
  Header,
  Footer,
  Icon,
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // 可选组件
  Column,
  Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Input,
  Select,
  Optgroup,
  Option,
  Textarea,
  Button,
  Modal,
  List,
  Pulldown,

  // 表格
  Table
} from "vxe-table";

// 全局默认参数
VXETable.setup({
  size: "medium",
  version: 0,
  zIndex: 100,
  table: {
    // 自动监听父元素的变化去重新计算表格
    autoResize: true,
    // 鼠标移到行是否要高亮显示
    highlightHoverRow: true
  },
  input: {
    clearable: true
  },
  // 对组件内置的提示语进行国际化翻译
  // @ts-ignore
  i18n: (key, args) => i18n.global.t(key, args),
  // 可选，对参数中的列头、校验提示..等进行自动翻译（只对支持国际化的有效）
  translate(key, args) {
    // 例如，只翻译 "message." 开头的键值
    if (key && key.indexOf("message.") > -1) {
      return i18n.global.t(key, args);
    }
    if (key && key.indexOf("el.") > -1) {
      return i18n.global.t(key, args);
    }
    return key;
  }
});

export function useTable(app: App) {
  app
    .use(Header)
    .use(Footer)
    .use(Icon)
    .use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)

    // 可选组件
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Switch)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)
    // 安装表格
    .use(Table);
}
