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
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import globalization from "/@/assets/svg/globalization.svg?component";
import {
  ref,
  toRaw,
  watch,
  nextTick,
  onMounted,
  getCurrentInstance
} from "vue";

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
  handleResize,
  menuSelect,
  resolvePath,
  username,
  avatarsStyle,
  getDropdownItemStyle,
  getDropdownItemClass,
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
    <el-menu
      router
      ref="menu"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <el-menu-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :index="resolvePath(route) || route.redirect"
      >
        <template #title>
          <div
            v-if="toRaw(route.meta.icon)"
            :class="['sub-menu-icon', route.meta.icon]"
          >
            <component
              :is="useRenderIcon(route.meta && toRaw(route.meta.icon))"
            />
          </div>
          <span class="select-none">{{ transformI18n(route.meta.title) }}</span>
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
        <globalization
          class="navbar-bg-hover w-40px h-48px p-11px cursor-pointer outline-none"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['!dark:color-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <span class="check-zh" v-show="locale === 'zh'">
                <IconifyIconOffline icon="check" />
              </span>
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['!dark:color-white', getDropdownItemClass(locale, 'en')]"
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
        <span class="el-dropdown-link navbar-bg-hover">
          <img v-if="avatars" :src="avatars" :style="avatarsStyle" />
          <p v-if="username" class="dark:color-white">{{ username }}</p>
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
        class="el-icon-setting navbar-bg-hover"
        :title="t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline icon="setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
