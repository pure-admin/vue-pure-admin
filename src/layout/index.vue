<template>
  <div :class="classes" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside(false)"
    />
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" v-if="!containerHiddenSideBar" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 顶部导航栏 -->
        <navbar v-show="!containerHiddenSideBar" />
        <!-- tabs标签页 -->
        <tag>
          <i
            :class="
              containerHiddenSideBar
                ? 'iconfont team-iconhidden-main-container'
                : 'iconfont team-iconshow-main-container'
            "
            @click="onFullScreen"
          ></i>
        </tag>
      </div>
      <!-- 主体内容 -->
      <app-main />
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>

<script lang="ts">
import { Navbar, Sidebar, AppMain, setting, tag } from "./components";
import {
  ref,
  unref,
  reactive,
  computed,
  toRefs,
  watchEffect,
  onMounted,
  onBeforeMount
} from "vue";
import { useAppStoreHook } from "/@/store/modules/app";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { useEventListener } from "@vueuse/core";
import { toggleClass } from "/@/utils/operate";
let hiddenMainContainer = "hidden-main-container";
import options from "/@/settings";

interface setInter {
  sidebar: any;
  device: string;
  fixedHeader: boolean;
  classes: any;
}

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    setting,
    tag
  },
  setup() {
    const pureApp = useAppStoreHook();
    const pureSetting = useSettingStoreHook();

    // const router = useRouter();
    // const route = useRoute();

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

    return {
      ...toRefs(set),
      handleClickOutside,
      containerHiddenSideBar,
      onFullScreen
    };
  }
};
</script>

<style lang="scss" scoped>
@mixin clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
$sideBarWidth: 210px;

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

.hidden-main-container {
  margin-left: 0 !important;
}
</style>
