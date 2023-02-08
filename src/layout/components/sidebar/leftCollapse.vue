<script setup lang="ts">
import { ref, computed } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";

interface Props {
  isActive: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});

const visible = ref(false);
const { tooltipEffect } = useNav();

const iconClass = computed(() => {
  return [
    "ml-4",
    "mb-1",
    "w-[16px]",
    "h-[16px]",
    "inline-block",
    "align-middle",
    "text-primary",
    "cursor-pointer",
    "duration-[100ms]",
    "hover:text-primary",
    "dark:hover:!text-white"
  ];
});

const emit = defineEmits<{
  (e: "toggleClick"): void;
}>();

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div class="container">
    <el-tooltip
      placement="right"
      :visible="visible"
      :effect="tooltipEffect"
      :content="props.isActive ? '点击折叠' : '点击展开'"
    >
      <IconifyIconOffline
        :icon="MenuFold"
        :class="iconClass"
        :style="{ transform: props.isActive ? 'none' : 'rotateY(180deg)' }"
        @click="toggleClick"
        @mouseenter="visible = true"
        @mouseleave="visible = false"
      />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 0 6px -2px var(--el-color-primary);
}
</style>
