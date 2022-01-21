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
import Notice from "../notice/index.vue";
import { templateRef } from "@vueuse/core";
import SidebarItem from "./sidebarItem.vue";
import avatars from "/@/assets/avatars.jpg";
import { algorithm } from "/@/utils/algorithm";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import Icon from "/@/components/ReIcon/src/Icon.vue";
import { deviceDetection } from "/@/utils/deviceDetection";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import globalization from "/@/assets/svg/globalization.svg?component";

const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;

const menuRef = templateRef<ElRef | null>("menu", null);
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
      <Icon svg :width="35" :height="35" content="team-iconlogo" />
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
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
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
                ><IconifyIconOffline icon="check" /></el-icon
              >简体中文</el-dropdown-item
            >
            <el-dropdown-item
              :style="getDropdownItemStyle('en')"
              @click="translationEn"
              ><el-icon class="check-en" v-show="locale === 'en'"
                ><IconifyIconOffline icon="check" /></el-icon
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
        <IconifyIconOffline icon="setting" />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
