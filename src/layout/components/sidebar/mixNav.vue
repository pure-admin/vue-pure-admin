<script setup lang="ts">
import { computed } from "vue";
import { emitter } from "/@/utils/mitt";
import { algorithm } from "/@/utils/algorithm";
import { transformI18n } from "/@/plugins/i18n";
import { useRoute, useRouter } from "vue-router";
import { findIconReg } from "/@/components/ReIcon";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const route = useRoute();
const router = useRouter().options.routes;

const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
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
  findCurrentRoute(algorithm.increaseIndexes(router));
};
</script>

<template>
  <el-menu
    router
    class="container overflow-hidden"
    mode="horizontal"
    :default-active="activeMenu"
    @select="menuSelect"
  >
    <el-menu-item
      v-for="route in usePermissionStoreHook().wholeMenus"
      :key="route.path"
      :index="route.redirect || route.path"
    >
      <template #title>
        <el-icon v-show="route.meta.icon" :class="route.meta.icon">
          <component
            :is="findIconReg(route.meta && route.meta.icon)"
          ></component>
        </el-icon>
        <span>{{ transformI18n(route.meta.title, route.meta.i18n) }}</span>
        <Icon
          v-if="route.meta.extraIcon"
          :svg="route.meta.extraIcon.svg ? true : false"
          :content="`${route.meta.extraIcon.name}`"
        />
      </template>
    </el-menu-item>
  </el-menu>
</template>
<style scoped></style>
