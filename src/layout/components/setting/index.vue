<template>
  <panel>
    <el-divider>界面显示</el-divider>
    <ul class="setting">
      <li>
        <span>灰色模式</span>
        <vxe-switch v-model="greyVal" open-label="开" close-label="关" @change="greyChange"></vxe-switch>
      </li>
      <li>
        <span>色弱模式</span>
        <vxe-switch v-model="weekVal" open-label="开" close-label="关" @change="weekChange"></vxe-switch>
      </li>
    </ul>
  </panel>
</template>

<script lang='ts'>
import panel from "../panel/index.vue";
import { onMounted, reactive, toRefs } from "vue";
import { storageLocal } from "../../../utils/storage";
export default {
  name: "setting",
  components: { panel },
  setup() {
    function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
      const targetEl = target || document.body;
      let { className } = targetEl;
      className = className.replace(clsName, "");
      targetEl.className = flag ? `${className} ${clsName} ` : className;
    }

    const localOperate = (key: string, value?: any, model?: string): any => {
      model && model === "set"
        ? storageLocal.setItem(key, value)
        : storageLocal.getItem(key);
    };

    const settings = reactive({
      greyVal: storageLocal.getItem("greyVal"),
      weekVal: storageLocal.getItem("weekVal")
    });

    settings.greyVal === null
      ? localOperate("greyVal", false, "set")
      : document.querySelector("html")?.setAttribute("class", "html-grey");

    settings.weekVal === null
      ? localOperate("weekVal", false, "set")
      : document.querySelector("html")?.setAttribute("class", "html-weakness");

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

    return {
      ...toRefs(settings),
      localOperate,
      greyChange,
      weekChange
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
    margin: 16px;
  }
}
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}
</style>
