<template>
  <panel>
    <el-divider>主题风格</el-divider>
    <ul class="theme-stley">
      <el-tooltip
        class="item"
        effect="dark"
        content="暗色主题"
        placement="bottom"
      >
        <li
          :class="dataTheme === 'dark' ? 'is-select' : ''"
          ref="firstTheme"
          @click="onDark"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="亮色主题"
        placement="bottom"
      >
        <li
          :class="dataTheme === 'light' ? 'is-select' : ''"
          ref="secondTheme"
          @click="onLight"
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
          v-model="greyVal"
          open-label="开"
          close-label="关"
          @change="greyChange"
        ></vxe-switch>
      </li>
      <li>
        <span>色弱模式</span>
        <vxe-switch
          v-model="weekVal"
          open-label="开"
          close-label="关"
          @change="weekChange"
        ></vxe-switch>
      </li>
      <li>
        <span>隐藏标签页</span>
        <vxe-switch
          v-model="tagsVal"
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

<script lang="ts">
import panel from "../panel/index.vue";
import { reactive, toRefs, ref, unref } from "vue";
import { storageLocal, storageSession } from "/@/utils/storage";
import { emitter } from "/@/utils/mitt";
import { useRouter } from "vue-router";
import { templateRef } from "@vueuse/core";
let isSelect = "is-select";

export default {
  name: "setting",
  components: { panel },
  setup() {
    const router = useRouter();

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
      toggleClass(
        settings.greyVal,
        "html-grey",
        document.querySelector("html")
      );
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

    const firstTheme = templateRef<HTMLElement | null>("firstTheme", null);
    const secondTheme = templateRef<HTMLElement | null>("secondTheme", null);

    const dataTheme = ref(storageLocal.getItem("data-theme") || "dark");
    if (dataTheme.value) {
      storageLocal.setItem("data-theme", unref(dataTheme));
      window.document.body.setAttribute("data-theme", unref(dataTheme));
    }

    // dark主题
    function onDark() {
      storageLocal.setItem("data-theme", "dark");
      window.document.body.setAttribute("data-theme", "dark");
      toggleClass(true, isSelect, unref(firstTheme));
      toggleClass(false, isSelect, unref(secondTheme));
    }

    // light主题
    function onLight() {
      storageLocal.setItem("data-theme", "light");
      window.document.body.setAttribute("data-theme", "light");
      toggleClass(false, isSelect, unref(firstTheme));
      toggleClass(true, isSelect, unref(secondTheme));
    }

    function logoChange() {
      unref(logoVal) === "1"
        ? storageLocal.setItem("logoVal", "1")
        : storageLocal.setItem("logoVal", "-1");
      emitter.emit("logoChange", unref(logoVal));
    }

    return {
      ...toRefs(settings),
      localOperate,
      greyChange,
      weekChange,
      tagsChange,
      onReset,
      markValue,
      onChange,
      onDark,
      onLight,
      dataTheme,
      logoVal,
      logoChange
    };
  }
};
</script>

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
  height: 60px;
  display: flex;
  justify-content: space-around;
  li {
    width: 30%;
    height: 100%;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background-color: #f0f2f5;
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
          background-color: #fff;
          box-shadow: 0 0 1px #888888;
          position: absolute;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          box-shadow: 0 0 1px #888888;
          background-color: #fff;
          border-radius: 4px 0 0 4px;
        }
        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background-color: #fff;
          box-shadow: 0 0 1px #888888;
          position: absolute;
        }
      }
    }
  }
}
.is-select {
  border: 2px solid #0960bd;
}
</style>
