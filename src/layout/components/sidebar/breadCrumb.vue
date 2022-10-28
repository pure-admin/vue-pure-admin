<script setup lang="ts">
import { isEqual } from "lodash-unified";
import { transformI18n } from "@/plugins/i18n";
import { ref, watch, onMounted, toRaw } from "vue";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";

const route = useRoute();
const levelList = ref([]);
const router = useRouter();
const routes: any = router.options.routes;
const multiTags: any = useMultiTagsStoreHook().multiTags;

const isDashboard = (route: RouteLocationMatched): boolean | string => {
  const name = route && (route.name as string);
  if (!name) return false;
  return name.trim().toLocaleLowerCase() === "Welcome".toLocaleLowerCase();
};

const getBreadcrumb = (): void => {
  // 当前路由信息
  let currentRoute;

  if (Object.keys(route.query).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.query, item?.query)) {
        currentRoute = toRaw(item);
      }
    });
  } else if (Object.keys(route.params).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.params, item?.params)) {
        currentRoute = toRaw(item);
      }
    });
  } else {
    currentRoute = findRouteByPath(router.currentRoute.value.path, multiTags);
  }
  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(router.currentRoute.value.path, routes);
  // 存放组成面包屑的数组
  let matched = [];
  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach(path => {
    if (path !== "/") matched.push(findRouteByPath(path, routes));
  });

  if (currentRoute?.path !== "/welcome") matched.push(currentRoute);

  if (!isDashboard(matched[0])) {
    matched = [
      {
        path: "/welcome",
        parentPath: "/",
        meta: { title: "menus.hshome" }
      } as unknown as RouteLocationMatched
    ].concat(matched);
  }

  matched.forEach((item, index) => {
    if (currentRoute?.query || currentRoute?.params) return;
    if (item?.children) {
      item.children.forEach(v => {
        if (v?.meta?.title === item?.meta?.title) {
          matched.splice(index, 1);
        }
      });
    }
  });

  levelList.value = matched.filter(
    item => item?.meta && item?.meta.title !== false
  );
};

const handleLink = (item: RouteLocationMatched): void => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect as any);
  } else {
    router.push(path);
  }
};

onMounted(() => {
  getBreadcrumb();
});

watch(
  () => route.path,
  () => {
    getBreadcrumb();
  }
);
</script>

<template>
  <el-breadcrumb class="!leading-[50px] select-none" separator="/">
    <transition-group appear name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <a @click.prevent="handleLink(item)">
          {{ transformI18n(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
