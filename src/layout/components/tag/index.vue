<script setup lang="ts">
import {
  ref,
  watch,
  onBeforeMount,
  unref,
  nextTick,
  computed,
  getCurrentInstance,
  ComputedRef
} from "vue";
import { RouteConfigs, relativeStorageType, tagsViewsType } from "../../types";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import { handleAliveRoute } from "/@/router";
import { storageLocal } from "/@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { toggleClass, removeClass, hasClass } from "/@/utils/operate";

import close from "/@/assets/svg/close.svg";
import refresh from "/@/assets/svg/refresh.svg";
import closeAll from "/@/assets/svg/close_all.svg";
import closeLeft from "/@/assets/svg/close_left.svg";
import closeOther from "/@/assets/svg/close_other.svg";
import closeRight from "/@/assets/svg/close_right.svg";

let refreshButton = "refresh-button";
const instance = getCurrentInstance();

// 响应式storage
let relativeStorage: relativeStorageType;
const route = useRoute();
const router = useRouter();
const showTags = ref(storageLocal.getItem("tagsVal") || false);
const containerDom = templateRef<HTMLElement | null>("containerDom", null);
const activeIndex = ref(-1);
let routerArrays: Array<RouteConfigs> = [
  {
    path: "/welcome",
    parentPath: "/",
    meta: {
      title: "message.hshome",
      icon: "el-icon-s-home",
      showLink: true
    }
  }
];
const tagsViews = ref<Array<tagsViewsType>>([
  {
    icon: refresh,
    text: "message.hsreload",
    divided: false,
    disabled: false,
    show: true
  },
  {
    icon: close,
    text: "message.hscloseCurrentTab",
    divided: false,
    disabled: routerArrays.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeLeft,
    text: "message.hscloseLeftTabs",
    divided: true,
    disabled: routerArrays.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeRight,
    text: "message.hscloseRightTabs",
    divided: false,
    disabled: routerArrays.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeOther,
    text: "message.hscloseOtherTabs",
    divided: true,
    disabled: routerArrays.length > 2 ? false : true,
    show: true
  },
  {
    icon: closeAll,
    text: "message.hscloseAllTabs",
    divided: false,
    disabled: routerArrays.length > 1 ? false : true,
    show: true
  }
]);
const dynamicTagList: ComputedRef<Array<RouteConfigs>> = computed(() => {
  return relativeStorage.routesInStorage;
});

// 显示模式，默认灵动模式显示
const showModel = ref(storageLocal.getItem("showModel") || "smart");
if (!showModel.value) {
  storageLocal.setItem("showModel", "card");
}

let visible = ref(false);
let buttonLeft = ref(0);
let buttonTop = ref(0);

// 当前右键选中的路由信息
let currentSelect = ref({});

function dynamicRouteTag(value: string, parentPath: string): void {
  const hasValue = relativeStorage.routesInStorage.some((item: any) => {
    return item.path === value;
  });

  function concatPath(arr: object[], value: string, parentPath: string) {
    if (!hasValue) {
      arr.forEach((arrItem: any) => {
        let pathConcat = parentPath + arrItem.path;
        if (arrItem.path === value || pathConcat === value) {
          routerArrays.push({
            path: value,
            parentPath: `/${parentPath.split("/")[1]}`,
            meta: arrItem.meta
          });
          relativeStorage.routesInStorage = routerArrays;
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
  const { fullPath } = unref(route);
  router.replace({
    path: "/redirect" + fullPath
  });
  setTimeout(() => {
    removeClass(document.querySelector(".rotate"), refreshButton);
  }, 600);
}

function deleteDynamicTag(obj: any, current: any, tag?: string) {
  let valueIndex: number = routerArrays.findIndex((item: any) => {
    return item.path === obj.path;
  });

  const spliceRoute = (start?: number, end?: number, other?: boolean): void => {
    if (other) {
      relativeStorage.routesInStorage = [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "message.hshome",
            icon: "el-icon-s-home",
            showLink: true
          }
        },
        obj
      ];
      routerArrays = relativeStorage.routesInStorage;
    } else {
      routerArrays.splice(start, end);
      relativeStorage.routesInStorage = routerArrays;
    }
    router.push(obj.path);
    // 删除缓存路由
    handleAliveRoute(route.matched, "delete");
  };

  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else if (tag === "left") {
    spliceRoute(1, valueIndex - 1);
  } else if (tag === "right") {
    spliceRoute(valueIndex + 1, routerArrays.length);
  } else {
    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
  }

  if (current === obj.path) {
    // 如果删除当前激活tag就自动切换到最后一个tag
    let newRoute: any = routerArrays.slice(-1);
    nextTick(() => {
      router.push({
        path: newRoute[0].path
      });
    });
  }
}

function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
}

function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  if (item && item.disabled) return;
  // 当前路由信息
  switch (key) {
    case 0:
      // 重新加载
      onFresh();
      break;
    case 1:
      // 关闭当前标签页
      selectRoute
        ? deleteMenu({ path: selectRoute.path, meta: selectRoute.meta })
        : deleteMenu({ path: route.path, meta: route.meta });
      break;
    case 2:
      // 关闭左侧标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "left"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "left");
      break;
    case 3:
      // 关闭右侧标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "right"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "right");
      break;
    case 4:
      // 关闭其他标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "other"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "other");
      break;
    case 5:
      // 关闭全部标签页
      routerArrays.splice(1, routerArrays.length);
      relativeStorage.routesInStorage = routerArrays;
      usePermissionStoreHook().clearAllCachePage();
      router.push("/welcome");

      break;
  }
  setTimeout(() => {
    showMenuModel(route.fullPath);
  });
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
    tagsViews.value[v].show = value;
  });
}

function disabledMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews.value[v].disabled = value;
  });
}

// 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是首页，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页
function showMenuModel(currentPath: string, refresh = false) {
  let allRoute = unref(relativeStorage.routesInStorage);
  let routeLength = unref(relativeStorage.routesInStorage).length;
  // currentIndex为1时，左侧的菜单是首页，则不显示关闭左侧标签页
  let currentIndex = allRoute.findIndex(v => v.path === currentPath);
  // 如果currentIndex等于routeLength-1，右侧没有菜单，则不显示关闭右侧标签页
  showMenus(true);

  if (refresh) {
    tagsViews.value[0].show = true;
  }

  if (currentIndex === 1 && routeLength !== 2) {
    // 左侧的菜单是首页，右侧存在别的菜单
    tagsViews.value[2].show = false;
    Array.of(1, 3, 4, 5).forEach(v => {
      tagsViews.value[v].disabled = false;
    });
    tagsViews.value[2].disabled = true;
  } else if (currentIndex === 1 && routeLength === 2) {
    disabledMenus(false);
    // 左侧的菜单是首页，右侧不存在别的菜单
    Array.of(2, 3, 4).forEach(v => {
      tagsViews.value[v].show = false;
      tagsViews.value[v].disabled = true;
    });
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    // 当前路由是所有路由中的最后一个
    tagsViews.value[3].show = false;
    Array.of(1, 2, 4, 5).forEach(v => {
      tagsViews.value[v].disabled = false;
    });
    tagsViews.value[3].disabled = true;
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
    tagsViews.value[0].show = true;
  } else if (route.path !== tag.path) {
    // 右键菜单不匹配当前路由，隐藏刷新
    tagsViews.value[0].show = false;
    showMenuModel(tag.path);
  } else if (
    // eslint-disable-next-line no-dupe-else-if
    relativeStorage.routesInStorage.length === 2 &&
    route.path !== tag.path
  ) {
    showMenus(true);
    // 只有两个标签时不显示关闭其他标签页
    tagsViews.value[4].show = false;
  } else if (route.path === tag.path) {
    // 右键当前激活的菜单
    showMenuModel(tag.path, true);
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
  buttonTop.value = e.clientY + 10;
  setTimeout(() => {
    visible.value = true;
  }, 10);
}

// 触发tags标签切换
function tagOnClick(item) {
  showMenuModel(item.path);
}

// 鼠标移入
function onMouseenter(item, index) {
  if (index) activeIndex.value = index;
  if (unref(showModel) === "smart") {
    if (hasClass(instance.refs["schedule" + index], "schedule-active")) return;
    toggleClass(true, "schedule-in", instance.refs["schedule" + index]);
    toggleClass(false, "schedule-out", instance.refs["schedule" + index]);
  } else {
    if (hasClass(instance.refs["dynamic" + index], "card-active")) return;
    toggleClass(true, "card-in", instance.refs["dynamic" + index]);
    toggleClass(false, "card-out", instance.refs["dynamic" + index]);
  }
}

// 鼠标移出
function onMouseleave(item, index) {
  activeIndex.value = -1;
  if (unref(showModel) === "smart") {
    if (hasClass(instance.refs["schedule" + index], "schedule-active")) return;
    toggleClass(false, "schedule-in", instance.refs["schedule" + index]);
    toggleClass(true, "schedule-out", instance.refs["schedule" + index]);
  } else {
    if (hasClass(instance.refs["dynamic" + index], "card-active")) return;
    toggleClass(false, "card-in", instance.refs["dynamic" + index]);
    toggleClass(true, "card-out", instance.refs["dynamic" + index]);
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
  relativeStorage = instance.appContext.app.config.globalProperties.$storage;
  routerArrays = relativeStorage.routesInStorage ?? routerArrays;

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
</script>

<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll-container">
      <div
        v-for="(item, index) in dynamicTagList"
        :key="index"
        :ref="'dynamic' + index"
        :class="[
          'scroll-item is-closable',
          $route.path === item.path ? 'is-active' : '',
          $route.path === item.path && showModel === 'card' ? 'card-active' : ''
        ]"
        @contextmenu.prevent="openMenu(item, $event)"
        @mouseenter.prevent="onMouseenter(item, index)"
        @mouseleave.prevent="onMouseleave(item, index)"
      >
        <router-link :to="item.path" @click="tagOnClick(item)">{{
          $t(item.meta.title)
        }}</router-link>
        <span
          v-if="
            ($route.path === item.path && index !== 0) ||
            (index === activeIndex && index !== 0)
          "
          class="el-icon-close"
          @click="deleteMenu(item)"
        ></span>
        <div
          :ref="'schedule' + index"
          v-if="showModel !== 'card'"
          :class="[$route.path === item.path ? 'schedule-active' : '']"
        ></div>
      </div>
    </el-scrollbar>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="visible"
        :key="Math.random()"
        :style="{ left: buttonLeft + 'px', top: buttonTop + 'px' }"
        class="contextmenu"
      >
        <div
          v-for="(item, key) in tagsViews"
          :key="key"
          style="display: flex; align-items: center"
        >
          <li v-if="item.show" @click="selectTag(key, item)">
            <component :is="item.icon" :key="key" />
            {{ $t(item.text) }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <ul class="right-button">
      <li>
        <i
          :title="$t('message.hsrefreshRoute')"
          class="el-icon-refresh-right rotate"
          @click="onFresh"
        ></i>
      </li>
      <li>
        <el-dropdown trigger="click" placement="bottom-end">
          <i class="el-icon-arrow-down"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in tagsViews"
                :key="key"
                :divided="item.divided"
                :disabled="item.disabled"
                @click="onClickDrop(key, item)"
              >
                <component :is="item.icon" :key="key" />
                {{ $t(item.text) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <slot></slot>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@keyframes scheduleInWidth {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}
@keyframes scheduleOutWidth {
  from {
    width: 100%;
  }

  to {
    width: 0;
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }

  to {
    -moz-transform: rotate(360deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }

  to {
    -o-transform: rotate(360deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.tags-view {
  width: 100%;
  font-size: 14px;
  display: flex;
  box-shadow: 0 0 1px #888;

  .scroll-item {
    border-radius: 3px 3px 0 0;
    padding: 2px 6px;
    display: inline-block;
    position: relative;
    margin-right: 4px;
    height: 28px;
    line-height: 25px;
    transition: all 0.4s;

    .el-icon-close {
      font-size: 10px;
      color: #1890ff;
      cursor: pointer;

      &:hover {
        border-radius: 50%;
        color: #fff;
        background: #b4bccc;
        font-size: 14px;
      }
    }

    &.is-closable:not(:first-child) {
      &:hover {
        padding-right: 8px;
      }
    }
  }

  a {
    text-decoration: none;
    color: #666;
    padding: 0 4px 0 4px;
  }

  .scroll-container {
    padding: 5px 0;
    white-space: nowrap;
    position: relative;
    width: 100%;
    background: #fff;

    .scroll-item {
      &:nth-child(1) {
        margin-left: 5px;
      }
    }

    .scrollbar-wrapper {
      position: absolute;
      height: 40px;
      overflow-x: hidden !important;
    }
  }

  // 右键菜单
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    color: #000000d9;
    font-weight: normal;
    font-size: 13px;
    white-space: nowrap;
    outline: 0;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);

    li {
      width: 100%;
      margin: 0;
      padding: 7px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background: #eee;
      }

      svg {
        display: block;
        margin-right: 0.5em;
      }
    }
  }
}

.right-button {
  display: flex;
  align-items: center;
  background: #fff;
  font-size: 16px;

  li {
    width: 40px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-right: 1px solid #ccc;
    cursor: pointer;
  }
}

.el-dropdown-menu {
  padding: 0;

  li {
    width: 100%;
    margin: 0;
    padding: 0 12px;
    cursor: pointer;
    display: flex;
    align-items: center;

    svg {
      display: block;
      margin-right: 0.5em;
    }
  }
}

.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #606266;
  background: #f0f0f0;
}

:deep(.el-dropdown-menu__item) i {
  margin-right: 10px;
}

.el-dropdown-menu__item--divided::before {
  margin: 0;
}

.el-dropdown-menu__item.is-disabled {
  cursor: not-allowed;
}

.is-active {
  background-color: #eaf4fe;
  position: relative;
  color: #fff;

  a {
    color: #1890ff;
  }
}

// 卡片模式
.card-active {
  border: 1px solid #1890ff;
}
// 卡片模式下鼠标移入显示蓝色边框
.card-in {
  border: 1px solid #1890ff;
  color: #1890ff;

  a {
    color: #1890ff;
  }
}
// 卡片模式下鼠标移出隐藏蓝色边框
.card-out {
  border: none;
  color: #666;

  a {
    color: #666;
  }
}

// 灵动模式
.schedule-active {
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
}
// 灵动模式下鼠标移入显示蓝色进度条
.schedule-in {
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  animation: scheduleInWidth 400ms ease-in;
}
// 灵动模式下鼠标移出隐藏蓝色进度条
.schedule-out {
  width: 0;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  animation: scheduleOutWidth 400ms ease-in;
}
// 刷新按钮动画效果
.refresh-button {
  -webkit-animation: rotate 600ms linear infinite;
  -moz-animation: rotate 600ms linear infinite;
  -o-animation: rotate 600ms linear infinite;
  animation: rotate 600ms linear infinite;
}
</style>
