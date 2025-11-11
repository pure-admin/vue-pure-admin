import { computed } from "vue";

import { useGlobal } from "@pureadmin/utils";
import { useTags } from "@/layout/hooks/useTag";

const NAVBAR_HEIGHT = 48; // 顶部导航栏高度
const TAGS_HEIGHT_CHROME = 38; // Chrome 模式标签页高度
const TAGS_HEIGHT_DEFAULT = 34; // 默认标签页高度
const FOOTER_HEIGHT = 32; // 页脚高度

/**
 * 获取当前页面内容区的可用高度
 */
export function usePageHeight() {
  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const { showModel } = useTags();

  const hideTabs = computed(() => $storage?.configure.hideTabs);
  const hideFooter = computed(() => $storage?.configure.hideFooter);

  const tagsHeight = computed(() => {
    if (hideTabs.value) return 0;
    return showModel.value === "chrome"
      ? TAGS_HEIGHT_CHROME
      : TAGS_HEIGHT_DEFAULT;
  });

  const footerHeight = computed(() => {
    return hideFooter.value ? 0 : FOOTER_HEIGHT;
  });

  const pageHeight = computed(() => {
    const offset = NAVBAR_HEIGHT + tagsHeight.value + footerHeight.value;
    return `calc(100vh - ${offset}px)`;
  });

  return pageHeight;
}
