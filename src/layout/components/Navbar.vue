<template>
  <div class="navbar">
    <Hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 全屏 -->
      <screenfull v-show="!deviceDetection()" />
      <!-- 国际化 -->
      <div
        v-show="!deviceDetection()"
        class="inter"
        :title="langs ? '中文' : 'English'"
        @click="toggleLang"
      >
        <img :src="langs ? ch : en" />
      </div>
      <i class="el-icon-setting hsset" :title="$t('message.hssystemSet')" @click="onPanel"></i>
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="favicon" />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              icon="el-icon-switch-button"
              @click="logout"
            >{{ $t("message.hsLoginOut") }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, unref, watch } from "vue";
import Breadcrumb from "/@/components/BreadCrumb";
import Hamburger from "/@/components/HamBurger";
import screenfull from "../components/screenfull/index.vue";
import { useMapGetters } from "../store";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { storageSession } from "/@/utils/storage";
import ch from "/@/assets/ch.png";
import en from "/@/assets/en.png";
import favicon from "/favicon.ico";
import { emitter } from "/@/utils/mitt";
import { deviceDetection } from "/@/utils/deviceDetection";
import { useI18n } from "vue-i18n";

import ElementLocale from "element-plus/lib/locale";
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

export default defineComponent({
  name: "Navbar",
  components: {
    Breadcrumb,
    Hamburger,
    screenfull
  },
  setup() {
    let langs = ref(true);

    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    let usename = storageSession.getItem("info").username;

    const { locale, t } = useI18n();

    // 国际化语言切换
    const toggleLang = (): void => {
      langs.value = !langs.value;
      if (langs.value) {
        locale.value = "zh";
        ElementLocale.use(zhLocale);
      } else {
        locale.value = "en";
        ElementLocale.use(enLocale);
      }
    };

    watch(
      () => langs.value,
      val => {
        //@ts-ignore
        document.title = t(unref(route.meta.title)); // 动态title
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

    onMounted(() => {
      document
        .querySelector(".el-dropdown__popper")
        ?.setAttribute("class", "resetTop");
      document
        .querySelector(".el-popper__arrow")
        ?.setAttribute("class", "hidden");
    });

    return {
      // @ts-ignore
      ...useMapGetters(["sidebar"]),
      toggleSideBar() {
        store.dispatch("app/toggleSideBar");
      },
      langs,
      usename,
      toggleLang,
      logout,
      ch,
      en,
      favicon,
      onPanel,
      deviceDetection,
      locale,
      t
    };
  }
});
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;
    .inter {
      width: 40px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      &:hover {
        cursor: pointer;
        background: #f0f0f0;
      }
      img {
        width: 25px;
      }
    }
    .hsset {
      width: 40px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-right: 5px;
      &:hover {
        cursor: pointer;
        background: #f0f0f0;
      }
    }
    .el-dropdown-link {
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-right: 10px;
      cursor: pointer;
      p {
        font-size: 13px;
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
}
// single element-plus reset
.el-dropdown-menu__item {
  padding: 0 10px;
}
.el-dropdown-menu {
  padding: 0;
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #606266;
  background: #f0f0f0;
}
</style>
