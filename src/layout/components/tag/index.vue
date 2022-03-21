<script setup lang="ts">
import {
  ref,
  watch,
  unref,
  reactive,
  nextTick,
  computed,
  ComputedRef,
  CSSProperties,
  onBeforeMount,
  getCurrentInstance
} from "vue";

import close from "/@/assets/svg/close.svg?component";
import refresh from "/@/assets/svg/refresh.svg?component";
import closeAll from "/@/assets/svg/close_all.svg?component";
import closeLeft from "/@/assets/svg/close_left.svg?component";
import closeOther from "/@/assets/svg/close_other.svg?component";
import closeRight from "/@/assets/svg/close_right.svg?component";

import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import { storageLocal } from "/@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { isEqual, isEmpty } from "lodash-unified";
import { transformI18n, $t } from "/@/plugins/i18n";
import { RouteConfigs, tagsViewsType } from "../../types";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { handleAliveRoute, delAliveRoutes } from "/@/router/utils";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { toggleClass, removeClass, hasClass } from "/@/utils/operate";
import { templateRef, useResizeObserver, useDebounceFn } from "@vueuse/core";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const translateX = ref<number>(0);
const activeIndex = ref<number>(-1);
let refreshButton = "refresh-button";
const instance = getCurrentInstance();
const pureSetting = useSettingStoreHook();
const tabDom = templateRef<HTMLElement | null>("tabDom", null);
const containerDom = templateRef<HTMLElement | null>("containerDom", null);
const scrollbarDom = templateRef<HTMLElement | null>("scrollbarDom", null);
const showTags =
  ref(storageLocal.getItem("responsive-configure").hideTabs) ?? "false";
let multiTags: ComputedRef<Array<RouteConfigs>> = computed(() => {
  return useMultiTagsStoreHook()?.multiTags;
});

const linkIsActive = computed(() => {
  return item => {
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return "is-active";
      } else {
        return "";
      }
    } else {
      if (isEqual(route?.query, item?.query)) {
        return "is-active";
      } else {
        return "";
      }
    }
  };
});

const scheduleIsActive = computed(() => {
  return item => {
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return "schedule-active";
      } else {
        return "";
      }
    } else {
      if (isEqual(route?.query, item?.query)) {
        return "schedule-active";
      } else {
        return "";
      }
    }
  };
});

const iconIsActive = computed(() => {
  return (item, index) => {
    if (index === 0) return;
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return true;
      } else {
        return false;
      }
    } else {
      if (isEqual(route?.query, item?.query)) {
        return true;
      } else {
        return false;
      }
    }
  };
});

const dynamicTagView = () => {
  const index = multiTags.value.findIndex(item => {
    if (item?.query) {
      return isEqual(route?.query, item?.query);
    } else {
      return item.path === route.path;
    }
  });
  moveToView(index);
};

watch([route], () => {
  activeIndex.value = -1;
  dynamicTagView();
});

useResizeObserver(
  scrollbarDom,
  useDebounceFn(() => {
    dynamicTagView();
  }, 200)
);

const tabNavPadding = 10;
const moveToView = (index: number): void => {
  if (!instance.refs["dynamic" + index]) {
    return;
  }
  const tabItemEl = instance.refs["dynamic" + index][0];
  const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft;
  const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth;
  // 标签页导航栏可视长度（不包含溢出部分）
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value?.offsetWidth
    : 0;
  // 已有标签页总长度（包含溢出部分）
  const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0;

  if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
    translateX.value = 0;
  } else if (tabItemElOffsetLeft < -translateX.value) {
    // 标签在可视区域左侧
    translateX.value = -tabItemElOffsetLeft + tabNavPadding;
  } else if (
    tabItemElOffsetLeft > -translateX.value &&
    tabItemElOffsetLeft + tabItemOffsetWidth <
      -translateX.value + scrollbarDomWidth
  ) {
    // 标签在可视区域
    translateX.value = Math.min(
      0,
      scrollbarDomWidth -
        tabItemOffsetWidth -
        tabItemElOffsetLeft -
        tabNavPadding
    );
  } else {
    // 标签在可视区域右侧
    translateX.value = -(
      tabItemElOffsetLeft -
      (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth)
    );
  }
};

const handleScroll = (offset: number): void => {
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value?.offsetWidth
    : 0;
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else {
    if (scrollbarDomWidth < tabDomWidth) {
      if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
        translateX.value = Math.max(
          translateX.value + offset,
          scrollbarDomWidth - tabDomWidth
        );
      }
    } else {
      translateX.value = 0;
    }
  }
};

const tagsViews = reactive<Array<tagsViewsType>>([
  {
    icon: refresh,
    text: $t("buttons.hsreload"),
    divided: false,
    disabled: false,
    show: true
  },
  {
    icon: close,
    text: $t("buttons.hscloseCurrentTab"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeLeft,
    text: $t("buttons.hscloseLeftTabs"),
    divided: true,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeRight,
    text: $t("buttons.hscloseRightTabs"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeOther,
    text: $t("buttons.hscloseOtherTabs"),
    divided: true,
    disabled: multiTags.value.length > 2 ? false : true,
    show: true
  },
  {
    icon: closeAll,
    text: $t("buttons.hscloseAllTabs"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  }
]);

// 显示模式，默认灵动模式显示
const showModel = ref(
  storageLocal.getItem("responsive-configure")?.showModel || "smart"
);
if (!showModel.value) {
  const configure = storageLocal.getItem("responsive-configure");
  configure.showModel = "card";
  storageLocal.setItem("responsive-configure", configure);
}

let visible = ref(false);
let buttonLeft = ref(0);
let buttonTop = ref(0);

// 当前右键选中的路由信息
let currentSelect = ref({});

function dynamicRouteTag(value: string, parentPath: string): void {
  const hasValue = multiTags.value.some(item => {
    return item.path === value;
  });

  function concatPath(arr: object[], value: string, parentPath: string) {
    if (!hasValue) {
      arr.forEach((arrItem: any) => {
        let pathConcat = parentPath + arrItem.path;
        if (arrItem.path === value || pathConcat === value) {
          useMultiTagsStoreHook().handleTags("push", {
            path: value,
            parentPath: `/${parentPath.split("/")[1]}`,
            meta: arrItem.meta,
            name: arrItem.name
          });
        } else {
          if (arrItem.children && arrItem.children.length > 0) {
            concatPath(arrItem.children, value, parentPath);
          }
        }
      });
    }
  }
  concatPath(router.options.routes, value, parentPath);
}

// 重新加载
function onFresh() {
  toggleClass(true, refreshButton, document.querySelector(".rotate"));
  const { fullPath, query } = unref(route);
  router.replace({
    path: "/redirect" + fullPath,
    query: query
  });
  setTimeout(() => {
    removeClass(document.querySelector(".rotate"), refreshButton);
  }, 600);
}

function deleteDynamicTag(obj: any, current: any, tag?: string) {
  // 存放被删除的缓存路由
  let delAliveRouteList = [];
  let valueIndex: number = multiTags.value.findIndex((item: any) => {
    if (item.query) {
      if (item.path === obj.path) {
        return item.query === obj.query;
      }
    } else {
      return item.path === obj.path;
    }
  });

  const spliceRoute = (
    startIndex?: number,
    length?: number,
    other?: boolean
  ): void => {
    if (other) {
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "menus.hshome",
            i18n: true,
            icon: "home-filled"
          }
        },
        obj
      ]);
    } else {
      // @ts-ignore
      delAliveRouteList = useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex,
        length
      });
    }
  };

  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else if (tag === "left") {
    spliceRoute(1, valueIndex - 1);
  } else if (tag === "right") {
    spliceRoute(valueIndex + 1, multiTags.value.length);
  } else {
    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
  }
  let newRoute = useMultiTagsStoreHook().handleTags("slice");
  if (current === route.path) {
    // 删除缓存路由
    tag
      ? delAliveRoutes(delAliveRouteList)
      : handleAliveRoute(route.matched, "delete");
    // 如果删除当前激活tag就自动切换到最后一个tag
    if (tag === "left") return;
    nextTick(() => {
      router.push({
        path: newRoute[0].path,
        query: newRoute[0].query
      });
    });
  } else {
    // 删除缓存路由
    tag ? delAliveRoutes(delAliveRouteList) : delAliveRoutes([obj]);
    if (!multiTags.value.length) return;
    let isHasActiveTag = multiTags.value.some(item => {
      return item.path === route.path;
    });
    !isHasActiveTag &&
      router.push({
        path: newRoute[0].path,
        query: newRoute[0].query
      });
  }
}

function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
}

function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  if (item && item.disabled) return;

  let selectTagRoute;
  if (selectRoute) {
    selectTagRoute = {
      path: selectRoute.path,
      meta: selectRoute.meta,
      name: selectRoute.name,
      query: selectRoute.query
    };
  } else {
    selectTagRoute = { path: route.path, meta: route.meta };
  }

  // 当前路由信息
  switch (key) {
    case 0:
      // 重新加载
      onFresh();
      break;
    case 1:
      // 关闭当前标签页
      deleteMenu(selectTagRoute);
      break;
    case 2:
      // 关闭左侧标签页
      deleteMenu(selectTagRoute, "left");
      break;
    case 3:
      // 关闭右侧标签页
      deleteMenu(selectTagRoute, "right");
      break;
    case 4:
      // 关闭其他标签页
      deleteMenu(selectTagRoute, "other");
      break;
    case 5:
      // 关闭全部标签页
      useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex: 1,
        length: multiTags.value.length
      });
      usePermissionStoreHook().clearAllCachePage();
      router.push("/welcome");
      break;
  }
  setTimeout(() => {
    showMenuModel(route.fullPath, route.query);
  });
}

function handleCommand(command: object) {
  // @ts-expect-error
  const { key, item } = command;
  onClickDrop(key, item);
}

// 触发右键中菜单的点击事件
function selectTag(key, item) {
  onClickDrop(key, item, currentSelect.value);
}

function closeMenu() {
  visible.value = false;
}

function showMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews[v].show = value;
  });
}

function disabledMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews[v].disabled = value;
  });
}

// 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是首页，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页
function showMenuModel(
  currentPath: string,
  query: object = {},
  refresh = false
) {
  let allRoute = multiTags.value;
  let routeLength = multiTags.value.length;
  let currentIndex = -1;
  if (isEmpty(query)) {
    currentIndex = allRoute.findIndex(v => v.path === currentPath);
  } else {
    currentIndex = allRoute.findIndex(v => isEqual(v.query, query));
  }

  showMenus(true);

  if (refresh) {
    tagsViews[0].show = true;
  }

  /**
   * currentIndex为1时，左侧的菜单是首页，则不显示关闭左侧标签页
   * 如果currentIndex等于routeLength-1，右侧没有菜单，则不显示关闭右侧标签页
   */
  if (currentIndex === 1 && routeLength !== 2) {
    // 左侧的菜单是首页，右侧存在别的菜单
    tagsViews[2].show = false;
    Array.of(1, 3, 4, 5).forEach(v => {
      tagsViews[v].disabled = false;
    });
    tagsViews[2].disabled = true;
  } else if (currentIndex === 1 && routeLength === 2) {
    disabledMenus(false);
    // 左侧的菜单是首页，右侧不存在别的菜单
    Array.of(2, 3, 4).forEach(v => {
      tagsViews[v].show = false;
      tagsViews[v].disabled = true;
    });
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    // 当前路由是所有路由中的最后一个
    tagsViews[3].show = false;
    Array.of(1, 2, 4, 5).forEach(v => {
      tagsViews[v].disabled = false;
    });
    tagsViews[3].disabled = true;
  } else if (currentIndex === 0 || currentPath === "/redirect/welcome") {
    // 当前路由为首页
    disabledMenus(true);
  } else {
    disabledMenus(false);
  }
}

function openMenu(tag, e) {
  closeMenu();
  if (tag.path === "/welcome") {
    // 右键菜单为首页，只显示刷新
    showMenus(false);
    tagsViews[0].show = true;
  } else if (route.path !== tag.path) {
    // 右键菜单不匹配当前路由，隐藏刷新
    tagsViews[0].show = false;
    showMenuModel(tag.path, tag.query);
  } else if (
    // eslint-disable-next-line no-dupe-else-if
    multiTags.value.length === 2 &&
    route.path !== tag.path
  ) {
    showMenus(true);
    // 只有两个标签时不显示关闭其他标签页
    tagsViews[4].show = false;
  } else if (route.path === tag.path) {
    // 右键当前激活的菜单
    showMenuModel(tag.path, tag.query, true);
  }

  currentSelect.value = tag;
  const menuMinWidth = 105;
  const offsetLeft = unref(containerDom).getBoundingClientRect().left;
  const offsetWidth = unref(containerDom).offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 5;
  if (left > maxLeft) {
    buttonLeft.value = maxLeft;
  } else {
    buttonLeft.value = left;
  }
  pureSetting.hiddenSideBar
    ? (buttonTop.value = e.clientY)
    : (buttonTop.value = e.clientY - 40);
  setTimeout(() => {
    visible.value = true;
  }, 10);
}

// 触发tags标签切换
function tagOnClick(item) {
  router.push({
    path: item?.path,
    query: item?.query
  });
  showMenuModel(item?.path, item?.query);
}

// 鼠标移入
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

// 鼠标移出
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

watch(
  () => visible.value,
  val => {
    if (val) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  }
);

onBeforeMount(() => {
  if (!instance) return;

  // 根据当前路由初始化操作标签页的禁用状态
  showMenuModel(route.fullPath);

  // 触发隐藏标签页
  emitter.on("tagViewsChange", key => {
    if (unref(showTags) === key) return;
    showTags.value = key;
  });

  // 改变标签风格
  emitter.on("tagViewsShowModel", key => {
    showModel.value = key;
  });

  //  接收侧边栏切换传递过来的参数
  emitter.on("changLayoutRoute", ({ indexPath, parentPath }) => {
    dynamicRouteTag(indexPath, parentPath);
    setTimeout(() => {
      showMenuModel(indexPath);
    });
  });
});

const getTabStyle = computed((): CSSProperties => {
  return {
    transform: `translateX(${translateX.value}px)`
  };
});

const getContextMenuStyle = computed((): CSSProperties => {
  return { left: buttonLeft.value + "px", top: buttonTop.value + "px" };
});
</script>

<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <div class="arrow-left">
      <IconifyIconOffline icon="arrow-left-s-line" @click="handleScroll(200)" />
    </div>
    <div ref="scrollbarDom" class="scroll-container">
      <div class="tab" ref="tabDom" :style="getTabStyle">
        <div
          :ref="'dynamic' + index"
          v-for="(item, index) in multiTags"
          :key="index"
          :class="[
            'scroll-item is-closable',
            linkIsActive(item),
            $route.path === item.path && showModel === 'card'
              ? 'card-active'
              : ''
          ]"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(index)"
          @mouseleave.prevent="onMouseleave(index)"
          @click="tagOnClick(item)"
        >
          <router-link :to="item.path"
            >{{ transformI18n(item.meta.title, item.meta.i18n) }}
          </router-link>
          <span
            v-if="
              iconIsActive(item, index) ||
              (index === activeIndex && index !== 0)
            "
            class="el-icon-close"
            @click.stop="deleteMenu(item)"
          >
            <IconifyIconOffline icon="close-bold" />
          </span>
          <div
            :ref="'schedule' + index"
            v-if="showModel !== 'card'"
            :class="[scheduleIsActive(item)]"
          />
        </div>
      </div>
    </div>
    <span class="arrow-right">
      <IconifyIconOffline
        icon="arrow-right-s-line"
        @click="handleScroll(-200)"
      />
    </span>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="visible"
        :key="Math.random()"
        :style="getContextMenuStyle"
        class="contextmenu"
      >
        <div
          v-for="(item, key) in tagsViews"
          :key="key"
          style="display: flex; align-items: center"
        >
          <li v-if="item.show" @click="selectTag(key, item)">
            <component :is="item.icon" :key="key" />
            {{ t(item.text) }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <ul class="right-button">
      <li>
        <span
          :title="t('buttons.hsrefreshRoute')"
          class="el-icon-refresh-right rotate"
          @click="onFresh"
        >
          <IconifyIconOffline icon="refresh-right" />
        </span>
      </li>
      <li>
        <el-dropdown
          trigger="click"
          placement="bottom-end"
          @command="handleCommand"
        >
          <IconifyIconOffline icon="arrow-down" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in tagsViews"
                :key="key"
                :command="{ key, item }"
                :divided="item.divided"
                :disabled="item.disabled"
              >
                <component
                  :is="item.icon"
                  :key="key"
                  style="margin-right: 6px"
                />
                {{ t(item.text) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <slot />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
