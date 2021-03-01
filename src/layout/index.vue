<template>
  <div :class="classes" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 顶部导航栏 -->
        <navbar />
      </div>
      <!-- 主体内容 -->
      <app-main />
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>

<script lang="ts">
import { Navbar, Sidebar, AppMain, setting } from "./components";
import {
  ref,
  reactive,
  computed,
  toRefs,
  watch,
  watchEffect,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { useStore } from "vuex";
interface setInter {
  sidebar: any;
  device: String;
  fixedHeader: Boolean;
  classes: any;
}

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    setting,
  },
  setup() {
    const store = useStore();

    const WIDTH = ref(992);

    const set: setInter = reactive({
      sidebar: computed(() => {
        return store.state.app.sidebar;
      }),

      device: computed(() => {
        return store.state.app.device;
      }),

      fixedHeader: computed(() => {
        return store.state.settings.fixedHeader;
      }),

      classes: computed(() => {
        return {
          hideSidebar: !set.sidebar.opened,
          openSidebar: set.sidebar.opened,
          withoutAnimation: set.sidebar.withoutAnimation,
          mobile: set.device === "mobile",
        };
      }),
    });

    watchEffect(() => {
      if (set.device === "mobile" && !set.sidebar.opened) {
        store.dispatch("app/closeSideBar", { withoutAnimation: false });
      }
    })
 
    const handleClickOutside = () => {
      store.dispatch("app/closeSideBar", { withoutAnimation: false });
    };

    const $_isMobile = () => {
      const rect = document.body.getBoundingClientRect();
      return rect.width - 1 < WIDTH.value;
    };

    const $_resizeHandler = () => {
      if (!document.hidden) {
        const isMobile = $_isMobile();
        store.dispatch("app/toggleDevice", isMobile ? "mobile" : "desktop");

        if (isMobile) {
          store.dispatch("app/closeSideBar", { withoutAnimation: true });
        }
      }
    };

    onMounted(() => {
      const isMobile = $_isMobile();
      if (isMobile) {
        store.dispatch("app/toggleDevice", "mobile");
        store.dispatch("app/closeSideBar", { withoutAnimation: true });
      }
    });

    onBeforeMount(() => {
      window.addEventListener("resize", $_resizeHandler);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", $_resizeHandler);
    });

    return {
      ...toRefs(set),
      handleClickOutside,
    };
  },
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
</style>
