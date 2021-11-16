<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";
import { transformI18n } from "/@/utils/i18n";

const levelList = ref([]);
const route = useRoute();
const router = useRouter();

const isDashboard = (route: RouteLocationMatched): boolean | string => {
  const name = route && (route.name as string);
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "welcome".toLocaleLowerCase();
};

const getBreadcrumb = (): void => {
  let matched = route.matched.filter(item => item.meta && item.meta.title);
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
