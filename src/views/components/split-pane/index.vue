<template>
  <div class="split-pane">
    <splitpane :splitSet="settingLR">
      <!-- #paneL 表示指定该组件为左侧面板 -->
      <template #paneL>
        <!-- 自定义左侧面板的内容 -->
        <div class="dv-a">A</div>
      </template>
      <!-- #paneR 表示指定该组件为右侧面板 -->
      <template #paneR>
        <!-- 再次将右侧面板进行拆分 -->
        <splitpane :splitSet="settingTB">
          <template #paneL>
            <div class="dv-b">B</div>
          </template>
          <template #paneR>
            <div class="dv-c">C</div>
          </template>
        </splitpane>
      </template>
    </splitpane>
  </div>
</template>

<script lang="ts">
import splitpane, { ContextProps } from "/@/components/ReSplitPane";
import { reactive } from "vue";
export default {
  name: "split",
  components: {
    splitpane
  },
  setup() {
    const settingLR: ContextProps = reactive({
      minPercent: 20,
      defaultPercent: 40,
      split: "vertical"
    });

    const settingTB: ContextProps = reactive({
      minPercent: 20,
      defaultPercent: 40,
      split: "horizontal"
    });

    return {
      settingLR,
      settingTB
    };
  }
};
</script>

<style lang="scss" scoped>
$W: 100%;
$H: 80vh;
.split-pane {
  width: 98%;
  height: $H;
  margin-top: 5px;
  text-align: center;
  font-size: 50px;
  color: #fff;
  .dv-a,
  .dv-b,
  .dv-c {
    width: $W;
    height: $W;
    background: rgba($color: dodgerblue, $alpha: 0.8);
    line-height: $H;
  }
  .dv-b,
  .dv-c {
    line-height: 250px;
  }
  .dv-b {
    background: rgba($color: #000, $alpha: 0.8);
  }
  .dv-c {
    background: rgba($color: #ce272d, $alpha: 0.8);
  }
}
</style>
