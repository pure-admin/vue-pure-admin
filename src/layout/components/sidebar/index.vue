<template>
  <div :class="{ 'has-logo': showLogo }">
    <Logo v-if="showLogo === '1'" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        :collapse-transition="false"
        mode="vertical"
        @select="menuSelect"
      >
        <sidebar-item
          v-for="route in routeStore.wholeRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStoreHook } from "/@/store/modules/app";
import SidebarItem from "./SidebarItem.vue";
import { algorithm } from "/@/utils/algorithm";
import { emitter } from "/@/utils/mitt";
import Logo from "./Logo.vue";
import { storageLocal } from "/@/utils/storage";
import { usePermissionStoreHook } from "/@/store/modules/permission";

export default defineComponent({
  name: "sidebar",
  components: { SidebarItem, Logo },
  setup() {
    const routeStore = usePermissionStoreHook();

    const router = useRouter().options.routes;

    const pureApp = useAppStoreHook();

    const route = useRoute();

    const showLogo = ref(storageLocal.getItem("logoVal") || "1");

    const activeMenu = computed(() => {
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });

    const menuSelect = (indexPath: string): void => {
      let parentPath = "";
      let parentPathIndex = indexPath.lastIndexOf("/");
      if (parentPathIndex > 0) {
        parentPath = indexPath.slice(0, parentPathIndex);
      }
      // 找到当前路由的信息
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
      findCurrentRoute(algorithm.increaseIndexes(router));
    };

    onBeforeMount(() => {
      emitter.on("logoChange", key => {
        showLogo.value = key;
      });
    });

    return {
      activeMenu,
      isCollapse: computed(() => !pureApp.getSidebarStatus),
      menuSelect,
      showLogo,
      routeStore
    };
  }
});
</script>
