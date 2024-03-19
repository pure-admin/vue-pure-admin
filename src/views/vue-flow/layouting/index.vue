<script lang="ts" setup>
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import dagre from "dagre";
import { ref, nextTick } from "vue";
import ProcessNode from "./processNode.vue";
import AnimationEdge from "./animationEdge.vue";
import { useRunProcess } from "./useRunProcess";
import { initialEdges, initialNodes } from "./initialElements";
import {
  ConnectionMode,
  Panel,
  Position,
  VueFlow,
  useVueFlow
} from "@vue-flow/core";

const nodes = ref(initialNodes);

const edges = ref(initialEdges);

const dagreGraph = ref(new dagre.graphlib.Graph());

dagreGraph.value.setDefaultEdgeLabel(() => ({}));

const { run, stop, isRunning } = useRunProcess(dagreGraph);

const { findNode, fitView } = useVueFlow();

function handleLayout(direction: "TB" | "LR") {
  dagreGraph.value = new dagre.graphlib.Graph();
  dagreGraph.value.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.value.setGraph({ rankdir: direction });

  for (const node of nodes.value) {
    const graphNode = findNode(node.id)!;

    dagreGraph.value.setNode(node.id, {
      width: graphNode.dimensions.width || 150,
      height: graphNode.dimensions.height || 50
    });
  }

  for (const edge of edges.value) {
    dagreGraph.value.setEdge(edge.source, edge.target);
  }

  dagre.layout(dagreGraph.value);

  nodes.value = nodes.value.map(node => {
    const nodeWithPosition = dagreGraph.value.node(node.id);

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: { x: nodeWithPosition.x, y: nodeWithPosition.y }
    };
  });

  nextTick(() => {
    fitView();
    run(nodes.value);
  });
}
</script>

<template>
  <div class="layoutflow">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :connection-mode="ConnectionMode.Loose"
      @nodes-initialized="handleLayout('LR')"
    >
      <template #node-process="props">
        <ProcessNode v-bind="props" />
      </template>

      <template #edge-animation="props">
        <AnimationEdge v-bind="props" />
      </template>

      <Panel class="layout-panel" position="top-left">
        <button @click="handleLayout('TB')">垂直模式</button>
        <button @click="handleLayout('LR')">水平模式</button>
      </Panel>

      <Panel class="process-panel" position="top-right">
        <button v-if="isRunning" @click="stop">🛑</button>
        <button v-else @click="run(nodes)">▶️</button>
      </Panel>
    </VueFlow>
  </div>
</template>

<style scoped>
.main-content {
  margin: 0 !important;
}

.layoutflow {
  width: 100%;
  height: 100%;

  /* background-color: #1a192b; */
}

.process-panel,
.layout-panel {
  display: flex;
  gap: 10px;
}

.process-panel button,
.layout-panel button {
  color: white;
  cursor: pointer;
  background-color: #2d3748;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
}

.process-panel button {
  width: 50px;
  height: 50px;
  font-size: 24px;
}

.process-panel button:hover,
.layout-panel button:hover {
  background-color: #4b5563;
  transition: background-color 0.2s;
}

.process-panel button:disabled {
  cursor: not-allowed;
  background-color: #4b5563;
}

.layout-panel button {
  padding: 10px;
}
</style>
