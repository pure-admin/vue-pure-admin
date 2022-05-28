<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import { useNav } from "../../hooks/nav";
import { templateRef } from "@vueuse/core";
import avatars from "/@/assets/avatars.jpg";
import { transformI18n } from "/@/plugins/i18n";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { deviceDetection } from "/@/utils/deviceDetection";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import globalization from "/@/assets/svg/globalization.svg?component";
import { ref, watch, nextTick, onMounted, getCurrentInstance } from "vue";

const route = useRoute();
const { locale, t } = useI18n();
const routers = useRouter().options.routes;
const menuRef = templateRef<ElRef | null>("menu", null);
const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;

const {
  logout,
  onPanel,
  changeTitle,
  toggleSideBar,
  handleResize,
  menuSelect,
  resolvePath,
  pureApp,
  username,
  avatarsStyle,
  getDropdownItemStyle,
  changeWangeditorLanguage
} = useNav();

let defaultActive = ref(null);

function getDefaultActive(routePath) {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  // 当前路由的父级路径
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = findRouteByPath(
    parentRoutes,
    wholeMenus
  )?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
  nextTick(() => {
    handleResize(menuRef.value);
  });
});

watch(
  () => locale.value,
  () => {
    changeTitle(route.meta);
    locale.value === "en"
      ? changeWangeditorLanguage(locale.value)
      : changeWangeditorLanguage("zh-CN");
  }
);

watch(
  () => route.path,
  () => {
    getDefaultActive(route.path);
  }
);

function translationCh() {
  instance.locale = { locale: "zh" };
  locale.value = "zh";
  handleResize(menuRef.value);
}

function translationEn() {
  instance.locale = { locale: "en" };
  locale.value = "en";
  handleResize(menuRef.value);
}
</script>

<template>
  <div class="horizontal-header">
    <div
      :class="classes.container"
      :title="pureApp.sidebar.opened ? '点击折叠' : '点击展开'"
      @click="toggleSideBar"
    >
      <svg
        :fill="useEpThemeStoreHook().fill"
        :class="[
          'hamburger',
          pureApp.sidebar.opened ? 'is-active-hamburger' : ''
        ]"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
      >
        <path
          d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        />
      </svg>
    </div>
    <el-menu
      ref="menu"
      class="horizontal-header-menu"
      mode="horizontal"
      :default-active="defaultActive"
      router
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <el-menu-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :index="resolvePath(route) || route.redirect"
      >
        <template #title>
          <div v-show="route.meta.icon" :class="['el-icon', route.meta.icon]">
            <component :is="useRenderIcon(route.meta && route.meta.icon)" />
          </div>
          <span>{{ transformI18n(route.meta.title) }}</span>
          <FontIcon
            v-if="route.meta.extraIcon"
            width="30px"
            height="30px"
            style="position: absolute; right: 10px"
            :icon="route.meta.extraIcon.name"
            :svg="route.meta.extraIcon.svg ? true : false"
          />
        </template>
      </el-menu-item>
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 全屏 -->
      <screenfull id="header-screenfull" v-show="!deviceDetection()" />
      <!-- 国际化 -->
      <el-dropdown id="header-translation" trigger="click">
        <globalization />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              @click="translationCh"
            >
              <span class="check-zh" v-show="locale === 'zh'">
                <IconifyIconOffline icon="check" />
              </span>
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              @click="translationEn"
            >
              <span class="check-en" v-show="locale === 'en'">
                <IconifyIconOffline icon="check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img v-if="avatars" :src="avatars" :style="avatarsStyle" />
          <p v-if="username">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                icon="logout-circle-r-line"
                style="margin: 5px"
              />
              {{ t("buttons.hsLoginOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="el-icon-setting"
        :title="t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline icon="setting" />
      </span>
    </div>
  </div>
</template>

<style module="classes" scoped>
.container {
  padding: 0 15px;
}
</style>

<style lang="scss" scoped>
.hamburger {
  width: 20px;
  height: 20px;

  &:hover {
    cursor: pointer;
  }
}

.is-active-hamburger {
  transform: rotate(180deg);
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
