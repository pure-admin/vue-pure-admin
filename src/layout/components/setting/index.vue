<script setup lang="ts">
import {
  reactive,
  ref,
  unref,
  watch,
  computed,
  nextTick,
  useCssModule,
  getCurrentInstance
} from "vue";
import { find } from "lodash-unified";
import { getConfig } from "/@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import { debounce } from "/@/utils/debounce";
import { themeColorsType } from "../../types";
import { routerArrays } from "/@/layout/types";
import { useAppStoreHook } from "/@/store/modules/app";
import { shadeBgColor } from "../../theme/element-plus";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { storageLocal, storageSession } from "/@/utils/storage";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { createNewStyle, writeNewStyle } from "../../theme/element-plus";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";

import dayIcon from "/@/assets/svg/day.svg?component";
import darkIcon from "/@/assets/svg/dark.svg?component";

const router = useRouter();
const { isSelect } = useCssModule();
const body = document.documentElement as HTMLElement;
const instance =
  getCurrentInstance().appContext.app.config.globalProperties.$storage;

const instanceConfig =
  getCurrentInstance().appContext.app.config.globalProperties.$config;

let themeColors = ref<Array<themeColorsType>>([
  // 道奇蓝（默认）
  { color: "#1b2a47", themeColor: "default" },
  // 亮白色
  { color: "#ffffff", themeColor: "light" },
  // 猩红色
  { color: "#f5222d", themeColor: "dusk" },
  // 橙红色
  { color: "#fa541c", themeColor: "volcano" },
  // 金色
  { color: "#fadb14", themeColor: "yellow" },
  // 绿宝石
  { color: "#13c2c2", themeColor: "mingQing" },
  // 酸橙绿
  { color: "#52c41a", themeColor: "auroraGreen" },
  // 深粉色
  { color: "#eb2f96", themeColor: "pink" },
  // 深紫罗兰色
  { color: "#722ed1", themeColor: "saucePurple" }
]);

const verticalRef = templateRef<HTMLElement | null>("verticalRef", null);
const horizontalRef = templateRef<HTMLElement | null>("horizontalRef", null);
const mixRef = templateRef<HTMLElement | null>("mixRef", null);

let layoutTheme =
  ref(storageLocal.getItem("responsive-layout")) ||
  ref({
    layout: instanceConfig?.Layout ?? "vertical",
    theme: instanceConfig?.Theme ?? "default"
  });

// body添加layout属性，作用于src/style/sidebar.scss
if (unref(layoutTheme)) {
  let layout = unref(layoutTheme).layout;
  let theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  setLayoutModel(layout);
}

// 默认灵动模式
const markValue = ref(instance.configure?.showModel ?? "smart");

const logoVal = ref(instance.configure?.showLogo ?? true);

const epThemeColor = ref(useEpThemeStoreHook().getEpThemeColor);

const settings = reactive({
  greyVal: instance.configure.grey,
  weakVal: instance.configure.weak,
  tabsVal: instance.configure.hideTabs,
  showLogo: instance.configure.showLogo,
  showModel: instance.configure.showModel,
  multiTagsCache: instance.configure.multiTagsCache
});

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = instance.configure;
  storageConfigure[key] = val;
  instance.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

// 灰色模式设置
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  storageConfigureChange("grey", value);
};

// 色弱模式设置
const weekChange = (value): void => {
  toggleClass(
    settings.weakVal,
    "html-weakness",
    document.querySelector("html")
  );
  storageConfigureChange("weak", value);
};

const tagsChange = () => {
  let showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal);
};

const multiTagsCacheChange = () => {
  let multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

// 清空缓存并返回登录页
function onReset() {
  router.push("/login");
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  useEpThemeStoreHook().setEpThemeColor(EpThemeColor);
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
  storageLocal.clear();
  storageSession.clear();
}

function onChange(label) {
  storageConfigureChange("showModel", label);
  emitter.emit("tagViewsShowModel", label);
}

// 侧边栏Logo
function logoChange() {
  unref(logoVal)
    ? storageConfigureChange("showLogo", true)
    : storageConfigureChange("showLogo", false);
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, isSelect, unref(v));
  });
}

watch(instance, ({ layout }) => {
  // 设置wangeditorV5主题色
  body.style.setProperty("--w-e-toolbar-active-color", layout["epThemeColor"]);
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, isSelect, unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, isSelect, unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "mix":
      toggleClass(true, isSelect, unref(mixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      break;
  }
});

// 主题色 激活选择项
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

// 设置导航模式
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  instance.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: instance.layout.darkMode,
    sidebarStatus: instance.layout.sidebarStatus,
    epThemeColor: instance.layout.epThemeColor
  };
  useAppStoreHook().setLayout(layout);
}

// 存放夜间主题切换前的导航主题色
let tempLayoutThemeColor;

// 设置导航主题色
function setLayoutThemeColor(theme: string) {
  tempLayoutThemeColor = instance.layout.theme;
  layoutTheme.value.theme = theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  instance.layout = {
    layout: useAppStoreHook().layout,
    theme,
    darkMode: dataTheme.value,
    sidebarStatus: instance.layout.sidebarStatus,
    epThemeColor: instance.layout.epThemeColor
  };

  if (theme === "default" || theme === "light") {
    setEpThemeColor(getConfig().EpThemeColor);
  } else {
    const colors = find(themeColors.value, { themeColor: theme });
    setEpThemeColor(colors.color);
  }
}

// 设置ep主题色
const setEpThemeColor = (color: string) => {
  // @ts-expect-error
  writeNewStyle(createNewStyle(color));
  useEpThemeStoreHook().setEpThemeColor(color);
  body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
};

let dataTheme = ref<boolean>(instance.layout.darkMode);

// 日间、夜间主题切换
function dataThemeChange() {
  if (dataTheme.value) {
    body.setAttribute("data-theme", "dark");
    setLayoutThemeColor("light");
  } else {
    body.setAttribute("data-theme", "");
    tempLayoutThemeColor && setLayoutThemeColor(tempLayoutThemeColor);
    instance.layout = {
      layout: useAppStoreHook().layout,
      theme: instance.layout.theme,
      darkMode: dataTheme.value,
      sidebarStatus: instance.layout.sidebarStatus,
      epThemeColor: instance.layout.epThemeColor
    };
  }
}

//初始化项目配置
nextTick(() => {
  settings.greyVal &&
    document.querySelector("html")?.setAttribute("class", "html-grey");
  settings.weakVal &&
    document.querySelector("html")?.setAttribute("class", "html-weakness");
  settings.tabsVal && tagsChange();
  // @ts-expect-error
  writeNewStyle(createNewStyle(epThemeColor.value));
  dataThemeChange();
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
      <el-tooltip class="item" content="左侧模式" placement="bottom">
        <li
          :class="layoutTheme.layout === 'vertical' ? $style.isSelect : ''"
          ref="verticalRef"
          @click="setLayoutModel('vertical')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="顶部模式" placement="bottom">
        <li
          :class="layoutTheme.layout === 'horizontal' ? $style.isSelect : ''"
          ref="horizontalRef"
          @click="setLayoutModel('horizontal')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="混合模式" placement="bottom">
        <li
          :class="layoutTheme.layout === 'mix' ? $style.isSelect : ''"
          ref="mixRef"
          @click="setLayoutModel('mix')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>
    </ul>

    <el-divider v-show="!dataTheme">主题色</el-divider>
    <ul class="theme-color" v-show="!dataTheme">
      <li
        v-for="(item, index) in themeColors"
        :key="index"
        :style="getThemeColorStyle(item.color)"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon
          style="margin: 0.1em 0.1em 0 0"
          :size="17"
          :color="getThemeColor(item.themeColor)"
        >
          <IconifyIconOffline icon="check" />
        </el-icon>
      </li>
    </ul>

    <el-divider>界面显示</el-divider>
    <ul class="setting">
      <li v-show="!dataTheme">
        <span>灰色模式</span>
        <el-switch
          v-model="settings.greyVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="greyChange"
        />
      </li>
      <li v-show="!dataTheme">
        <span>色弱模式</span>
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
        <span>隐藏标签页</span>
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
        <span>侧边栏Logo</span>
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
        <span>标签页持久化</span>
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
        <span>标签风格</span>
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
        icon="fa-sign-out"
        width="15"
        height="15"
        style="margin-right: 4px"
      />
      清空缓存并返回登录页
    </el-button>
  </panel>
</template>

<style scoped module>
.isSelect {
  border: 2px solid var(--el-color-primary);
}
</style>

<style lang="scss" scoped>
.setting {
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px;
  }
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
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
