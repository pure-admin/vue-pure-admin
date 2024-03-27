<script setup lang="ts">
import { ref } from "vue";
import { list } from "./list";

defineOptions({
  name: "SchemaForm"
});

const selected = ref(0);

function tabClick({ index }) {
  selected.value = index;
}
</script>

<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 260px)' }">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          JSON 格式配置表单，采用优秀开源的
          <el-link
            href="https://plus-pro-components.com/components/form.html"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            PlusProComponents
          </el-link>
          ，维护整体表单只需操作 columns 配置即可
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/schema-form"
        target="_blank"
      >
        代码位置 src/views/schema-form
      </el-link>
    </template>

    <el-tabs @tab-click="tabClick">
      <template v-for="(item, index) of list" :key="item.key">
        <el-tab-pane :lazy="true">
          <template #label>
            <span
              v-tippy="{
                maxWidth: 'none',
                content: `（第 ${index + 1} 个示例）${item.content}`
              }"
            >
              {{ item.title }}
            </span>
          </template>
          <component :is="item.component" v-if="selected == index" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-card>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-tabs__nav-next.is-disabled),
:deep(.el-tabs__nav-prev.is-disabled) {
  opacity: 0.5;
}
</style>
