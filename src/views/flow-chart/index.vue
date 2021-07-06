<template>
  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      :catTurboData="false"
      @catData="catData"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-Turbo"></div>
    <!-- 数据查看面板 -->
    <el-dialog title="数据" v-model="dataVisible" width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, unref, onMounted } from "vue";
import LogicFlow from "@logicflow/core";
import { Snapshot, BpmnElement, Menu } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { Control, NodePanel, DataDialog } from "/@/components/ReFlowChart";

import { toLogicflowData } from "/@/components/ReFlowChart/src/adpterForTurbo";
import { BpmnNode } from "/@/components/ReFlowChart/src/config";
import demoData from "./dataTurbo.json";
export default {
  components: { NodePanel, Control, DataDialog },
  setup() {
    // eslint-disable-next-line no-undef
    let lf = ref<ElRef>(null);
    let graphData = ref(null);
    let dataVisible = ref(false);
    let config = ref({
      grid: true,
      background: {
        color: "#f7f9ff"
      },
      keyboard: {
        enabled: true
      }
    });
    let nodeList = BpmnNode;

    function initLf() {
      // 画布配置
      LogicFlow.use(Snapshot);
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      LogicFlow.use(BpmnElement);
      // 启动右键菜单
      LogicFlow.use(Menu);
      const domLf = new LogicFlow({
        ...unref(config),
        container: document.querySelector("#LF-Turbo")
      });
      lf.value = domLf;
      // 设置边类型bpmn:sequenceFlow为默认类型
      unref(lf).setDefaultEdgeType("bpmn:sequenceFlow");
      onRender();
    }

    function onRender() {
      // Turbo数据转换为LogicFlow内部识别的数据结构
      const lFData = toLogicflowData(demoData);
      lf.value.render(lFData);
    }

    function catData() {
      graphData.value = unref(lf).getGraphData();
      dataVisible.value = true;
    }

    onMounted(() => {
      initLf();
    });

    return {
      lf,
      graphData,
      dataVisible,
      config,
      nodeList,
      catData
    };
  }
};
</script>

<style scoped>
#LF-Turbo {
  width: 100vw;
  height: 85vh;
  outline: none;
}
.logic-flow-view {
  margin: 10px;
  position: relative;
}
.demo-title {
  text-align: center;
  margin: 20px;
}
.demo-control {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 2;
}
.time-plus {
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
</style>
