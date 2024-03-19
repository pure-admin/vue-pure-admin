<script setup lang="ts">
import type { EdgeProps } from "@vue-flow/core";
import { ref, toRef, computed, watch } from "vue";
import { TransitionPresets, executeTransition } from "@vueuse/core";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useNodesData
} from "@vue-flow/core";

const props = defineProps<EdgeProps>();

const edgePoint = ref(0);

const sourceNodeData = useNodesData(() => props.source);

const isFinished = toRef(() => sourceNodeData.value.isFinished);

const isAnimating = ref(false);

const edgeColor = toRef(() => {
  if (sourceNodeData.value.hasError) {
    return "#f87171";
  }

  if (sourceNodeData.value.isFinished) {
    return "#10b981";
  }

  if (sourceNodeData.value.isCancelled) {
    return "#fbbf24";
  }

  if (sourceNodeData.value.isSkipped) {
    return "#f59e0b";
  }

  return "#6b7280";
});

const edgeRef = ref<InstanceType<typeof BaseEdge>>();

const circlePosition = ref({ x: 0, y: 0 });

const currentLength = ref(0);

const path = computed(() => getSmoothStepPath(props));

watch(edgePoint, point => {
  const pathEl = edgeRef.value?.pathEl;

  if (!pathEl || point === 0) {
    return;
  }

  const currLength = pathEl.getTotalLength();

  if (currentLength.value !== currLength) {
    return runAnimation();
  }

  circlePosition.value = pathEl.getPointAtLength(point);
});

watch(isFinished, async (isFinished, _, onCleanup) => {
  if (isFinished) {
    await runAnimation();

    edgePoint.value = 0;
    currentLength.value = 0;
    circlePosition.value = { x: 0, y: 0 };
  }
});

async function runAnimation() {
  const pathEl = edgeRef.value?.pathEl;

  if (!pathEl) {
    return;
  }

  isAnimating.value = true;

  const totalLength = pathEl.getTotalLength();

  const from = edgePoint.value || 0;

  if (currentLength.value !== totalLength) {
    currentLength.value = totalLength;
  }

  await executeTransition(edgePoint, from, totalLength, {
    transition: TransitionPresets.easeInOutCubic
  });

  isAnimating.value = false;
}
</script>

<template>
  <BaseEdge
    v-bind="$attrs"
    :id="id"
    ref="edgeRef"
    :path="path[0]"
    :marker-end="markerEnd"
    :style="{ stroke: edgeColor }"
  />

  <EdgeLabelRenderer v-if="isAnimating">
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${circlePosition.x}px,${circlePosition.y}px)`,
        pointerEvents: 'all'
      }"
      class="nodrag nopan"
    >
      📦
    </div>
  </EdgeLabelRenderer>
</template>
