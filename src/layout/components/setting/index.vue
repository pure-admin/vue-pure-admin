<template>
  <panel>
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
    const localOperate = (key: string, value?: any, model?: string): any => {
      model && model === "set"
        ? storageLocal.setItem(key, value)
        : storageLocal.getItem(key);
    };

    const settings = reactive({
      greyVal: storageLocal.getItem("greyVal"),
    });

    settings.greyVal === null
      ? localOperate("greyVal", false, "set")
      : document.querySelector("html")?.setAttribute("class", "html-grey");

    // 灰色模式设置
    const greyChange = ({ value }): void => {
      if (value) {
        localOperate("greyVal", true, "set");
        document.querySelector("html")?.setAttribute("class", "html-grey");
      } else {
        localOperate("greyVal", false, "set");
        document.querySelector("html")?.removeAttribute("class");
      }
    };

    return {
      ...toRefs(settings),
      localOperate,
      greyChange,
    };
  },
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
