import {
  ref,
  unref,
  watch,
  computed,
  reactive,
  onMounted,
  CSSProperties,
  getCurrentInstance
} from "vue";
import { tagsViewsType } from "../types";
import { isEqual } from "lodash-unified";
import type { StorageConfigs } from "/#/index";
import { useEventListener } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { transformI18n, $t } from "@/plugins/i18n";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { storageLocal, toggleClass, hasClass } from "@pureadmin/utils";

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

  /** 显示模式，默认灵动模式 */
  const showModel = ref(
    storageLocal.getItem<StorageConfigs>("responsive-configure")?.showModel ||
      "smart"
  );
  /** 是否隐藏标签页，默认显示 */
  const showTags =
    ref(
      storageLocal.getItem<StorageConfigs>("responsive-configure").hideTabs
    ) ?? ref("false");
  const multiTags: any = computed(() => {
    return useMultiTagsStoreHook().multiTags;
  });

  const tagsViews = reactive<Array<tagsViewsType>>([
    {
      icon: "refresh-right",
      text: $t("buttons.hsreload"),
      divided: false,
      disabled: false,
      show: true
    },
    {
      icon: "close",
      text: $t("buttons.hscloseCurrentTab"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: "close-left-tags",
      text: $t("buttons.hscloseLeftTabs"),
      divided: true,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: "close-right-tags",
      text: $t("buttons.hscloseRightTabs"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: "close-other-tags",
      text: $t("buttons.hscloseOtherTabs"),
      divided: true,
      disabled: multiTags.value.length > 2 ? false : true,
      show: true
    },
    {
      icon: "close-all-tags",
      text: $t("buttons.hscloseAllTabs"),
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: "fullscreen",
      text: $t("buttons.hswholeFullScreen"),
      divided: true,
      disabled: false,
      show: true
    },
    {
      icon: "fullscreen",
      text: $t("buttons.hscontentFullScreen"),
      divided: false,
      disabled: false,
      show: true
    }
  ]);

  function conditionHandle(item, previous, next) {
    if (
      Object.keys(route.query).length === 0 &&
      Object.keys(route.params).length === 0
    ) {
      return route.path === item.path ? previous : next;
    } else if (Object.keys(route.query).length > 0) {
      return isEqual(route.query, item.query) ? previous : next;
    } else {
      return isEqual(route.params, item.params) ? previous : next;
    }
  }

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
      transform: `translateX(${translateX.value}px)`
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
      if (hasClass(instance.refs["dynamic" + index][0], "card-active")) return;
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
      if (hasClass(instance.refs["dynamic" + index][0], "card-active")) return;
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
      const configure = storageLocal.getItem<StorageConfigs>(
        "responsive-configure"
      );
      configure.showModel = "card";
      storageLocal.setItem("responsive-configure", configure);
    }
  });

  watch(
    () => visible.value,
    () => {
      useEventListener(document, "click", closeMenu);
    }
  );

  return {
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
    pureSetting,
    activeIndex,
    getTabStyle,
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
