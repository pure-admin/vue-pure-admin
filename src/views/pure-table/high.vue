<script setup lang="ts">
import { ref } from "vue";
import { list } from "./high/list";

defineOptions({
  name: "PureTableHigh"
});

const selected = ref(0);

function tabClick({ index }) {
  selected.value = index;
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          高级用法全部采用 tsx 语法，充分发挥
          <el-link
            href="https://github.com/pure-admin/pure-admin-table"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/table
          </el-link>
          的灵活性，维护整体表格只需操作 columns 配置即可
        </span>
      </div>
    </template>

    <el-alert
      title="高级用法中所有表格都设置了 row-key ，后端需返回唯一值的字段，比如id 作用：1. 用来优化 Table
      的渲染，尤其当字段在深层结构中；2. 防止拖拽后表格组件内部混乱（拖拽必须设置哦，坑都帮您们踩过啦 ❤️）"
      type="info"
      :closable="false"
    />

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
          <component v-if="selected == index" :is="item.component" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-card>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__header) {
  margin-top: 10px;
}

:deep(.el-alert__title) {
  font-size: 16px;
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
