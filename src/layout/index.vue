<script setup lang="ts">
import {
  h,
  ref,
  unref,
  reactive,
  computed,
  onMounted,
  watchEffect,
  onBeforeMount,
  defineComponent,
  getCurrentInstance
} from "vue";
import { setType } from "./types";
import { useI18n } from "vue-i18n";
import { routerArrays } from "./types";
import { emitter } from "/@/utils/mitt";
import { useEventListener } from "@vueuse/core";
import backTop from "/@/assets/svg/back_top.svg";
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

const instance = getCurrentInstance().appContext.app.config.globalProperties;
const hiddenSideBar = ref(instance.$config?.HiddenSideBar);
const pureSetting = useSettingStoreHook();

// 清空缓存后从serverConfig.json读取默认配置并赋值到storage中
const layout = computed(() => {
  // 路由
  if (
    !instance.$storage.routesInStorage ||
    instance.$storage.routesInStorage.length === 0
  ) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    instance.$storage.routesInStorage = routerArrays;
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
      theme: instance.$config?.Theme ?? "default"
    };
  }
  // 灰色模式、色弱模式、隐藏标签页
  if (!instance.$storage.sets) {
    // eslint-disable-next-line
    instance.$storage.sets = {
      grey: instance.$config?.Grey ?? false,
      weak: instance.$config?.Weak ?? false,
      hideTabs: instance.$config?.HideTabs ?? false
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
    return instance.$storage?.sets.hideTabs;
  })
});

const handleClickOutside = (params: boolean) => {
  useAppStoreHook().closeSideBar({ withoutAnimation: params });
};

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  instance.$storage.layout = {
    layout: `${layoutModel}`,
    theme: instance.$storage.layout?.theme
  };
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
  unref(hiddenSideBar)
    ? (hiddenSideBar.value = false)
    : (hiddenSideBar.value = true);
}

onMounted(() => {
  const isMobile = $_isMobile();
  if (isMobile) {
    useAppStoreHook().toggleDevice("mobile");
    handleClickOutside(true);
  }
});

onBeforeMount(() => {
  useEventListener("resize", $_resizeHandler);
});

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
          !hiddenSideBar.value && layout.value.includes("vertical")
            ? h(navbar)
            : h("div"),
          !hiddenSideBar.value && layout.value.includes("horizontal")
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
                      !hiddenSideBar.value ? h(fullScreen) : h(exitScreen)
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
      class="drawer-bg"
      @click="handleClickOutside(false)"
    />
    <Vertical v-show="!hiddenSideBar && layout.includes('vertical')" />
    <div :class="['main-container', hiddenSideBar ? 'main-hidden' : '']">
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

.drawer-bg {
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
