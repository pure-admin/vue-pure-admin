import { App } from "vue";
import {
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubmenu,
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
} from "element-plus";

const components = [
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubmenu,
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
];

const plugins = [ElLoading];

import ElementLocale from "element-plus/lib/locale";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";
ElementLocale.use(zhLocale);

export function useElementPlus(app: App) {
  components.forEach((component) => {
    app.component(component.name, component);
  });
  plugins.forEach((plugin) => {
    app.use(plugin);
  });
}
