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
import rgbHex from "rgb-hex";
import { find } from "lodash-es";
import { getConfig } from "/@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import dayIcon from "/@/assets/svg/day.svg";
import { debounce } from "/@/utils/debounce";
import darkIcon from "/@/assets/svg/dark.svg";
import { themeColorsType } from "../../types";
import { useAppStoreHook } from "/@/store/modules/app";
import { shadeBgColor } from "../../theme/element-plus";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { storageLocal, storageSession } from "/@/utils/storage";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { createNewStyle, writeNewStyle } from "../../theme/element-plus";
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";

const router = useRouter();
const { isSelect } = useCssModule();
const body = document.documentElement as HTMLElement;
const instance =
  getCurrentInstance().appContext.app.config.globalProperties.$storage;

const instanceConfig =
  getCurrentInstance().appContext.app.config.globalProperties.$config;

let themeColors = ref<Array<themeColorsType>>([
  // 道奇蓝（默认）
  { rgb: "27, 42, 71", themeColor: "default" },
  // 亮白色
  { rgb: "255, 255, 255", themeColor: "light" },
  // 猩红色
  { rgb: "245, 34, 45", themeColor: "dusk" },
  // 橙红色
  { rgb: "250, 84, 28", themeColor: "volcano" },
  // 金色
  { rgb: "250, 219, 20", themeColor: "yellow" },
  // 绿宝石
  { rgb: "19, 194, 194", themeColor: "mingQing" },
  // 酸橙绿
  { rgb: "82, 196, 26", themeColor: "auroraGreen" },
  // 深粉色
  { rgb: "235, 47, 150", themeColor: "pink" },
  // 深紫罗兰色
  { rgb: "114, 46, 209", themeColor: "saucePurple" }
]);

const verticalRef = templateRef<HTMLElement | null>("verticalRef", null);
const horizontalRef = templateRef<HTMLElement | null>("horizontalRef", null);

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
  return rgb => {
    return { background: `rgb(${rgb})` };
  };
});

function changeStorageConfigure(key, val) {
  const storageConfigure = instance.configure;
  storageConfigure[key] = val;
  instance.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "");
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

// 灰色模式设置
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  changeStorageConfigure("grey", value);
};

// 色弱模式设置
const weekChange = (value): void => {
  toggleClass(
    settings.weakVal,
    "html-weakness",
    document.querySelector("html")
  );
  changeStorageConfigure("weak", value);
};

const tagsChange = () => {
  let showVal = settings.tabsVal;
  changeStorageConfigure("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal);
};

const multiTagsCacheChange = () => {
  let multiTagsCache = settings.multiTagsCache;
  changeStorageConfigure("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

// 清空缓存并返回登录页
function onReset() {
  toggleClass(getConfig().Grey, "html-grey", document.querySelector("html"));
  toggleClass(
    getConfig().Weak,
    "html-weakness",
    document.querySelector("html")
  );
  useMultiTagsStoreHook().handleTags("equal", [
    {
      path: "/welcome",
      parentPath: "/",
      meta: {
        title: "menus.hshome",
        icon: "HomeFilled",
        i18n: true,
        showLink: true
      }
    }
  ]);
  useMultiTagsStoreHook().multiTagsCacheChange(getConfig().MultiTagsCache);
  useEpThemeStoreHook().setEpThemeColor(getConfig().EpThemeColor);
  storageLocal.clear();
  storageSession.clear();
  router.push("/login");
}

function onChange(label) {
  changeStorageConfigure("showModel", label);
  emitter.emit("tagViewsShowModel", label);
}

// 侧边栏Logo
function logoChange() {
  unref(logoVal)
    ? changeStorageConfigure("showLogo", true)
    : changeStorageConfigure("showLogo", false);
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, isSelect, unref(v));
  });
}

watch(instance, ({ layout }) => {
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, isSelect, unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, isSelect, unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
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
    const color = "#" + rgbHex(colors.rgb);
    setEpThemeColor(color);
  }
}

// 设置ep主题色
const setEpThemeColor = (color: string) => {
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
    >
    </el-switch>

    <el-divider>导航栏模式</el-divider>
    <ul class="pure-theme">
      <el-tooltip class="item" content="左侧菜单模式" placement="bottom">
        <li
          :class="layoutTheme.layout === 'vertical' ? $style.isSelect : ''"
          ref="verticalRef"
          @click="setLayoutModel('vertical')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="顶部菜单模式" placement="bottom">
        <li
          :class="layoutTheme.layout === 'horizontal' ? $style.isSelect : ''"
          ref="horizontalRef"
          @click="setLayoutModel('horizontal')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>
    </ul>

    <el-divider v-show="!dataTheme">主题色</el-divider>
    <ul class="theme-color" v-show="!dataTheme">
      <li
        v-for="(item, index) in themeColors"
        :key="index"
        :style="getThemeColorStyle(item.rgb)"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon
          style="margin: 0.1em 0.1em 0 0"
          :size="17"
          :color="getThemeColor(item.themeColor)"
        >
          <Check />
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
        >
        </el-switch>
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
        >
        </el-switch>
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
        >
        </el-switch>
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
        >
        </el-switch>
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
        >
        </el-switch>
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
      <i class="fa fa-sign-out"></i>
      清空缓存并返回登录页</el-button
    >
  </panel>
</template>

<style scoped module>
.isSelect {
  border: 2px solid #0960bd;
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
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  li {
    margin: 10px;
    width: 36%;
    height: 70px;
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
