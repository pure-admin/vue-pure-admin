<script setup lang="ts">
import {
  computed,
  unref,
  watch,
  nextTick,
  onMounted,
  getCurrentInstance
} from "vue";
import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import SidebarItem from "./sidebarItem.vue";
import { algorithm } from "/@/utils/algorithm";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import globalization from "/@/assets/svg/globalization.svg";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;

const menuRef = templateRef<ElRef | null>("menu", null);
const routeStore = usePermissionStoreHook();
const route = useRoute();
const router = useRouter();
const routers = useRouter().options.routes;
let usename = storageSession.getItem("info")?.username;
const { locale, t } = useI18n();

watch(
  () => locale.value,
  () => {
    //@ts-ignore
    // 动态title
    document.title = t(unref(route.meta.title));
  }
);

// 退出登录
const logout = (): void => {
  storageSession.removeItem("info");
  router.push("/login");
};

function onPanel() {
  emitter.emit("openPanel");
}

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
  findCurrentRoute(algorithm.increaseIndexes(routers));
};

function backHome() {
  router.push("/welcome");
}

function handleResize() {
  // @ts-ignore
  menuRef.value.handleResize();
}

// 简体中文
function translationCh() {
  instance.locale = { locale: "zh" };
  locale.value = "zh";
  handleResize();
}

// English
function translationEn() {
  instance.locale = { locale: "en" };
  locale.value = "en";
  handleResize();
}

onMounted(() => {
  nextTick(() => {
    handleResize();
  });
});
</script>

<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left" @click="backHome">
      <i class="fa fa-optin-monster"></i>
      <h4>{{ title }}</h4>
    </div>
    <el-menu
      ref="menu"
      :default-active="activeMenu"
      unique-opened
      router
      class="horizontal-header-menu"
      mode="horizontal"
      @select="menuSelect"
    >
      <sidebar-item
        v-for="route in routeStore.wholeRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 全屏 -->
      <screenfull v-show="!deviceDetection()" />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="{
                background: locale === 'zh' ? '#1b2a47' : '',
                color: locale === 'zh' ? '#f4f4f5' : '#000'
              }"
              @click="translationCh"
              >简体中文</el-dropdown-item
            >
            <el-dropdown-item
              :style="{
                background: locale === 'en' ? '#1b2a47' : '',
                color: locale === 'en' ? '#f4f4f5' : '#000'
              }"
              @click="translationEn"
              >English</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
          />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item icon="el-icon-switch-button" @click="logout">{{
              $t("message.hsLoginOut")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <i
        class="el-icon-setting"
        :title="$t('message.hssystemSet')"
        @click="onPanel"
      ></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.translation {
  .el-dropdown-menu__item {
    padding: 0 40px !important;
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #606266;
    background: #f0f0f0;
  }
}

.logout {
  .el-dropdown-menu__item {
    padding: 0 18px !important;
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #606266;
    background: #f0f0f0;
  }
}
</style>
