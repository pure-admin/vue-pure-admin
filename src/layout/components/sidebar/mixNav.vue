<script setup lang="ts">
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import avatars from "/@/assets/avatars.jpg";
import { useNav } from "/@/layout/hooks/useNav";
import { transformI18n } from "/@/plugins/i18n";
import screenfull from "../screenfull/index.vue";
import { deviceDetection } from "@pureadmin/utils";
import { ref, toRaw, watch, onMounted } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import globalization from "/@/assets/svg/globalization.svg?component";

const menuRef = ref();
let defaultActive = ref(null);

const { t, route, locale, translationCh, translationEn } =
  useTranslationLang(menuRef);
const {
  device,
  routers,
  logout,
  onPanel,
  menuSelect,
  resolvePath,
  username,
  avatarsStyle,
  getDropdownItemStyle,
  getDropdownItemClass
} = useNav();

function getDefaultActive(routePath) {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  /** 当前路由的父级路径 */
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = findRouteByPath(
    parentRoutes,
    wholeMenus
  )?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
});

watch(
  () => route.path,
  () => {
    getDefaultActive(route.path);
  }
);
</script>

<template>
  <div v-if="device !== 'mobile'" class="horizontal-header">
    <el-menu
      router
      ref="menuRef"
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
          class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <span class="check-zh" v-show="locale === 'zh'">
                <IconifyIconOffline icon="check" />
              </span>
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
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
          <p v-if="username" class="dark:text-white">{{ username }}</p>
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
