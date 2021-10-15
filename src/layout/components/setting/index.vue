<script setup lang="ts">
import { split } from "lodash-es";
import panel from "../panel/index.vue";
import { useRouter } from "vue-router";
import { emitter } from "/@/utils/mitt";
import { templateRef } from "@vueuse/core";
import { debounce } from "/@/utils/debounce";
import { useAppStoreHook } from "/@/store/modules/app";
import { storageLocal, storageSession } from "/@/utils/storage";
import {
  reactive,
  ref,
  unref,
  watch,
  useCssModule,
  getCurrentInstance
} from "vue";

const router = useRouter();
const { isSelect } = useCssModule();

const instance =
  getCurrentInstance().appContext.app.config.globalProperties.$storage;

// 默认灵动模式
const markValue = ref(storageLocal.getItem("showModel") || "smart");

const logoVal = ref(storageLocal.getItem("logoVal") || "1");

const localOperate = (key: string, value?: any, model?: string): any => {
  model && model === "set"
    ? storageLocal.setItem(key, value)
    : storageLocal.getItem(key);
};

const settings = reactive({
  greyVal: storageLocal.getItem("greyVal"),
  weekVal: storageLocal.getItem("weekVal"),
  tagsVal: storageLocal.getItem("tagsVal")
});

settings.greyVal === null
  ? localOperate("greyVal", false, "set")
  : document.querySelector("html")?.setAttribute("class", "html-grey");

settings.weekVal === null
  ? localOperate("weekVal", false, "set")
  : document.querySelector("html")?.setAttribute("class", "html-weakness");

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "");
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

// 灰色模式设置
const greyChange = ({ value }): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  value
    ? localOperate("greyVal", true, "set")
    : localOperate("greyVal", false, "set");
};

// 色弱模式设置
const weekChange = ({ value }): void => {
  toggleClass(
    settings.weekVal,
    "html-weakness",
    document.querySelector("html")
  );
  value
    ? localOperate("weekVal", true, "set")
    : localOperate("weekVal", false, "set");
};

const tagsChange = () => {
  let showVal = settings.tagsVal;
  showVal
    ? storageLocal.setItem("tagsVal", true)
    : storageLocal.setItem("tagsVal", false);
  emitter.emit("tagViewsChange", showVal);
};

function onReset() {
  storageLocal.clear();
  storageSession.clear();
  router.push("/login");
}

function onChange({ label }) {
  storageLocal.setItem("showModel", label);
  emitter.emit("tagViewsShowModel", label);
}

const verticalDarkDom = templateRef<HTMLElement | null>(
  "verticalDarkDom",
  null
);
const verticalLightDom = templateRef<HTMLElement | null>(
  "verticalLightDom",
  null
);
const horizontalDarkDom = templateRef<HTMLElement | null>(
  "horizontalDarkDom",
  null
);
const horizontalLightDom = templateRef<HTMLElement | null>(
  "horizontalLightDom",
  null
);

let dataTheme =
  ref(storageLocal.getItem("responsive-layout")) ||
  ref({
    layout: "horizontal-dark"
  });

if (unref(dataTheme)) {
  // 设置主题
  let theme = split(unref(dataTheme).layout, "-")[1];
  window.document.body.setAttribute("data-theme", theme);
  // 设置导航模式
  let layout = split(unref(dataTheme).layout, "-")[0];
  window.document.body.setAttribute("data-layout", layout);
}

// 侧边栏Logo
function logoChange() {
  unref(logoVal) === "1"
    ? storageLocal.setItem("logoVal", "1")
    : storageLocal.setItem("logoVal", "-1");
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, isSelect, unref(v));
  });
}

watch(instance, ({ layout }) => {
  switch (layout["layout"]) {
    case "vertical-dark":
      toggleClass(true, isSelect, unref(verticalDarkDom));
      debounce(
        setFalse([verticalLightDom, horizontalDarkDom, horizontalLightDom]),
        50
      );
      break;
    case "vertical-light":
      toggleClass(true, isSelect, unref(verticalLightDom));
      debounce(
        setFalse([verticalDarkDom, horizontalDarkDom, horizontalLightDom]),
        50
      );
      break;
    case "horizontal-dark":
      toggleClass(true, isSelect, unref(horizontalDarkDom));
      debounce(
        setFalse([verticalDarkDom, verticalLightDom, horizontalLightDom]),
        50
      );
      break;
    case "horizontal-light":
      toggleClass(true, isSelect, unref(horizontalLightDom));
      debounce(
        setFalse([verticalDarkDom, verticalLightDom, horizontalDarkDom]),
        50
      );
      break;
  }
});

function setTheme(layout: string, theme: string) {
  dataTheme.value.layout = `${layout}-${theme}`;
  window.document.body.setAttribute("data-layout", layout);
  window.document.body.setAttribute("data-theme", theme);
  instance.layout = { layout: `${layout}-${theme}` };
  useAppStoreHook().setLayout(layout);
}
</script>

<template>
  <panel>
    <el-divider>主题风格</el-divider>
    <ul class="theme-stley">
      <el-tooltip class="item" content="左侧菜单暗色模式" placement="bottom">
        <li
          :class="dataTheme.layout === 'vertical-dark' ? $style.isSelect : ''"
          ref="verticalDarkDom"
          @click="setTheme('vertical', 'dark')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="左侧菜单亮色模式" placement="bottom">
        <li
          :class="dataTheme.layout === 'vertical-light' ? $style.isSelect : ''"
          ref="verticalLightDom"
          @click="setTheme('vertical', 'light')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="顶部菜单暗色模式" placement="bottom">
        <li
          :class="dataTheme.layout === 'horizontal-dark' ? $style.isSelect : ''"
          ref="horizontalDarkDom"
          @click="setTheme('horizontal', 'dark')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" content="顶部菜单亮色模式" placement="bottom">
        <li
          :class="
            dataTheme.layout === 'horizontal-light' ? $style.isSelect : ''
          "
          ref="horizontalLightDom"
          @click="setTheme('horizontal', 'light')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>
    </ul>

    <el-divider>界面显示</el-divider>
    <ul class="setting">
      <li>
        <span>灰色模式</span>
        <vxe-switch
          v-model="settings.greyVal"
          open-label="开"
          close-label="关"
          @change="greyChange"
        ></vxe-switch>
      </li>
      <li>
        <span>色弱模式</span>
        <vxe-switch
          v-model="settings.weekVal"
          open-label="开"
          close-label="关"
          @change="weekChange"
        ></vxe-switch>
      </li>
      <li>
        <span>隐藏标签页</span>
        <vxe-switch
          v-model="settings.tagsVal"
          open-label="开"
          close-label="关"
          @change="tagsChange"
        ></vxe-switch>
      </li>
      <li>
        <span>侧边栏Logo</span>
        <vxe-switch
          v-model="logoVal"
          open-value="1"
          close-value="-1"
          open-label="开"
          close-label="关"
          @change="logoChange"
        ></vxe-switch>
      </li>

      <li>
        <span>标签风格</span>
        <vxe-radio-group v-model="markValue" @change="onChange">
          <vxe-radio label="card" content="卡片"></vxe-radio>
          <vxe-radio label="smart" content="灵动"></vxe-radio>
        </vxe-radio-group>
      </li>
    </ul>

    <el-divider />
    <vxe-button
      status="danger"
      style="width: 90%; margin: 24px 15px"
      content="清空缓存并返回登录页"
      icon="fa fa-sign-out"
      @click="onReset"
    ></vxe-button>
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

.theme-stley {
  margin-top: 25px;
  width: 100%;
  height: 180px;
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
          width: 30%;
          height: 100%;
          box-shadow: 0 0 1px #888;
          background: #fff;
          border-radius: 4px 0 0 4px;
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

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(4) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}
</style>
