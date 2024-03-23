<script setup lang="ts">
import {
  ref,
  unref,
  watch,
  reactive,
  computed,
  nextTick,
  onUnmounted,
  onBeforeMount
} from "vue";
import panel from "../panel/index.vue";
import { emitter } from "@/utils/mitt";
import { useNav } from "@/layout/hooks/useNav";
import { useAppStoreHook } from "@/store/modules/app";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useDark, useGlobal, debounce, isNumber } from "@pureadmin/utils";

import Check from "@iconify-icons/ep/check";
import LeftArrow from "@iconify-icons/ri/arrow-left-s-line";
import RightArrow from "@iconify-icons/ri/arrow-right-s-line";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import systemIcon from "@/assets/svg/system.svg?component";

const { device } = useNav();
const { isDark } = useDark();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const mixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const {
  dataTheme,
  overallStyle,
  layoutTheme,
  themeColors,
  toggleClass,
  dataThemeChange,
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
  hideFooter: $storage.configure.hideFooter,
  multiTagsCache: $storage.configure.multiTagsCache,
  stretch: $storage.configure.stretch
});

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

/** 当网页整体为暗色风格时不显示亮白色主题配色切换选项 */
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

/** 灰色模式设置 */
const greyChange = (value): void => {
  const htmlEl = document.querySelector("html");
  toggleClass(settings.greyVal, "html-grey", htmlEl);
  storageConfigureChange("grey", value);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  const htmlEl = document.querySelector("html");
  toggleClass(settings.weakVal, "html-weakness", htmlEl);
  storageConfigureChange("weak", value);
};

/** 隐藏标签页设置 */
const tagsChange = () => {
  const showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal as unknown as string);
};

/** 隐藏页脚设置 */
const hideFooterChange = () => {
  const hideFooter = settings.hideFooter;
  storageConfigureChange("hideFooter", hideFooter);
};

/** 标签页持久化设置 */
const multiTagsCacheChange = () => {
  const multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

function onChange({ option }) {
  const { value } = option;
  markValue.value = value;
  storageConfigureChange("showModel", value);
  emitter.emit("tagViewsShowModel", value);
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

/** 页宽 */
const stretchTypeOptions: Array<OptionsType> = [
  {
    label: "固定",
    tip: "紧凑页面，轻松找到所需信息",
    value: "fixed"
  },
  {
    label: "自定义",
    tip: "最小1280、最大1600",
    value: "custom"
  }
];

const setStretch = value => {
  settings.stretch = value;
  storageConfigureChange("stretch", value);
};

const stretchTypeChange = ({ option }) => {
  const { value } = option;
  value === "custom" ? setStretch(1440) : setStretch(false);
};

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

const pClass = computed(() => {
  return ["mb-[12px]", "font-medium", "text-sm", "dark:text-white"];
});

const themeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: "浅色",
      icon: dayIcon,
      theme: "light",
      tip: "清新启航，点亮舒适的工作界面",
      iconAttrs: { fill: isDark.value ? "#fff" : "#000" }
    },
    {
      label: "深色",
      icon: darkIcon,
      theme: "dark",
      tip: "月光序曲，沉醉于夜的静谧雅致",
      iconAttrs: { fill: isDark.value ? "#fff" : "#000" }
    },
    {
      label: "自动",
      icon: systemIcon,
      theme: "system",
      tip: "同步时光，界面随晨昏自然呼应",
      iconAttrs: { fill: isDark.value ? "#fff" : "#000" }
    }
  ];
});

const markOptions: Array<OptionsType> = [
  {
    label: "灵动",
    tip: "灵动标签，添趣生辉",
    value: "smart"
  },
  {
    label: "卡片",
    tip: "卡片标签，高效浏览",
    value: "card"
  }
];

/** 设置导航模式 */
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  $storage.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: $storage.layout?.darkMode,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor,
    themeColor: $storage.layout?.themeColor,
    overallStyle: $storage.layout?.overallStyle
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

const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

/** 根据操作系统主题设置平台整体风格 */
function updateTheme() {
  if (overallStyle.value !== "system") return;
  if (mediaQueryList.matches) {
    dataTheme.value = true;
  } else {
    dataTheme.value = false;
  }
  dataThemeChange(overallStyle.value);
}

function removeMatchMedia() {
  mediaQueryList.removeEventListener("change", updateTheme);
}

/** 监听操作系统主题改变 */
function watchSystemThemeChange() {
  updateTheme();
  removeMatchMedia();
  mediaQueryList.addEventListener("change", updateTheme);
}

onBeforeMount(() => {
  /* 初始化项目配置 */
  nextTick(() => {
    watchSystemThemeChange();
    settings.greyVal &&
      document.querySelector("html")?.classList.add("html-grey");
    settings.weakVal &&
      document.querySelector("html")?.classList.add("html-weakness");
    settings.tabsVal && tagsChange();
    settings.hideFooter && hideFooterChange();
  });
});

onUnmounted(() => removeMatchMedia);
</script>

<template>
  <panel>
    <div class="p-5">
      <p :class="pClass">整体风格</p>
      <Segmented
        class="select-none"
        :modelValue="overallStyle === 'system' ? 2 : dataTheme ? 1 : 0"
        :options="themeOptions"
        @change="
          theme => {
            theme.index === 1 && theme.index !== 2
              ? (dataTheme = true)
              : (dataTheme = false);
            overallStyle = theme.option.theme;
            dataThemeChange(theme.option.theme);
            theme.index === 2 && watchSystemThemeChange();
          }
        "
      />

      <p :class="['mt-5', pClass]">主题色</p>
      <ul class="theme-color">
        <li
          v-for="(item, index) in themeColors"
          v-show="showThemeColors(item.themeColor)"
          :key="index"
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

      <p :class="['mt-5', pClass]">导航模式</p>
      <ul class="pure-theme">
        <li
          ref="verticalRef"
          v-tippy="{
            content: '左侧菜单，亲切熟悉',
            zIndex: 41000
          }"
          :class="layoutTheme.layout === 'vertical' ? 'is-select' : ''"
          @click="setLayoutModel('vertical')"
        >
          <div />
          <div />
        </li>
        <li
          v-if="device !== 'mobile'"
          ref="horizontalRef"
          v-tippy="{
            content: '顶部菜单，简洁概览',
            zIndex: 41000
          }"
          :class="layoutTheme.layout === 'horizontal' ? 'is-select' : ''"
          @click="setLayoutModel('horizontal')"
        >
          <div />
          <div />
        </li>
        <li
          v-if="device !== 'mobile'"
          ref="mixRef"
          v-tippy="{
            content: '混合菜单，灵活多变',
            zIndex: 41000
          }"
          :class="layoutTheme.layout === 'mix' ? 'is-select' : ''"
          @click="setLayoutModel('mix')"
        >
          <div />
          <div />
        </li>
      </ul>

      <span v-if="useAppStoreHook().getViewportWidth > 1280">
        <p :class="['mt-5', pClass]">页宽</p>
        <Segmented
          class="mb-2 select-none"
          :modelValue="isNumber(settings.stretch) ? 1 : 0"
          :options="stretchTypeOptions"
          @change="stretchTypeChange"
        />
        <el-input-number
          v-if="isNumber(settings.stretch)"
          v-model="settings.stretch as number"
          :min="1280"
          :max="1600"
          controls-position="right"
          @change="value => setStretch(value)"
        />
        <button
          v-else
          v-ripple="{ class: 'text-gray-300' }"
          class="bg-transparent flex-c w-full h-20 rounded-md border border-[var(--pure-border-color)]"
          @click="setStretch(!settings.stretch)"
        >
          <div
            class="flex-bc transition-all duration-300"
            :class="[settings.stretch ? 'w-[24%]' : 'w-[50%]']"
            style="color: var(--el-color-primary)"
          >
            <IconifyIconOffline
              :icon="settings.stretch ? RightArrow : LeftArrow"
              height="20"
            />
            <div
              class="flex-grow border-b border-dashed"
              style="border-color: var(--el-color-primary)"
            />
            <IconifyIconOffline
              :icon="settings.stretch ? LeftArrow : RightArrow"
              height="20"
            />
          </div>
        </button>
      </span>

      <p :class="['mt-4', pClass]">页签风格</p>
      <Segmented
        class="select-none"
        :modelValue="markValue === 'smart' ? 0 : 1"
        :options="markOptions"
        @change="onChange"
      />

      <p class="mt-5 font-medium text-sm dark:text-white">界面显示</p>
      <ul class="setting">
        <li>
          <span class="dark:text-white">灰色模式</span>
          <el-switch
            v-model="settings.greyVal"
            inline-prompt
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
            active-text="开"
            inactive-text="关"
            @change="tagsChange"
          />
        </li>
        <li>
          <span class="dark:text-white">隐藏页脚</span>
          <el-switch
            v-model="settings.hideFooter"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="hideFooterChange"
          />
        </li>
        <li>
          <span class="dark:text-white">Logo</span>
          <el-switch
            v-model="logoVal"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="开"
            inactive-text="关"
            @change="logoChange"
          />
        </li>
        <li>
          <span class="dark:text-white">页签持久化</span>
          <el-switch
            v-model="settings.multiTagsCache"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="multiTagsCacheChange"
          />
        </li>
      </ul>
    </div>
  </panel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.el-switch__core) {
  --el-switch-off-color: var(--pure-switch-off-color);

  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

.theme-color {
  height: 20px;

  li {
    float: left;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 4px;

    &:nth-child(1) {
      border: 1px solid #ddd;
    }
  }
}

.pure-theme {
  display: flex;
  gap: 12px;

  li {
    position: relative;
    width: 46px;
    height: 36px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
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
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
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
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
