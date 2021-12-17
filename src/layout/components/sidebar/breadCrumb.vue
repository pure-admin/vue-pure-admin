<script setup lang="ts">
import { ref, watch } from "vue";
import { transformI18n } from "/@/plugins/i18n";
import { isEmpty, isEqual, findIndex } from "lodash-es";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";

const levelList = ref([]);
const route = useRoute();
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

// 获取动态路由信息
const getDynamicRoute = (path, tags) => {
  const dynamicRoute = findRouteByPath(path, tags);
  if (!dynamicRoute) {
    return null;
  } else if (isEmpty(route.query) || isEqual(dynamicRoute.query, route.query)) {
    /**
     * isEmpty(route.query) 动态标签页已存在，切换标签页时不需要判断route.query
     * isEqual(dynamicRoute.query, route.query) 新开动态标签页, 匹配与新开标签页相符的query
     */
    return dynamicRoute;
  } else {
    const index = findIndex(
      tags,
      v => v.path === dynamicRoute.path && isEqual(v.query, dynamicRoute.query)
    );
    // 去掉不符合当前路由query的路由
    const newTags = tags.slice(index + 1);
    return getDynamicRoute(path, newTags);
  }
};

const getBreadcrumb = (): void => {
  // 当前路由信息
  let currentRoute;
  if (route.meta?.realPath) {
    currentRoute = getDynamicRoute(route.path, multiTags);
  } else {
    currentRoute = findRouteByPath(route.path, multiTags);
  }
  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(route.path, routes);
  // 存放组成面包屑的数组
  let matched = [];
  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach(path => {
    if (path !== "/") {
      matched.push(findRouteByPath(path, routes));
    }
  });
  if (route.meta.refreshRedirect) {
    matched.unshift(
      findRouteByPath(route.meta.refreshRedirect as string, routes)
    );
  } else {
    // 过滤与子级相同标题的父级路由
    matched = matched.filter(item => {
      return !item.redirect || (item.redirect && item.children.length !== 1);
    });
  }
  if (currentRoute.path !== "/welcome") {
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
    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
};

getBreadcrumb();

watch(
  () => route.path,
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
