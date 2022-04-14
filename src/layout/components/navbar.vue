<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useNav } from "../hooks/nav";
import { useRoute } from "vue-router";
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import mixNav from "./sidebar/mixNav.vue";
import avatars from "/@/assets/avatars.jpg";
import Hamburger from "./sidebar/hamBurger.vue";
import { watch, getCurrentInstance } from "vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import { deviceDetection } from "/@/utils/deviceDetection";
import screenfull from "../components/screenfull/index.vue";
import globalization from "/@/assets/svg/globalization.svg?component";

const route = useRoute();
const { locale, t } = useI18n();
const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;
const {
  logout,
  onPanel,
  changeTitle,
  toggleSideBar,
  pureApp,
  username,
  avatarsStyle,
  getDropdownItemStyle
} = useNav();

watch(
  () => locale.value,
  () => {
    changeTitle(route.meta);
  }
);

function translationCh() {
  instance.locale = { locale: "zh" };
  locale.value = "zh";
}

function translationEn() {
  instance.locale = { locale: "en" };
  locale.value = "en";
}
</script>

<template>
  <div class="navbar">
    <Hamburger
      v-if="pureApp.layout !== 'mix'"
      :is-active="pureApp.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb v-if="pureApp.layout !== 'mix'" class="breadcrumb-container" />

    <mixNav v-if="pureApp.layout === 'mix'" />

    <div v-if="pureApp.layout === 'vertical'" class="vertical-header-right">
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
              ><IconifyIconOffline
                class="check-zh"
                v-show="locale === 'zh'"
                icon="check"
              />简体中文</el-dropdown-item
            >
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              @click="translationEn"
            >
              <span class="check-en" v-show="locale === 'en'">
                <IconifyIconOffline icon="check" /> </span
              >English
            </el-dropdown-item>
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
              />{{ t("buttons.hsLoginOut") }}</el-dropdown-item
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
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    :deep(.dropdown-badge) {
      &:hover {
        background: #f6f6f6;
      }
    }

    .screen-full {
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .globalization {
      height: 48px;
      width: 40px;
      padding: 11px;
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      &:hover {
        background: #f6f6f6;
      }

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }

    .el-icon-setting {
      height: 48px;
      width: 38px;
      padding: 12px;
      display: flex;
      cursor: pointer;
      align-items: center;

      &:hover {
        background: #f6f6f6;
      }
    }
  }

  .breadcrumb-container {
    float: left;
  }
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
