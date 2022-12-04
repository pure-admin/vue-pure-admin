<script setup lang="ts">
import {
  ref,
  unref,
  watch,
  reactive,
  computed,
  nextTick,
  onBeforeMount
} from "vue";
import {
  useDark,
  debounce,
  useGlobal,
  storageLocal,
  storageSession
} from "@pureadmin/utils";
import { getConfig } from "@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "@/utils/mitt";
import { resetRouter } from "@/router";
import { removeToken } from "@/utils/auth";
import { routerArrays } from "@/layout/types";
import { useNav } from "@/layout/hooks/useNav";
import { useAppStoreHook } from "@/store/modules/app";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Check from "@iconify-icons/ep/check";
import Logout from "@iconify-icons/ri/logout-circle-r-line";

const router = useRouter();
const { isDark } = useDark();
const { device, tooltipEffect } = useNav();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const mixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const {
  dataTheme,
  layoutTheme,
  themeColors,
  dataThemeChange,
  setEpThemeColor,
  setLayoutThemeColor
} = useDataThemeChange();

/* body添加layout属性，作用于src/style/sidebar.scss */
if (unref(layoutTheme)) {
  const layout = unref(layoutTheme).layout;
  const theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  setLayoutModel(layout);
}

/** 默认灵动模式 */
const markValue = ref($storage.configure?.showModel ?? "smart");

const logoVal = ref($storage.configure?.showLogo ?? true);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  multiTagsCache: $storage.configure.multiTagsCache
});

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

/** 当网页为暗黑模式时不显示亮白色切换选项 */
const showThemeColors = computed(() => {
  return themeColor => {
    return themeColor === "light" && isDark.value ? false : true;
  };
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure;
  storageConfigure[key] = val;
  $storage.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

/** 灰色模式设置 */
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  storageConfigureChange("grey", value);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  toggleClass(
    settings.weakVal,
    "html-weakness",
    document.querySelector("html")
  );
  storageConfigureChange("weak", value);
};

const tagsChange = () => {
  const showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal as unknown as string);
};

const multiTagsCacheChange = () => {
  const multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

/** 清空缓存并返回登录页 */
function onReset() {
  removeToken();
  storageLocal.clear();
  storageSession.clear();
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  setEpThemeColor(EpThemeColor);
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  router.push("/login");
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
  resetRouter();
}

function onChange(label) {
  storageConfigureChange("showModel", label);
  emitter.emit("tagViewsShowModel", label);
}

/** 侧边栏Logo */
function logoChange() {
  unref(logoVal)
    ? storageConfigureChange("showLogo", true)
    : storageConfigureChange("showLogo", false);
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, "is-select", unref(v));
  });
}

/** 主题色 激活选择项 */
const getThemeColor = computed(() => {
  return current => {
    if (
      current === layoutTheme.value.theme &&
      layoutTheme.value.theme !== "light"
    ) {
      return "#fff";
    } else if (
      current === layoutTheme.value.theme &&
      layoutTheme.value.theme === "light"
    ) {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});

/** 设置导航模式 */
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  $storage.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: $storage.layout?.darkMode,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor
  };
  useAppStoreHook().setLayout(layout);
}

watch($storage, ({ layout }) => {
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, "is-select", unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, "is-select", unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "mix":
      toggleClass(true, "is-select", unref(mixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      break;
  }
});

onBeforeMount(() => {
  dataThemeChange();
  /* 初始化项目配置 */
  nextTick(() => {
    settings.greyVal &&
      document.querySelector("html")?.setAttribute("class", "html-grey");
    settings.weakVal &&
      document.querySelector("html")?.setAttribute("class", "html-weakness");
    settings.tabsVal && tagsChange();
  });
});
</script>

<template>
  <panel>
    <el-divider>主题</el-divider>
    <el-switch
      v-model="dataTheme"
      inline-prompt
      class="pure-datatheme"
      :active-icon="dayIcon"
      :inactive-icon="darkIcon"
      @change="dataThemeChange"
    />

    <el-divider>导航栏模式</el-divider>
    <ul class="pure-theme">
      <el-tooltip
        :effect="tooltipEffect"
        class="item"
        content="左侧模式"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li
          :class="layoutTheme.layout === 'vertical' ? 'is-select' : ''"
          ref="verticalRef"
          @click="setLayoutModel('vertical')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip
        v-if="device !== 'mobile'"
        :effect="tooltipEffect"
        class="item"
        content="顶部模式"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li
          :class="layoutTheme.layout === 'horizontal' ? 'is-select' : ''"
          ref="horizontalRef"
          @click="setLayoutModel('horizontal')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip
        v-if="device !== 'mobile'"
        :effect="tooltipEffect"
        class="item"
        content="混合模式"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li
          :class="layoutTheme.layout === 'mix' ? 'is-select' : ''"
          ref="mixRef"
          @click="setLayoutModel('mix')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
    </ul>

    <el-divider>主题色</el-divider>
    <ul class="theme-color">
      <li
        v-for="(item, index) in themeColors"
        :key="index"
        v-show="showThemeColors(item.themeColor)"
        :style="getThemeColorStyle(item.color)"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon
          style="margin: 0.1em 0.1em 0 0"
          :size="17"
          :color="getThemeColor(item.themeColor)"
        >
          <IconifyIconOffline :icon="Check" />
        </el-icon>
      </li>
    </ul>

    <el-divider>界面显示</el-divider>
    <ul class="setting">
      <li>
        <span class="dark:text-white">灰色模式</span>
        <el-switch
          v-model="settings.greyVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="greyChange"
        />
      </li>
      <li>
        <span class="dark:text-white">色弱模式</span>
        <el-switch
          v-model="settings.weakVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="weekChange"
        />
      </li>
      <li>
        <span class="dark:text-white">隐藏标签页</span>
        <el-switch
          v-model="settings.tabsVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="tagsChange"
        />
      </li>
      <li>
        <span class="dark:text-white">侧边栏Logo</span>
        <el-switch
          v-model="logoVal"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="logoChange"
        />
      </li>
      <li>
        <span class="dark:text-white">标签页持久化</span>
        <el-switch
          v-model="settings.multiTagsCache"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="multiTagsCacheChange"
        />
      </li>

      <li>
        <span class="dark:text-white">标签风格</span>
        <el-radio-group v-model="markValue" size="small" @change="onChange">
          <el-radio label="card">卡片</el-radio>
          <el-radio label="smart">灵动</el-radio>
        </el-radio-group>
      </li>
    </ul>

    <el-divider />
    <el-button
      type="danger"
      style="width: 90%; margin: 24px 15px"
      @click="onReset"
    >
      <IconifyIconOffline
        :icon="Logout"
        width="15"
        height="15"
        style="margin-right: 4px"
      />
      清空缓存并返回登录页
    </el-button>
  </panel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px;
  }
}

.pure-datatheme {
  width: 100%;
  height: 50px;
  text-align: center;
  display: block;
  padding-top: 25px;
}

.pure-theme {
  margin-top: 25px;
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  li {
    width: 18%;
    height: 45px;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }
  }
}

.theme-color {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  justify-content: center;

  li {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:nth-child(2) {
      border: 1px solid #ddd;
    }
  }
}
</style>
