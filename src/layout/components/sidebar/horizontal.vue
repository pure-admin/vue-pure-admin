<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useNav } from "../../hooks/nav";
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import { templateRef } from "@vueuse/core";
import SidebarItem from "./sidebarItem.vue";
import avatars from "/@/assets/avatars.jpg";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { deviceDetection } from "/@/utils/deviceDetection";
import { watch, nextTick, onMounted, getCurrentInstance } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import globalization from "/@/assets/svg/globalization.svg?component";

const route = useRoute();
const { locale, t } = useI18n();
const routers = useRouter().options.routes;
const menuRef = templateRef<ElRef | null>("menu", null);
const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;
const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;

const {
  logout,
  backHome,
  onPanel,
  changeTitle,
  handleResize,
  menuSelect,
  username,
  avatarsStyle,
  getDropdownItemStyle
} = useNav();

onMounted(() => {
  nextTick(() => {
    handleResize(menuRef.value);
  });
});

watch(
  () => locale.value,
  () => {
    changeTitle(route.meta);
  }
);

watch(
  () => route.path,
  () => {
    menuSelect(route.path, routers);
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
    <div class="horizontal-header-left" @click="backHome">
      <FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />
      <h4>{{ title }}</h4>
    </div>
    <el-menu
      ref="menu"
      class="horizontal-header-menu"
      mode="horizontal"
      :default-active="route.path"
      router
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
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
                <IconifyIconOffline icon="check" /> </span
              >简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              @click="translationEn"
            >
              <span class="check-en" v-show="locale === 'en'">
                <IconifyIconOffline icon="check" /> </span
              >English</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登陆 -->
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
              {{ t("buttons.hsLoginOut") }}</el-dropdown-item
            >
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
