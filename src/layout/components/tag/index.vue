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
        <router-link :to="item.path">{{ $t(item.meta.title) }}</router-link>
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
    <ul
      v-show="visible"
      :style="{ left: buttonLeft + 'px', top: buttonTop + 'px' }"
      class="contextmenu"
    >
      <div
        v-for="(item, key) in tagsViews"
        :key="key"
        style="display: flex; align-items: center"
      >
        <li v-if="item.show" @click="selectTag(item, key)">
          <span>
            <i :class="item.icon"></i>
          </span>
          {{ item.text }}
        </li>
      </div>
    </ul>
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
                :icon="item.icon"
                :divided="item.divided"
                :disabled="item.disabled"
                @click="onClickDrop(key, item)"
                >{{ item.text }}</el-dropdown-item
              >
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

<script lang="ts">
import {
  ref,
  watch,
  onBeforeMount,
  unref,
  nextTick,
  getCurrentInstance
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage";
import { emitter } from "/@/utils/mitt";
import { toggleClass, removeClass, hasClass } from "/@/utils/operate";
import { templateRef } from "@vueuse/core";
let refreshButton = "refresh-button";

let routerArrays = [
  {
    path: "/welcome",
    meta: {
      title: "message.hshome",
      icon: "el-icon-s-home",
      showLink: true,
      savedPosition: false
    }
  }
];
export default {
  computed: {
    dynamicTagList() {
      if (
        !this.$storage.routesInStorage ||
        this.$storage.routesInStorage.length === 0
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$storage.routesInStorage = routerArrays;
      }
      return this.$storage.routesInStorage;
    }
  },
  setup() {
    let vm: any;
    let st: any;
    const route = useRoute();
    const router = useRouter();
    const showTags = ref(storageLocal.getItem("tagsVal") || false);
    const containerDom = templateRef<HTMLElement | null>("containerDom", null);
    const activeIndex = ref(-1);
    const tagsViews = ref([
      {
        icon: "el-icon-refresh-right",
        text: "重新加载",
        divided: false,
        disabled: false,
        show: true
      },
      {
        icon: "el-icon-close",
        text: "关闭当前标签页",
        divided: false,
        disabled: routerArrays.length > 1 ? false : true,
        show: true
      },
      {
        icon: "el-icon-more",
        text: "关闭其他标签页",
        divided: true,
        disabled: routerArrays.length > 2 ? false : true,
        show: true
      },
      {
        icon: "el-icon-minus",
        text: "关闭全部标签页",
        divided: false,
        disabled: routerArrays.length > 1 ? false : true,
        show: true
      }
    ]);

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
      const hasValue = st.routesInStorage.some((item: any) => {
        return item.path === value;
      });

      function concatPath(arr: object[], value: string, parentPath: string) {
        if (!hasValue) {
          arr.forEach((arrItem: any) => {
            let pathConcat = parentPath + arrItem.path;
            if (arrItem.path === value || pathConcat === value) {
              routerArrays.push({
                path: value,
                meta: arrItem.meta
              });
              st.routesInStorage = routerArrays;
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

    function deleteDynamicTag(obj: any, current: any, other: any) {
      let valueIndex: number = routerArrays.findIndex((item: any) => {
        return item.path === obj.path;
      });

      if (other) {
        st.routesInStorage = routerArrays = [
          {
            path: "/welcome",
            meta: {
              title: "message.hshome",
              icon: "el-icon-s-home",
              showLink: true,
              savedPosition: false
            }
          },
          obj
        ];
        router.push(obj.path);
        Array.from([2]).forEach(v => {
          tagsViews.value[v].disabled = true;
        });
      } else {
        // 从当前匹配到的路径中删除
        routerArrays.splice(valueIndex, 1);
        st.routesInStorage = routerArrays;
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

    function deleteMenu(item, other = false) {
      if (routerArrays.length === 2) {
        Array.from([1, 2, 3]).forEach(v => {
          tagsViews.value[v].disabled = true;
        });
      }
      if (routerArrays.length === 3) {
        tagsViews.value[2].disabled = true;
      }
      deleteDynamicTag(item, route.path, other);
    }

    function onClickDrop(key, item, selectRoute) {
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
          // 关闭其他标签页
          selectRoute
            ? deleteMenu(
                {
                  path: selectRoute.path,
                  meta: selectRoute.meta
                },
                true
              )
            : deleteMenu({ path: route.path, meta: route.meta }, true);
          break;
        case 3:
          // 关闭全部标签页
          routerArrays.splice(1, routerArrays.length);
          st.routesInStorage = routerArrays;
          router.push("/welcome");
          Array.from([1, 2, 3]).forEach(v => {
            tagsViews.value[v].disabled = true;
          });
          break;
      }
    }

    function selectTag(item, key) {
      onClickDrop(key, {}, currentSelect.value);
    }

    function openMenu(tag, e) {
      if (tag.path === "/welcome") {
        // 右键菜单为首页，只显示刷新
        Array.from([1, 2, 3]).forEach(v => {
          tagsViews.value[v].show = false;
        });
        tagsViews.value[0].show = true;
      } else if (route.path !== tag.path) {
        // 右键菜单匹配当前路由，显示刷新
        tagsViews.value[0].show = false;
        Array.from([1, 2, 3]).forEach(v => {
          tagsViews.value[v].show = true;
        });
      } else if (st.routesInStorage.length === 2) {
        // 只有两个标签时不显示关闭其他标签页
        tagsViews.value[2].show = false;
        Array.from([0, 1, 3]).forEach(v => {
          tagsViews.value[v].show = true;
        });
      } else {
        Array.from([0, 1, 2, 3]).forEach(v => {
          tagsViews.value[v].show = true;
        });
      }

      currentSelect.value = tag;
      const menuMinWidth = 105;
      const offsetLeft = unref(containerDom).getBoundingClientRect().left;
      const offsetWidth = unref(containerDom).offsetWidth;
      const maxLeft = offsetWidth - menuMinWidth;
      const left = e.clientX - offsetLeft + 15;
      if (left > maxLeft) {
        buttonLeft.value = maxLeft;
      } else {
        buttonLeft.value = left;
      }
      buttonTop.value = e.clientY;
      visible.value = true;
    }

    function closeMenu() {
      visible.value = false;
    }

    // 鼠标移入
    function onMouseenter(item, index) {
      if (index) activeIndex.value = index;
      if (unref(showModel) === "smart") {
        if (hasClass(vm.refs["schedule" + index], "schedule-active")) return;
        toggleClass(true, "schedule-in", vm.refs["schedule" + index]);
        toggleClass(false, "schedule-out", vm.refs["schedule" + index]);
      } else {
        if (hasClass(vm.refs["dynamic" + index], "card-active")) return;
        toggleClass(true, "card-in", vm.refs["dynamic" + index]);
        toggleClass(false, "card-out", vm.refs["dynamic" + index]);
      }
    }

    // 鼠标移出
    function onMouseleave(item, index) {
      activeIndex.value = -1;
      if (unref(showModel) === "smart") {
        if (hasClass(vm.refs["schedule" + index], "schedule-active")) return;
        toggleClass(false, "schedule-in", vm.refs["schedule" + index]);
        toggleClass(true, "schedule-out", vm.refs["schedule" + index]);
      } else {
        if (hasClass(vm.refs["dynamic" + index], "card-active")) return;
        toggleClass(false, "card-in", vm.refs["dynamic" + index]);
        toggleClass(true, "card-out", vm.refs["dynamic" + index]);
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
      vm = getCurrentInstance();
      st = vm.appContext.app.config.globalProperties.$storage;

      emitter.on("tagViewsChange", key => {
        if (unref(showTags) === key) return;
        showTags.value = key;
      });

      emitter.on("tagViewsShowModel", key => {
        showModel.value = key;
      });

      //  接收侧边栏切换传递过来的参数
      emitter.on("changLayoutRoute", ({ indexPath, parentPath }) => {
        dynamicRouteTag(indexPath, parentPath);

        if (routerArrays.length === 2) {
          Array.from([1, 3]).forEach(v => {
            tagsViews.value[v].disabled = false;
          });
        }
        if (routerArrays.length > 2) {
          Array.from([1, 2, 3]).forEach(v => {
            tagsViews.value[v].disabled = false;
          });
        }
      });
    });

    return {
      deleteMenu,
      showTags,
      onFresh,
      tagsViews,
      onClickDrop,
      visible,
      buttonLeft,
      buttonTop,
      openMenu,
      closeMenu,
      selectTag,
      currentSelect,
      onMouseenter,
      onMouseleave,
      activeIndex,
      showModel
    };
  }
};
</script>

<style lang="scss" scoped>
.tags-view {
  width: 100%;
  font-size: 14px;
  display: flex;
  box-shadow: 0 0 1px #888888;

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
    font-size: 12px;
    font-weight: 400;
    color: #333;
    li {
      width: 100%;
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
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
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #606266;
  background: #f0f0f0;
}
.el-dropdown-menu__item,
.el-menu-item {
  padding: 0 14px;
  overflow: hidden;
}
:deep(.el-dropdown-menu__item) i {
  margin-right: 10px;
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
@keyframes scheduleInWidth {
  from {
    width: 0px;
  }
  to {
    width: 100%;
  }
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
@keyframes scheduleOutWidth {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}
// 刷新按钮动画效果
.refresh-button {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 600ms;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 600ms;
  -webkit-animation: rotate 600ms linear infinite;
  -moz-animation: rotate 600ms linear infinite;
  -o-animation: rotate 600ms linear infinite;
  animation: rotate 600ms linear infinite;
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
</style>
