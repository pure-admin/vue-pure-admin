<script setup lang="ts">
import { toRef } from "vue";
import type { NodeProps } from "@vue-flow/core";
import { Handle, useHandleConnections } from "@vue-flow/core";

const props = defineProps<NodeProps>();

const sourceConnections = useHandleConnections({
  type: "target"
});

const targetConnections = useHandleConnections({
  type: "source"
});

const isSender = toRef(() => sourceConnections.value.length <= 0);

const isReceiver = toRef(() => targetConnections.value.length <= 0);

const bgColor = toRef(() => {
  if (isSender.value) {
    return "#4b5563";
  }

  if (props.data.hasError) {
    return "#f87171";
  }

  if (props.data.isFinished) {
    return "#10b981";
  }

  if (props.data.isCancelled) {
    return "#fbbf24";
  }

  return "#4b5563";
});

const processLabel = toRef(() => {
  if (props.data.hasError) {
    return "❌";
  }

  if (props.data.isSkipped) {
    return "🚧";
  }

  if (props.data.isCancelled) {
    return "🚫";
  }

  if (isSender.value) {
    return "📦";
  }

  if (props.data.isFinished) {
    return "😎";
  }

  return "📥";
});
</script>

<template>
  <div class="process-node" :style="{ backgroundColor: bgColor }">
    <Handle v-if="!isSender" type="target" :position="targetPosition" />
    <Handle v-if="!isReceiver" type="source" :position="sourcePosition" />

    <div v-if="data.isRunning" class="spinner" />
    <span v-else>
      {{ processLabel }}
    </span>
  </div>
</template>

<style scoped>
.process-node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 10px;
  font-size: 12px;
  color: white;
  border: 1px solid #4b5563;
  border-radius: 99px;
}

.spinner {
  width: 10px;
  height: 10px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
