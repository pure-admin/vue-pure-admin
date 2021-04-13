<template>
  <div id="container"></div>
</template>

<script lang='ts'>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { onMounted } from "vue";

const data = {
  // 节点
  nodes: [
    {
      id: 50,
      type: "rect",
      x: 100,
      y: 150,
      text: "你好",
    },
    {
      id: 21,
      type: "circle",
      x: 300,
      y: 150,
    },
  ],
  // 边
  edges: [
    {
      type: "polyline",
      sourceNodeId: 50,
      targetNodeId: 21,
    },
  ],
};
export default {
  setup() {
    onMounted(() => {
      const lf = new LogicFlow({
        container: document.querySelector("#container"),
        stopScrollGraph: true,
        stopZoomGraph: true,
        width: 500,
        height: 500,
        grid: {
          type: "dot",
          size: 20,
        },
      });

      lf.render(data);
    });

    return {};
  },
};
</script>

<style scoped>
</style>
