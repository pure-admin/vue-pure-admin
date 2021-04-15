<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="添加动作">
      <div v-for="item in nodeList" :key="item.type">
        <el-button
          class="add-node-btn"
          type="primary"
          size="mini"
          @click="$_addNode(item)"
        >{{item.label}}</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="添加组">
      <el-button class="add-node-btn" type="primary" size="mini" @click="$_addTempalte">模板</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'AddPanel',
  props: {
    nodeData: Object,
    lf: Object || String
  },
  data() {
    return {
      nodeList: [
        {
          type: 'user',
          label: '用户'
        },
        {
          type: 'push',
          label: '推送'
        }
      ]
    }
  },
  methods: {
    $_addNode(item) {
      const { lf, nodeData } = this.$props
      const { id, x, y } = nodeData
      const nextNode = lf.addNode({
        type: item.type,
        x: x + 150,
        y: y + 150
      })
      const nextId = nextNode.id
      lf.createEdge({ sourceNodeId: id, targetNodeId: nextId })
      this.$emit('addNodeFinish')
    },
    $_addTempalte() {
      const { lf, nodeData } = this.$props
      const { id, x, y } = nodeData
      const timeNode = lf.addNode({
        type: 'download',
        x,
        y: y + 150
      })
      const userNode = lf.addNode({
        type: 'user',
        x: x + 150,
        y: y + 150
      })
      const pushNode = lf.addNode({
        type: 'push',
        x: x + 150,
        y: y + 300,
        properties: {}
      })
      const endNode = lf.addNode({
        type: 'end',
        x: x + 300,
        y: y + 150
      })
      const endNode2 = lf.addNode({
        type: 'end',
        x: x + 300,
        y: y + 300
      })
      lf.createEdge({ sourceNodeId: id, targetNodeId: timeNode.id })
      lf.createEdge({ sourceNodeId: timeNode.id, targetNodeId: userNode.id })
      lf.createEdge({
        sourceNodeId: userNode.id,
        targetNodeId: endNode.id,
        endPoint: { x: x + 280, y: y + 150 },
        text: {
          value: 'Y',
          x: x + 230,
          y: y + 140
        }
      })
      lf.createEdge({
        sourceNodeId: userNode.id,
        targetNodeId: pushNode.id,
        text: {
          value: 'N',
          x: x + 160,
          y: y + 230
        }
      })
      lf.createEdge({ sourceNodeId: pushNode.id, targetNodeId: endNode2.id, endPoint: { x: x + 280, y: y + 300 } })
      this.$emit('addNodeFinish')
    }
  }
}
</script>

<style scoped>
.add-node-btn {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
