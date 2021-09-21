<script setup lang="ts">
import {
  ref,
  unref,
  reactive,
  computed,
  watchEffect,
  onMounted,
  onBeforeMount,
  useCssModule
} from "vue";
import options from "/@/settings";
import { toggleClass } from "/@/utils/operate";
import { useEventListener } from "@vueuse/core";
import { useAppStoreHook } from "/@/store/modules/app";
import fullScreen from "/@/assets/svg/full_screen.svg";
import exitScreen from "/@/assets/svg/exit_screen.svg";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { Navbar, Sidebar, AppMain, setting, tag } from "./components";

interface setInter {
  sidebar: any;
  device: string;
  fixedHeader: boolean;
  classes: any;
}

const pureApp = useAppStoreHook();
const pureSetting = useSettingStoreHook();
const { hiddenMainContainer } = useCssModule();

const WIDTH = ref(992);

let containerHiddenSideBar = ref(options.hiddenSideBar);

const set: setInter = reactive({
  sidebar: computed(() => {
    return pureApp.sidebar;
  }),

  device: computed(() => {
    return pureApp.device;
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
  pureApp.closeSideBar({ withoutAnimation: params });
};

watchEffect(() => {
  if (set.device === "mobile" && !set.sidebar.opened) {
    handleClickOutside(false);
  }
});

const $_isMobile = () => {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH.value;
};

const $_resizeHandler = () => {
  if (!document.hidden) {
    const isMobile = $_isMobile();
    pureApp.toggleDevice(isMobile ? "mobile" : "desktop");
    if (isMobile) {
      handleClickOutside(true);
    }
  }
};

function onFullScreen() {
  if (unref(containerHiddenSideBar)) {
    containerHiddenSideBar.value = false;
    toggleClass(
      false,
      hiddenMainContainer,
      document.querySelector(".main-container")
    );
  } else {
    containerHiddenSideBar.value = true;
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
    pureApp.toggleDevice("mobile");
    handleClickOutside(true);
  }
  toggleClass(
    unref(containerHiddenSideBar),
    hiddenMainContainer,
    document.querySelector(".main-container")
  );
});

onBeforeMount(() => {
  useEventListener("resize", $_resizeHandler);
});
</script>

<template>
  <div :class="set.classes" class="app-wrapper">
    <div
      v-if="set.device === 'mobile' && set.sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside(false)"
    />
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" v-if="!containerHiddenSideBar" />
    <div class="main-container">
      <div :class="{ 'fixed-header': set.fixedHeader }">
        <!-- 顶部导航栏 -->
        <navbar v-show="!containerHiddenSideBar" />
        <!-- tabs标签页 -->
        <tag>
          <span @click="onFullScreen">
            <fullScreen v-if="!containerHiddenSideBar" />
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
$sideBarWidth: 210px;
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
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.re-screen {
  margin-top: 12px;
}
</style>
