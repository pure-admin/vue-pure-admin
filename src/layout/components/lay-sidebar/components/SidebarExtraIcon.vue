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
  <div v-if="extraIcon" class="flex justify-center items-center">
    <component
      :is="useRenderIcon(toRaw(extraIcon))"
      class="w-[30px] h-[30px]"
    />
  </div>
</template>
