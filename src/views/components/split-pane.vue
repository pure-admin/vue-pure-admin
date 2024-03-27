<script setup lang="ts">
import splitpane, { ContextProps } from "@/components/ReSplitPane";
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
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">切割面板</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/split-pane.vue"
          target="_blank"
        >
          代码位置 src/views/components/split-pane.vue
        </el-link>
      </div>
    </template>
    <div class="split-pane">
      <splitpane :splitSet="settingLR">
        <!-- #paneL 表示指定该组件为左侧面板 -->
        <template #paneL>
          <!-- 自定义左侧面板的内容 -->
          <el-scrollbar>
            <div class="dv-a">A</div>
          </el-scrollbar>
        </template>
        <!-- #paneR 表示指定该组件为右侧面板 -->
        <template #paneR>
          <!-- 再次将右侧面板进行拆分 -->
          <splitpane :splitSet="settingTB">
            <template #paneL>
              <el-scrollbar><div class="dv-b">B</div></el-scrollbar>
            </template>
            <template #paneR>
              <el-scrollbar>
                <div class="dv-c">C</div>
              </el-scrollbar>
            </template>
          </splitpane>
        </template>
      </splitpane>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.split-pane {
  width: 100%;
  height: calc(100vh - 300px);
  font-size: 50px;
  text-align: center;
  border: 1px solid #e5e6eb;

  .dv-a {
    padding-top: 30vh;
    color: rgba($color: dodgerblue, $alpha: 80%);
  }

  .dv-b {
    padding-top: 10vh;
    color: rgba($color: #000, $alpha: 80%);
  }

  .dv-c {
    padding-top: 18vh;
    color: rgba($color: #ce272d, $alpha: 80%);
  }
}
</style>
