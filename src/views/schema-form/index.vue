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
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 180px)' }">
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
    </template>

    <el-tabs @tab-click="tabClick">
      <template v-for="(item, index) of list" :key="item.key">
        <el-tab-pane :lazy="true">
          <template #label>
            <el-tooltip
              :content="`（第 ${index + 1} 个示例）${item.content}`"
              placement="top-end"
            >
              <span>{{ item.title }}</span>
            </el-tooltip>
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
