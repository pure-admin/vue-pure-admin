<script setup lang="ts">
import Logo from "./logo.vue";
import { emitter } from "/@/utils/mitt";
import { useNav } from "../../hooks/nav";
import SidebarItem from "./sidebarItem.vue";
import { storageLocal } from "/@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch, onBeforeMount } from "vue";
import { findRouteByPath, getParentPaths } from "/@/router/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const route = useRoute();
const routers = useRouter().options.routes;
const showLogo = ref(
  storageLocal.getItem("responsive-configure")?.showLogo ?? true
);

const { pureApp, isCollapse, menuSelect } = useNav();

let subMenuData = ref([]);

const menuData = computed(() => {
  return pureApp.layout === "mix"
    ? subMenuData.value
    : usePermissionStoreHook().wholeMenus;
});

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

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});

watch(
  () => route.path,
  () => {
    getSubMenuData(route.path);
    menuSelect(route.path, routers);
  }
);
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
        @select="indexPath => menuSelect(indexPath, routers)"
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
