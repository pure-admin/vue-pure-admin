<script setup lang="ts">
import {
  h,
  reactive,
  computed,
  onMounted,
  defineComponent,
  getCurrentInstance
} from "vue";
import { setType } from "./types";
import { useI18n } from "vue-i18n";
import { routerArrays } from "./types";
import { emitter } from "/@/utils/mitt";
import { useAppStoreHook } from "/@/store/modules/app";
import { deviceDetection } from "/@/utils/deviceDetection";
import { useMultiTagsStore } from "/@/store/modules/multiTags";
import { useSettingStoreHook } from "/@/store/modules/settings";

import backTop from "/@/assets/svg/back_top.svg?component";
import fullScreen from "/@/assets/svg/full_screen.svg?component";
import exitScreen from "/@/assets/svg/exit_screen.svg?component";

import navbar from "./components/navbar.vue";
import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/setting/index.vue";
import Vertical from "./components/sidebar/vertical.vue";
import Horizontal from "./components/sidebar/horizontal.vue";

const isMobile = deviceDetection();
const pureSetting = useSettingStoreHook();
const instance = getCurrentInstance().appContext.app.config.globalProperties;

// 清空缓存后从serverConfig.json读取默认配置并赋值到storage中
const layout = computed(() => {
  // 路由
  if (
    useMultiTagsStore().multiTagsCache &&
    (!instance.$storage.tags || instance.$storage.tags.length === 0)
  ) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    instance.$storage.tags = routerArrays;
  }
  // 国际化
  if (!instance.$storage.locale) {
    // eslint-disable-next-line
    instance.$storage.locale = { locale: instance.$config?.Locale ?? "zh" };
    useI18n().locale.value = instance.$config?.Locale ?? "zh";
  }
  // 导航
  if (!instance.$storage.layout) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    instance.$storage.layout = {
      layout: instance.$config?.Layout ?? "vertical",
      theme: instance.$config?.Theme ?? "default",
      darkMode: instance.$config?.DarkMode ?? false,
      sidebarStatus: instance.$config?.SidebarStatus ?? true,
      epThemeColor: instance.$config?.EpThemeColor ?? "#409EFF"
    };
  }
  // 灰色模式、色弱模式、隐藏标签页
  if (!instance.$storage.configure) {
    // eslint-disable-next-line
    instance.$storage.configure = {
      grey: instance.$config?.Grey ?? false,
      weak: instance.$config?.Weak ?? false,
      hideTabs: instance.$config?.HideTabs ?? false,
      showLogo: instance.$config?.ShowLogo ?? true,
      showModel: instance.$config?.ShowModel ?? "smart",
      multiTagsCache: instance.$config?.MultiTagsCache ?? false
    };
  }
  return instance.$storage?.layout.layout;
});

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
  }),

  hideTabs: computed(() => {
    return instance.$storage?.configure.hideTabs;
  })
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  instance.$storage.layout = {
    layout: `${layoutModel}`,
    theme: instance.$storage.layout?.theme,
    darkMode: instance.$storage.layout?.darkMode,
    sidebarStatus: instance.$storage.layout?.sidebarStatus,
    epThemeColor: instance.$storage.layout?.epThemeColor
  };
}

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize");
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

// 监听容器
emitter.on("resize", ({ detail }) => {
  if (isMobile) return;
  let { width } = detail;
  width <= 670 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990) {
    if (!set.sidebar.isClickHamburger) {
      toggle("desktop", true);
      isAutoCloseSidebar = true;
    }
  }
});

onMounted(() => {
  if (isMobile) {
    toggle("mobile", false);
  }
});

function onFullScreen() {
  pureSetting.hiddenSideBar
    ? pureSetting.changeSetting({ key: "hiddenSideBar", value: false })
    : pureSetting.changeSetting({ key: "hiddenSideBar", value: true });
}

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": set.fixedHeader },
        style: [
          set.hideTabs && layout.value.includes("horizontal")
            ? "box-shadow: 0 1px 4px rgb(0 21 41 / 8%);"
            : ""
        ]
      },
      {
        default: () => [
          !pureSetting.hiddenSideBar && layout.value.includes("vertical")
            ? h(navbar)
            : h("div"),
          !pureSetting.hiddenSideBar && layout.value.includes("horizontal")
            ? h(Horizontal)
            : h("div"),
          h(
            tag,
            {},
            {
              default: () => [
                h(
                  "span",
                  { onClick: onFullScreen },
                  {
                    default: () => [
                      !pureSetting.hiddenSideBar ? h(fullScreen) : h(exitScreen)
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
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
      class="app-mask"
      @click="useAppStoreHook().toggleSideBar()"
    />
    <Vertical
      v-show="!pureSetting.hiddenSideBar && layout.includes('vertical')"
    />
    <div
      :class="[
        'main-container',
        pureSetting.hiddenSideBar ? 'main-hidden' : ''
      ]"
    >
      <div v-if="set.fixedHeader">
        <layout-header />
        <!-- 主体内容 -->
        <app-main :fixed-header="set.fixedHeader" />
      </div>
      <el-scrollbar v-else>
        <el-backtop
          title="回到顶部"
          target=".main-container .el-scrollbar__wrap"
          ><backTop />
        </el-backtop>
        <layout-header />
        <!-- 主体内容 -->
        <app-main :fixed-header="set.fixedHeader" />
      </el-scrollbar>
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>

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

.main-hidden {
  margin-left: 0 !important;
}

.app-mask {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.re-screen {
  margin-top: 12px;
}
</style>
