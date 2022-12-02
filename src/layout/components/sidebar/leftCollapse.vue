<script setup lang="ts">
import { ref } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";
import MenuUnfold from "@iconify-icons/ri/menu-unfold-fill";

interface Props {
  isActive: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});

const visible = ref(false);
const { tooltipEffect } = useNav();

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
        :icon="props.isActive ? MenuFold : MenuUnfold"
        class="cursor-pointer inline-block align-middle text-primary hover:text-primary dark:hover:!text-white w-[16px] h-[16px] ml-4 mb-1"
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
