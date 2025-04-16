<script setup lang="ts">
import { ref } from "vue";
import Vditor from "./components/Vditor.vue";

defineOptions({
  name: "Markdown"
});

const text = ref(`
\`\`\`ts
function sayHello(): void {
\tconsole.log("Hello, World!");
}
sayHello();
\`\`\`
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
`);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          Markdown组件，采用开源的
          <el-link
            href="https://b3log.org/vditor/"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            Vditor
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/markdown"
        target="_blank"
      >
        代码位置 src/views/markdown
      </el-link>
    </template>
    <h1 class="mb-2!">
      双向绑定：<span class="text-red-500">{{ text }}</span>
    </h1>
    <Vditor
      v-model="text"
      :options="{
        height: 560, // 高度
        outline: { enable: true, position: 'right' } // 大纲
      }"
    />
  </el-card>
</template>
