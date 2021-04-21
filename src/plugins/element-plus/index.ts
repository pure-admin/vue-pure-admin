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
];

const plugins = [ElLoading];

export function useElementPlus(app: App) {
  components.forEach((component) => {
    app.component(component.name, component);
  });
  plugins.forEach((plugin) => {
    app.use(plugin);
  });
}
