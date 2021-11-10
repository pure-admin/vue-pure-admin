import { App, Component } from "vue";
import {
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElLoading,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch
} from "element-plus";

// https://element-plus.org/zh-CN/component/icon.html
import {
  Check,
  Menu,
  HomeFilled,
  SetUp,
  Edit,
  Setting,
  Lollipop,
  Link,
  Position,
  Histogram,
  RefreshRight,
  ArrowDown,
  Close,
  CloseBold
} from "@element-plus/icons";

const components = [
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,

  // icon
  Check,
  Menu,
  HomeFilled,
  SetUp,
  Edit,
  Setting,
  Lollipop,
  Link,
  Position,
  Histogram,
  RefreshRight,
  ArrowDown,
  Close,
  CloseBold
];

const plugins = [ElLoading];

export function useElementPlus(app: App) {
  components.forEach((component: Component) => {
    app.component(component.name, component);
  });
  plugins.forEach(plugin => {
    app.use(plugin);
  });
}
