<script lang="ts">
import { routerArrays } from "./types";
export default {
  computed: {
    layout() {
      if (!this.$storage.layout) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$storage.layout = { layout: "vertical-dark" };
      }
      if (
        !this.$storage.routesInStorage ||
        this.$storage.routesInStorage.length === 0
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$storage.routesInStorage = routerArrays;
      }
      if (!this.$storage.locale) {
        // eslint-disable-next-line
        this.$storage.locale = { locale: "zh" };
        useI18n().locale.value = "zh";
      }
      return this.$storage?.layout.layout;
    }
  }
};
</script>

<script setup lang="ts">
import {
  ref,
  unref,
  reactive,
  computed,
  onMounted,
  watchEffect,
  useCssModule,
  onBeforeMount,
  getCurrentInstance
} from "vue";
import { setType } from "./types";
import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import { toggleClass } from "/@/utils/operate";
import { useEventListener } from "@vueuse/core";
import { storageLocal } from "/@/utils/storage";
import { useAppStoreHook } from "/@/store/modules/app";
import fullScreen from "/@/assets/svg/full_screen.svg";
import exitScreen from "/@/assets/svg/exit_screen.svg";
import { useSettingStoreHook } from "/@/store/modules/settings";

import navbar from "./components/navbar.vue";
import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/setting/index.vue";
import Vertical from "./components/sidebar/vertical.vue";
import Horizontal from "./components/sidebar/horizontal.vue";

const pureSetting = useSettingStoreHook();
const { hiddenMainContainer } = useCssModule();

const instance =
  getCurrentInstance().appContext.app.config.globalProperties.$storage;

const hiddenSideBar = ref(
  getCurrentInstance().appContext.config.globalProperties.$config?.HiddenSideBar
);

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  fixedHeader: computed(() => {
    return pureSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === "mobile"
    };
  })
});

const handleClickOutside = (params: boolean) => {
  useAppStoreHook().closeSideBar({ withoutAnimation: params });
};

function setTheme(layoutModel: string) {
  let { layout } = storageLocal.getItem("responsive-layout");
  let theme = layout.match(/-(.*)/)[1];
  window.document.body.setAttribute("data-layout", layoutModel);
  window.document.body.setAttribute("data-theme", theme);
  instance.layout = { layout: `${layoutModel}-${theme}` };
}

// 监听容器
emitter.on("resize", ({ detail }) => {
  let { width } = detail;
  width <= 670 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
});

watchEffect(() => {
  if (set.device === "mobile" && !set.sidebar.opened) {
    handleClickOutside(false);
  }
});

const $_isMobile = () => {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < 992;
};

const $_resizeHandler = () => {
  if (!document.hidden) {
    const isMobile = $_isMobile();
    useAppStoreHook().toggleDevice(isMobile ? "mobile" : "desktop");
    if (isMobile) {
      handleClickOutside(true);
    }
  }
};

function onFullScreen() {
  if (unref(hiddenSideBar)) {
    hiddenSideBar.value = false;
    toggleClass(
      false,
      hiddenMainContainer,
      document.querySelector(".main-container")
    );
  } else {
    hiddenSideBar.value = true;
    toggleClass(
      true,
      hiddenMainContainer,
      document.querySelector(".main-container")
    );
  }
}

onMounted(() => {
  const isMobile = $_isMobile();
  if (isMobile) {
    useAppStoreHook().toggleDevice("mobile");
    handleClickOutside(true);
  }
  toggleClass(
    unref(hiddenSideBar),
    hiddenMainContainer,
    document.querySelector(".main-container")
  );
});

onBeforeMount(() => {
  useEventListener("resize", $_resizeHandler);
});
</script>

<template>
  <div :class="['app-wrapper', set.classes]" v-resize>
    <div
      v-show="
        set.device === 'mobile' &&
        set.sidebar.opened &&
        layout.includes('vertical')
      "
      class="drawer-bg"
      @click="handleClickOutside(false)"
    />
    <Vertical v-show="!hiddenSideBar && layout.includes('vertical')" />
    <div class="main-container">
      <div :class="{ 'fixed-header': set.fixedHeader }">
        <!-- 顶部导航栏 -->
        <navbar v-show="!hiddenSideBar && layout.includes('vertical')" />
        <!-- tabs标签页 -->
        <Horizontal v-show="!hiddenSideBar && layout.includes('horizontal')" />
        <tag>
          <span @click="onFullScreen">
            <fullScreen v-if="!hiddenSideBar" />
            <exitScreen v-else />
          </span>
        </tag>
      </div>
      <!-- 主体内容 -->
      <app-main />
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>

<style scoped module>
.hiddenMainContainer {
  margin-left: 0 !important;
}
</style>

<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 210px);
  transition: width 0.28s;
}

.mobile .fixed-header {
  width: 100%;
}

.re-screen {
  margin-top: 12px;
}
</style>
