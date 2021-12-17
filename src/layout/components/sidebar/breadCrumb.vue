<script setup lang="ts">
import { ref, watch } from "vue";
import { isEqual } from "lodash-es";
import { transformI18n } from "/@/plugins/i18n";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";

const route = useRoute();
const levelList = ref([]);
const router = useRouter();
const routes = router.options.routes;
const multiTags = useMultiTagsStoreHook().multiTags;

const isDashboard = (route: RouteLocationMatched): boolean | string => {
  const name = route && (route.name as string);
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "welcome".toLocaleLowerCase();
};

const getBreadcrumb = (): void => {
  // 当前路由信息
  let currentRoute;
  if (Object.keys(route.query).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.query, item?.query)) {
        currentRoute = item;
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
    if (path !== "/") {
      matched.push(findRouteByPath(path, routes));
    }
  });
  if (router.currentRoute.value.meta?.refreshRedirect) {
    matched.unshift(
      findRouteByPath(
        router.currentRoute.value.meta.refreshRedirect as string,
        routes
      )
    );
  } else {
    // 过滤与子级相同标题的父级路由
    matched = matched.filter(item => {
      return !item.redirect || (item.redirect && item.children.length !== 1);
    });
  }
  if (currentRoute?.path !== "/welcome") {
    matched.push(currentRoute);
  }

  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      {
        path: "/welcome",
        parentPath: "/",
        meta: { title: "message.hshome", i18n: true }
      } as unknown as RouteLocationMatched
    ].concat(matched);
  }

  levelList.value = matched.filter(
    item => item?.meta && item?.meta.title !== false
  );
};

getBreadcrumb();

watch(
  () => route.path,
  () => getBreadcrumb()
);

watch(
  () => route.query,
  () => getBreadcrumb()
);

const handleLink = (item: RouteLocationMatched): any => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect.toString());
    return;
  }
  router.push(path);
};
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group appear name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ transformI18n(item.meta.title, item.meta.i18n) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">
          {{ transformI18n(item.meta.title, item.meta.i18n) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
