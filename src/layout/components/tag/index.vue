<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <el-scrollbar :vertical="false" class="scroll-container">
      <div
        v-for="(item, index) in dynamicTagList"
        :key="index"
        :class="['scroll-item', $route.path === item.path ? 'active' : '']"
        @contextmenu.prevent.native="openMenu(item, $event)"
      >
        <router-link :to="item.path">{{ $t(item.meta.title) }}</router-link>
        <span v-if="index !== 0 " class="el-icon-close" @click="deleteMenu(item)"></span>
      </div>
    </el-scrollbar>
    <!-- 右键菜单按钮 -->
    <ul
      v-show="visible"
      :style="{ left: buttonLeft + 'px',top: buttonTop + 'px'}"
      class="contextmenu"
    >
      <div v-for="(item,key) in tagsViews" :key="key" style="display:flex; align-items: center;">
        <li v-if="item.show" @click="selectTag(item,key)">
          <span>
            <i :class="item.icon"></i>
          </span>
          {{item.text}}
        </li>
      </div>
    </ul>
    <!-- 右侧功能按钮 -->
    <ul class="right-func">
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
                v-for="(item,key) in tagsViews"
                :key="key"
                :icon="item.icon"
                :divided="item.divided"
                :disabled="item.disabled"
                @click="onClickDrop(key, item)"
              >{{item.text}}</el-dropdown-item>
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

<script lang='ts'>
import { useDynamicRoutesHook } from "./tagsHook";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect, watch, onBeforeMount, unref, nextTick } from "vue";
import { storageLocal } from "/@/utils/storage";
import { emitter } from "/@/utils/mitt";
import { toggleClass, removeClass } from "/@/utils/operate";
import { templateRef } from "@vueuse/core";
import { homeRoute } from "./type";
let refreshDiv = "refresh-div";

export default {
  setup() {
    const {
      deleteDynamicTag,
      dynamicRouteTags,
      dRoutes,
      routesLength
    } = useDynamicRoutesHook();
    const route = useRoute();
    const router = useRouter();
    const showTags = ref(storageLocal.getItem("tagsVal") || false);
    const containerDom = templateRef<HTMLElement | null>("containerDom", null);

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
        disabled: unref(routesLength) > 1 ? false : true,
        show: true
      },
      {
        icon: "el-icon-more",
        text: "关闭其他标签页",
        divided: true,
        disabled: unref(routesLength) > 2 ? false : true,
        show: true
      },
      {
        icon: "el-icon-minus",
        text: "关闭全部标签页",
        divided: false,
        disabled: unref(routesLength) > 1 ? false : true,
        show: true
      }
    ]);

    let visible = ref(false);
    let buttonLeft = ref(0);
    let buttonTop = ref(0);

    // 当前右键选中的路由信息
    let currentSelect = ref({});

    function deleteMenu(item) {
      let tagslen = storageLocal.getItem("routesInStorage").length;
      if (tagslen === 2) {
        Array.from([1, 2, 3]).forEach(v => {
          tagsViews.value[v].disabled = true;
        });
      }
      if (tagslen === 3) {
        tagsViews.value[2].disabled = true;
      }
      deleteDynamicTag(item, route.path);
    }

    // 初始化页面刷新保证当前路由tabview存在
    let stop = watchEffect(() => {
      let parentPath = route.path.slice(0, route.path.lastIndexOf("/"));
      dynamicRouteTags(route.path, parentPath);
    });

    setTimeout(() => {
      // 监听只执行一次，但获取不到当前路由，需要下一个事件轮询中取消监听
      stop();
    });

    function onFresh() {
      toggleClass(true, refreshDiv, document.querySelector(".rotate"));
      const { path, fullPath } = unref(route);
      router.replace({
        path: "/redirect" + fullPath
      });
      setTimeout(() => {
        removeClass(document.querySelector(".rotate"), refreshDiv);
      }, 600);
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
          dRoutes.value = selectRoute
            ? [homeRoute, { path: selectRoute.path, meta: selectRoute.meta }]
            : [homeRoute, { path: route.path, meta: route.meta }];
          storageLocal.setItem("routesInStorage", dRoutes.value);
          tagsViews.value[2].disabled = true;
          if (selectRoute) router.push(selectRoute.path);
          break;
        case 3:
          // 关闭全部标签页
          dRoutes.value = [homeRoute];
          storageLocal.setItem("routesInStorage", dRoutes.value);
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
      buttonTop.value = e.offsetY * 2;
      visible.value = true;
    }

    function closeMenu() {
      visible.value = false;
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
      emitter.on("tagViewsChange", key => {
        if (unref(showTags) === key) return;
        showTags.value = key;
      });

      emitter.on("changLayoutRoute", indexPath => {
        let currentLen = storageLocal.getItem("routesInStorage").length;
        if (currentLen === 1) {
          Array.from([1, 3]).forEach(v => {
            tagsViews.value[v].disabled = false;
          });
        }
        if (currentLen >= 2) {
          Array.from([1, 2, 3]).forEach(v => {
            tagsViews.value[v].disabled = false;
          });
        }
      });
    });

    return {
      dynamicTagList: dRoutes,
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
      currentSelect
    };
  }
};
</script>

<style lang="scss" scoped>
.tags-view {
  width: 100%;
  height: 34px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  .scroll-item {
    border-radius: 3px;
    padding: 2px 8px;
    display: inline-block;
  }
  a {
    text-decoration: none;
    color: #666;
    padding: 0 4px 0 4px;
  }

  .scroll-container {
    text-align: left;
    padding: 5px 0;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    background: #fff;
    border: 0.5px solid rgba($color: #ccc, $alpha: 0.3);
    .scroll-item {
      &:nth-child(1) {
        margin-left: 5px;
      }
    }
  }

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
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

.el-icon-close {
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.el-icon-close:hover {
  background: #b4bccc;
}
.active {
  background: #409eff;
  position: relative;
  color: #fff;
  a {
    color: #fff;
  }
}
:deep(.el-scrollbar__wrap) {
  height: 100vh;
}

.right-func {
  display: flex;
  align-items: center;
  background: #fff;
  border: 0.5px solid rgba($color: #ccc, $alpha: 0.3);
  font-size: 16px;
  li {
    width: 40px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-right: 1px solid #ccc;
    cursor: pointer;
  }
}

.refresh-div {
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
</style>
