import {
  ref,
  unref,
  computed,
  reactive,
  onMounted,
  type CSSProperties,
  getCurrentInstance
} from "vue";
import type { tagsViewsType } from "../types";
import { useRoute, useRouter } from "vue-router";
import { transformI18n, $t } from "@/plugins/i18n";
import { responsiveStorageNameSpace } from "@/config";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  isEqual,
  isBoolean,
  storageLocal,
  toggleClass,
  hasClass
} from "@pureadmin/utils";

import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import CloseAllTags from "@iconify-icons/ri/subtract-line";
import CloseOtherTags from "@iconify-icons/ri/text-spacing";
import CloseRightTags from "@iconify-icons/ri/text-direction-l";
import CloseLeftTags from "@iconify-icons/ri/text-direction-r";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Close from "@iconify-icons/ep/close";

export function useTags() {
  const route = useRoute();
  const router = useRouter();
  const instance = getCurrentInstance();
  const pureSetting = useSettingStoreHook();

  const buttonTop = ref(0);
  const buttonLeft = ref(0);
  const translateX = ref(0);
  const visible = ref(false);
  const activeIndex = ref(-1);
  // 当前右键选中的路由信息
  const currentSelect = ref({});
  const isScrolling = ref(false);

  /** 显示模式，默认灵动模式 */
  const showModel = ref(
    storageLocal().getItem<StorageConfigs>(
      `${responsiveStorageNameSpace()}configure`
    )?.showModel || "smart"
  );
  /** 是否隐藏标签页，默认显示 */
  const showTags =
    ref(
      storageLocal().getItem<StorageConfigs>(
        `${responsiveStorageNameSpace()}configure`
      ).hideTabs
    ) ?? ref("false");
  const multiTags: any = computed(() => {
    return useMultiTagsStoreHook().multiTags;
  });

  const tagsViews = reactive<Array<tagsViewsType>>([
    {
      icon: RefreshRight,
      text: $t("buttons.pureReload"),
      divided: false,
      disabled: false,
      show: true
    },
    {
      icon: Close,
      text: $t("buttons.pureCloseCurrentTab"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseLeftTags,
      text: $t("buttons.pureCloseLeftTabs"),
      divided: true,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseRightTags,
      text: $t("buttons.pureCloseRightTabs"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: CloseOtherTags,
      text: $t("buttons.pureCloseOtherTabs"),
      divided: true,
      disabled: multiTags.value.length > 2 ? false : true,
      show: true
    },
    {
      icon: CloseAllTags,
      text: $t("buttons.pureCloseAllTabs"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: Fullscreen,
      text: $t("buttons.pureContentFullScreen"),
      divided: true,
      disabled: false,
      show: true
    }
  ]);

  function conditionHandle(item, previous, next) {
    if (isBoolean(route?.meta?.showLink) && route?.meta?.showLink === false) {
      if (Object.keys(route.query).length > 0) {
        return isEqual(route.query, item.query) ? previous : next;
      } else {
        return isEqual(route.params, item.params) ? previous : next;
      }
    } else {
      return route.path === item.path ? previous : next;
    }
  }

  const isFixedTag = computed(() => {
    return item => {
      return isBoolean(item?.meta?.fixedTag) && item?.meta?.fixedTag === true;
    };
  });

  const iconIsActive = computed(() => {
    return (item, index) => {
      if (index === 0) return;
      return conditionHandle(item, true, false);
    };
  });

  const linkIsActive = computed(() => {
    return item => {
      return conditionHandle(item, "is-active", "");
    };
  });

  const scheduleIsActive = computed(() => {
    return item => {
      return conditionHandle(item, "schedule-active", "");
    };
  });

  const getTabStyle = computed((): CSSProperties => {
    return {
      transform: `translateX(${translateX.value}px)`,
      transition: isScrolling.value ? "none" : "transform 0.5s ease-in-out"
    };
  });

  const getContextMenuStyle = computed((): CSSProperties => {
    return { left: buttonLeft.value + "px", top: buttonTop.value + "px" };
  });

  const closeMenu = () => {
    visible.value = false;
  };

  /** 鼠标移入添加激活样式 */
  function onMouseenter(index) {
    if (index) activeIndex.value = index;
    if (unref(showModel) === "smart") {
      if (hasClass(instance.refs["schedule" + index][0], "schedule-active"))
        return;
      toggleClass(true, "schedule-in", instance.refs["schedule" + index][0]);
      toggleClass(false, "schedule-out", instance.refs["schedule" + index][0]);
    } else {
      if (hasClass(instance.refs["dynamic" + index][0], "is-active")) return;
      toggleClass(true, "card-in", instance.refs["dynamic" + index][0]);
      toggleClass(false, "card-out", instance.refs["dynamic" + index][0]);
    }
  }

  /** 鼠标移出恢复默认样式 */
  function onMouseleave(index) {
    activeIndex.value = -1;
    if (unref(showModel) === "smart") {
      if (hasClass(instance.refs["schedule" + index][0], "schedule-active"))
        return;
      toggleClass(false, "schedule-in", instance.refs["schedule" + index][0]);
      toggleClass(true, "schedule-out", instance.refs["schedule" + index][0]);
    } else {
      if (hasClass(instance.refs["dynamic" + index][0], "is-active")) return;
      toggleClass(false, "card-in", instance.refs["dynamic" + index][0]);
      toggleClass(true, "card-out", instance.refs["dynamic" + index][0]);
    }
  }

  function onContentFullScreen() {
    pureSetting.hiddenSideBar
      ? pureSetting.changeSetting({ key: "hiddenSideBar", value: false })
      : pureSetting.changeSetting({ key: "hiddenSideBar", value: true });
  }

  onMounted(() => {
    if (!showModel.value) {
      const configure = storageLocal().getItem<StorageConfigs>(
        `${responsiveStorageNameSpace()}configure`
      );
      configure.showModel = "card";
      storageLocal().setItem(
        `${responsiveStorageNameSpace()}configure`,
        configure
      );
    }
  });

  return {
    Close,
    route,
    router,
    visible,
    showTags,
    instance,
    multiTags,
    showModel,
    tagsViews,
    buttonTop,
    buttonLeft,
    translateX,
    isFixedTag,
    pureSetting,
    activeIndex,
    getTabStyle,
    isScrolling,
    iconIsActive,
    linkIsActive,
    currentSelect,
    scheduleIsActive,
    getContextMenuStyle,
    $t,
    closeMenu,
    onMounted,
    onMouseenter,
    onMouseleave,
    transformI18n,
    onContentFullScreen
  };
}
