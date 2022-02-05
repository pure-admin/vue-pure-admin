<script setup lang="ts">
import {
  unref,
  watch,
  computed,
  nextTick,
  onMounted,
  getCurrentInstance
} from "vue";
import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import Notice from "../notice/index.vue";
import { templateRef } from "@vueuse/core";
import avatars from "/@/assets/avatars.jpg";
import { transformI18n } from "/@/plugins/i18n";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import { useAppStoreHook } from "/@/store/modules/app";
import { deviceDetection } from "/@/utils/deviceDetection";
import globalization from "/@/assets/svg/globalization.svg";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;

const menuRef = templateRef<ElRef | null>("menu", null);
const pureApp = useAppStoreHook();
const route = useRoute();
const router = useRouter();
const routers = useRouter().options.routes;
let usename = storageSession.getItem("info")?.username;
const { locale, t } = useI18n();

const getDropdownItemStyle = computed(() => {
  return t => {
    return {
      background: locale.value === t ? "#1b2a47" : "",
      color: locale.value === t ? "#f4f4f5" : "#000"
    };
  };
});

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

const toggleClick = () => {
  pureApp.toggleSideBar();
};

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
  findCurrentRoute(routers);
};

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

function resolvePath(route) {
  const httpReg = /^http(s?):\/\//;
  const routeChildPath = route.children[0]?.path;
  if (httpReg.test(routeChildPath)) {
    return route.path + "/" + routeChildPath;
  } else {
    return routeChildPath;
  }
}

onMounted(() => {
  nextTick(() => {
    handleResize();
  });
});
</script>

<template>
  <div class="horizontal-header">
    <div
      :class="classes.container"
      :title="pureApp.sidebar.opened ? '点击折叠' : '点击展开'"
      @click="toggleClick"
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
      :default-active="activeMenu"
      router
      @select="menuSelect"
    >
      <el-menu-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :index="route.redirect || resolvePath(route)"
      >
        <template #title>
          <el-icon v-show="route.meta.icon" :class="route.meta.icon">
            <component
              :is="useRenderIcon(route.meta && route.meta.icon)"
            ></component>
          </el-icon>
          <span>{{ transformI18n(route.meta.title, route.meta.i18n) }}</span>
          <Icon
            v-if="route.meta.extraIcon"
            :svg="route.meta.extraIcon.svg ? true : false"
            :content="`${route.meta.extraIcon.name}`"
          />

          <FontIcon
            v-if="route.meta.extraIcon"
            width="30px"
            height="30px"
            style="position: absolute; right: 10px"
            :icon="route.meta.extraIcon.name"
            :svg="route.meta.extraIcon.svg ? true : false"
          ></FontIcon>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="horizontal-header-right">
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
              :style="getDropdownItemStyle('zh')"
              @click="translationCh"
              ><el-icon class="check-zh" v-show="locale === 'zh'"
                ><check /></el-icon
              >简体中文</el-dropdown-item
            >
            <el-dropdown-item
              :style="getDropdownItemStyle('en')"
              @click="translationEn"
              ><el-icon class="check-en" v-show="locale === 'en'"
                ><check /></el-icon
              >English</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="avatars" />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <i class="ri-logout-circle-r-line"></i
              >{{ $t("buttons.hsLoginOut") }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon
        class="el-icon-setting"
        :title="$t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <Setting />
      </el-icon>
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
  .el-dropdown-menu__item {
    padding: 5px 40px !important;
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #606266;
    background: #f0f0f0;
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

  .el-dropdown-menu__item {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #606266;
    background: #f0f0f0;
  }
}
</style>
