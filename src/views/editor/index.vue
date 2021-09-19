<script lang="ts">
export default {
  name: "reEditor"
};
</script>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, unref } from "vue";
import WangEditor from "wangeditor";

// eslint-disable-next-line no-undef
const editor = ref(null);
const html = ref(null);
let instance: WangEditor;

onMounted(() => {
  instance = new WangEditor(unref(editor));
  Object.assign(instance.config, {
    onchange() {
      html.value = instance.txt.html();
    }
  });
  instance.create();
});

onBeforeUnmount(() => {
  instance.destroy();
});
</script>

<template>
  <div>
    <div ref="editor"></div>
    <div :innerHTML="html"></div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.w-e-text-container) {
  z-index: 99 !important;
}

:deep(.w-e-toolbar) {
  z-index: 999 !important;
  position: static;
}
</style>
