<script lang="ts" setup>
import { computed, nextTick, ref, toRef, watch } from "vue";
import { TransitionPresets, executeTransition } from "@vueuse/core";
import {
  Position,
  BaseEdge,
  useVueFlow,
  useNodesData,
  getSmoothStepPath,
  EdgeLabelRenderer
} from "@vue-flow/core";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  sourceX: {
    type: Number,
    required: true
  },
  sourceY: {
    type: Number,
    required: true
  },
  targetX: {
    type: Number,
    required: true
  },
  targetY: {
    type: Number,
    required: true
  },
  sourcePosition: {
    type: String,
    default: Position.Right
  },
  targetPosition: {
    type: String,
    default: Position.Left
  }
});

const { findEdge } = useVueFlow();

const nodesData = useNodesData([props.target, props.source]);

const edgePoint = ref(0);

const edgeRef = ref();

const labelPosition = ref({ x: 0, y: 0 });

const currentLength = ref(0);

const targetNodeData = toRef(() => nodesData.value[0].data);

const sourceNodeData = toRef(() => nodesData.value[1].data);

const isFinished = toRef(() => sourceNodeData.value.isFinished);

const isCancelled = toRef(() => targetNodeData.value.isCancelled);

const isAnimating = ref(false);

const edgeColor = toRef(() => {
  if (targetNodeData.value.hasError) {
    return "#f87171";
  }

  if (targetNodeData.value.isFinished) {
    return "#42B983";
  }

  if (targetNodeData.value.isCancelled || targetNodeData.value.isSkipped) {
    return "#fbbf24";
  }

  if (targetNodeData.value.isRunning || isAnimating.value) {
    return "#2563eb";
  }

  return "#6b7280";
});

// @ts-expect-error
const path = computed(() => getSmoothStepPath(props));

watch(isCancelled, isCancelled => {
  if (isCancelled) {
    reset();
  }
});

watch(isAnimating, isAnimating => {
  const edge = findEdge(props.id);

  if (edge) {
    edge.data = {
      ...edge.data,
      isAnimating
    };
  }
});

watch(edgePoint, point => {
  const pathEl = edgeRef.value?.pathEl;

  if (!pathEl || point === 0 || !isAnimating.value) {
    return;
  }

  const nextLength = pathEl.getTotalLength();

  if (currentLength.value !== nextLength) {
    runAnimation();
    return;
  }

  labelPosition.value = pathEl.getPointAtLength(point);
});

watch(isFinished, isFinished => {
  if (isFinished) {
    runAnimation();
  }
});

async function runAnimation() {
  const pathEl = edgeRef.value?.pathEl;

  if (!pathEl) {
    return;
  }

  const totalLength = pathEl.getTotalLength();

  const from = edgePoint.value || 0;

  labelPosition.value = pathEl.getPointAtLength(from);

  isAnimating.value = true;

  if (currentLength.value !== totalLength) {
    currentLength.value = totalLength;
  }

  await executeTransition(edgePoint, from, totalLength, {
    transition: TransitionPresets.easeInOutCubic,
    duration: Math.max(1500, totalLength / 2),
    abort: () => !isAnimating.value
  });

  reset();
}

function reset() {
  nextTick(() => {
    edgePoint.value = 0;
    currentLength.value = 0;
    labelPosition.value = { x: 0, y: 0 };
    isAnimating.value = false;
  });
}
</script>

<template>
  <BaseEdge
    :id="id"
    ref="edgeRef"
    :path="path[0]"
    :style="{ stroke: edgeColor }"
  />

  <EdgeLabelRenderer v-if="isAnimating">
    <div
      :style="{
        transform: `translate(-50%, -50%) translate(${labelPosition.x}px,${labelPosition.y}px)`
      }"
      class="nodrag nopan animated-edge-label"
    >
      <span class="truck">
        <span class="box">📦</span>
        🚚
      </span>
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.animated-edge-label {
  position: absolute;
  z-index: 100;
}

.truck {
  position: relative;
  display: inline-block;
  transform: scaleX(-1);
}

.box {
  position: absolute;
  top: -10px;
}
</style>
