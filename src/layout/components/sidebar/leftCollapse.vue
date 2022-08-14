<script setup lang="ts">
import { useDark } from "@pureadmin/utils";

interface Props {
  isActive: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});
const { isDark } = useDark();

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
      :effect="isDark ? 'dark' : 'light'"
      :content="props.isActive ? '点击折叠' : '点击展开'"
    >
      <IconifyIconOffline
        :icon="props.isActive ? 'menu-fold' : 'menu-unfold'"
        class="cursor-pointer inline-block align-middle color-primary hover:color-primary !dark:hover:color-white w-16px h-16px ml-4 mb-1"
        @click="toggleClick"
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
