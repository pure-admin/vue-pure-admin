<script setup lang="ts">
import splitpane, { ContextProps } from "/@/components/ReSplitPane";
import { reactive } from "vue";

defineOptions({
  name: "SplitPane"
});

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
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">切割面板组件</span>
      </div>
    </template>
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
  </el-card>
</template>

<style lang="scss" scoped>
$W: 100%;
$H: 70vh;

.split-pane {
  width: 70vw;
  height: $H;
  text-align: center;
  font-size: 50px;
  color: #fff;
  border: 1px solid #e5e6eb;

  .dv-a,
  .dv-b,
  .dv-c {
    width: $W;
    height: $W;
    color: rgba($color: dodgerblue, $alpha: 0.8);
    line-height: $H;
  }

  .dv-b,
  .dv-c {
    line-height: 250px;
  }

  .dv-b {
    color: rgba($color: #000, $alpha: 0.8);
  }

  .dv-c {
    color: rgba($color: #ce272d, $alpha: 0.8);
  }
}
</style>
