<script setup lang="ts">
interface Props {
  isActive: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});

const emit = defineEmits<{
  (e: "toggleClick"): void;
}>();

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div
    class="px-3 mr-1 navbar-bg-hover"
    :title="props.isActive ? '点击折叠' : '点击展开'"
    @click="toggleClick"
  >
    <IconifyIconOffline
      :icon="props.isActive ? 'menu-fold' : 'menu-unfold'"
      class="inline-block align-middle hover:color-primary !dark:hover:color-white"
    />
  </div>
</template>
