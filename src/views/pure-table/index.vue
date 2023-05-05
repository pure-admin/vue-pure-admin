<script setup lang="ts">
import { ref } from "vue";
import { list } from "./base/list";

defineOptions({
  name: "PureTable"
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
          平台二次封装 element-plus 的 Table ，完全兼容 Api
          并提供灵活的配置项以及完善的类型提醒，再也不用将代码都写在 template
          里了，欢迎 Star
          <el-link
            href="https://github.com/pure-admin/pure-admin-table"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            @pureadmin/table
          </el-link>
        </span>
      </div>
    </template>

    <el-alert
      title="基础用法中大部分表格都没设置 row-key ，不过最好都设置一下，后端需返回唯一值的字段，比如id 作用：1. 用来优化 Table
      的渲染，尤其当字段在深层结构中；2. 防止某些操作导致表格组件内部混乱"
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
