<script setup lang="ts">
import { isEqual, storageLocal } from "@pureadmin/utils";
import { transformI18n } from "@/plugins/i18n";
import { ref, watch, onMounted, toRaw } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";
import { onBeforeMount } from "vue";
import { responsiveStorageNameSpace } from "@/config";
import { emitter } from "@/utils/mitt";

const route = useRoute();
const levelList = ref([]);
const router = useRouter();
const routes: any = router.options.routes;
const multiTags: any = useMultiTagsStoreHook().multiTags;
const showIcon = ref(
  storageLocal().getItem<StorageConfigs>(
    `${responsiveStorageNameSpace()}configure`
  )?.breadcrumbIcon ?? true
);

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
    currentRoute = findRouteByPath(router.currentRoute.value.path, routes);
  }

  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(
    router.currentRoute.value.name as string,
    routes,
    "name"
  );
  // 存放组成面包屑的数组
  const matched = [];

  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach(path => {
    if (path !== "/") matched.push(findRouteByPath(path, routes));
  });

  matched.push(currentRoute);

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

onBeforeMount(() => {
  // 面包屑图标动态改变
  emitter.on("breadcrumbIconChange", show => {
    showIcon.value = show;
  });
});

watch(
  () => route.path,
  () => {
    getBreadcrumb();
  },
  {
    deep: true
  }
);
</script>

<template>
  <el-breadcrumb class="!leading-[50px] select-none" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        class="!inline !items-stretch"
        v-for="item in levelList"
        :key="item.path"
      >
        <a @click.prevent="handleLink(item)">
          <div v-if="showIcon && item.meta.icon" class="el-icon">
            <component :is="useRenderIcon(item.meta.icon)" />
          </div>
          {{ transformI18n(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
