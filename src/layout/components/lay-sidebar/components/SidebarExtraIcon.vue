<script setup lang="ts">
import { toRaw } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineProps({
  extraIcon: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <div v-if="extraIcon" class="flex-c">
    <component :is="useRenderIcon(toRaw(extraIcon))" class="w-7.5 h-7.5" />
  </div>
</template>
