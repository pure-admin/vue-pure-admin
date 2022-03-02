<script lang="ts">
export default {
  name: "reEditor"
};
</script>

<script setup lang="ts">
import WangEditor from "wangeditor";
import { onMounted, onBeforeUnmount, ref, unref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const html = ref(null);
const editor = ref(null);
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
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium"
          >编辑器组件，采用开源的<el-link
            href="https://www.wangeditor.com"
            target="_blank"
            :icon="useRenderIcon('edit')"
            style="font-size: 16px; margin: 0 4px 5px"
            >wangeditor</el-link
          ></span
        >
      </div>
    </template>
    <div ref="editor"></div>
    <div :innerHTML="html"></div>
  </el-card>
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
