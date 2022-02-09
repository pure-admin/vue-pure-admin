<script setup lang="ts">
import Logo from "./logo.vue";
import { emitter } from "/@/utils/mitt";
import SidebarItem from "./sidebarItem.vue";
import { storageLocal } from "/@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { useAppStoreHook } from "/@/store/modules/app";
import { ref, computed, watch, onBeforeMount } from "vue";
import { findRouteByPath, getParentPaths } from "/@/router/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const route = useRoute();
const pureApp = useAppStoreHook();
const router = useRouter().options.routes;
const showLogo = ref(
  storageLocal.getItem("responsive-configure")?.showLogo ?? true
);

const isCollapse = computed(() => {
  return !pureApp.getSidebarStatus;
});

let subMenuData = ref([]);

function getSubMenuData(path) {
  // path的上级路由组成的数组
  const parentPathArr = getParentPaths(
    path,
    usePermissionStoreHook().wholeMenus
  );
  // 当前路由的父级路由信息
  const parenetRoute = findRouteByPath(
    parentPathArr[0] || path,
    usePermissionStoreHook().wholeMenus
  );
  if (!parenetRoute?.children) return;
  subMenuData.value = parenetRoute?.children;
}

getSubMenuData(route.path);

watch(
  () => route.path,
  () => getSubMenuData(route.path)
);

const menuData = computed(() => {
  return pureApp.layout === "mix"
    ? subMenuData.value
    : usePermissionStoreHook().wholeMenus;
});

const menuSelect = (indexPath: string): void => {
  let parentPath = "";
  let parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  // 找到当前路由的信息
  // eslint-disable-next-line no-inner-declarations
  function findCurrentRoute(routes) {
    return routes.map(item => {
      if (item.path === indexPath) {
        // 切换左侧菜单 通知标签页
        emitter.emit("changLayoutRoute", {
          indexPath,
          parentPath
        });
      } else {
        if (item.children) findCurrentRoute(item.children);
      }
    });
  }
  findCurrentRoute(router);
};

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});
</script>

<template>
  <div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        unique-opened
        router
        :collapse-transition="false"
        mode="vertical"
        class="outer-most"
        @select="menuSelect"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          class="outer-most"
          :base-path="routes.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
