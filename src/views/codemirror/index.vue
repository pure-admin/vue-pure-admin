<script setup lang="ts">
import "codemirror/theme/material-darker.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/mode/javascript/javascript.js";

import { useDark } from "@pureadmin/utils";
import Codemirror from "codemirror-editor-vue3";
import { ref, reactive, watch, nextTick } from "vue";
import type { Editor, EditorConfiguration } from "codemirror";

const { isDark } = useDark();
const cminstance = ref<Editor | null>(null);
const cmOptions: EditorConfiguration = reactive({
  mode: "javascript",
  theme: isDark.value ? "material-darker" : "default",
  tabSize: 4,
  readOnly: false,
  autofocus: true,
  autoRefresh: true,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
  extraKeys: {
    Ctrl: "autocomplete",
    Tab: "autocomplete"
  },
  hintOptions: {
    completeSingle: false
  }
});

const code = ref(`function sayHello() {
    console.log("Hello, World!");
}

sayHello();`);

const onReady = (cm: Editor) => {
  cminstance.value = cm;
  cm.on("keypress", () => cm.showHint());
  // console.log(cm.getValue());
};

watch(
  () => isDark.value,
  async newVal => {
    await nextTick();
    newVal
      ? cminstance.value.setOption("theme", "material-darker")
      : cminstance.value.setOption("theme", "default");
  }
);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          代码编辑器组件，采用开源的
          <el-link
            href="https://rennzhang.github.io/codemirror-editor-vue3/zh-CN/guide/getting-started"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            codemirror-editor-vue3
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/codemirror/index.vue"
        target="_blank"
      >
        代码位置 src/views/codemirror/index.vue
      </el-link>
    </template>
    <Codemirror
      v-model:value="code"
      width="100%"
      height="400px"
      :options="cmOptions"
      :border="true"
      @ready="onReady"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.codemirror-container.bordered {
  border: 1px solid var(--pure-border-color);
}
</style>
