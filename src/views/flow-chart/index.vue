<template>
  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      :catTurboData="false"
      @catData="$_catData"
      @catTurboData="$_catTurboData"
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
<script>
import LogicFlow from '@logicflow/core'
import { Snapshot, BpmnElement } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from '/@/components/FlowChart/src/NodePanel.vue'
import Control from '/@/components/FlowChart/src/Control.vue'
import DataDialog from '/@/components/FlowChart/src/DataDialog.vue'
import { toTurboData, toLogicflowData } from '/@/components/FlowChart/src/adpterForTurbo.ts'
import { BpmnNode } from '/@/components/FlowChart/src/config.ts'
import demoData from './dataTurbo.json'

export default {
  name: 'LF',
  components: { NodePanel, Control, DataDialog },
  data() {
    return {
      lf: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        grid: true,
        background: {
          color: '#f7f9ff'
        },
        keyboard: {
          enabled: true
        },
      },
      nodeList: BpmnNode,
    }
  },
  mounted() {
    this.$_initLf()
  },
  methods: {
    $_initLf() {
      // 画布配置
      LogicFlow.use(Snapshot)
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      LogicFlow.use(BpmnElement)
      const lf = new LogicFlow({ ...this.config, container: document.querySelector('#LF-Turbo') })
      this.lf = lf
      // 设置边类型bpmn:sequenceFlow为默认类型
      lf.setDefaultEdgeType('bpmn:sequenceFlow')
      this.$_render()
    },
    $_render() {
      // Turbo数据转换为LogicFlow内部识别的数据结构
      const lFData = toLogicflowData(demoData)
      this.lf.render(lFData)
    },
    closeDialog() {
      this.$data.dialogVisible = false
    },
    $_catData() {
      this.$data.graphData = this.$data.lf.getGraphData()
      this.$data.dataVisible = true
    },
    $_catTurboData() {
      debugger
      const graphData = this.$data.lf.getGraphData()
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData)
      this.$data.dataVisible = true
    },
    goto() {
      this.$router.push('/')
    }
  }
}
</script>
<style>
.logic-flow-view {
  height: 100%;
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
#LF-Turbo {
  width: 100vw;
  height: 85%;
  outline: none;
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

