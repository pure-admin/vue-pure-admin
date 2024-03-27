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
          二次封装 Element Plus 的
          <el-link
            href="https://element-plus.org/zh-CN/component/table.html"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            el-table
          </el-link>
          完全兼容 api 并提供灵活的配置项以及完善的类型提示，不用将代码都写在
          template 里了
          <el-link
            href="https://github.com/pure-admin/pure-admin-table"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            @pureadmin/table 源码
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/table/base"
        target="_blank"
      >
        代码位置 src/views/table/base
      </el-link>
    </template>

    <el-alert
      title="基础用法中大部分表格都没设置 row-key ，不过最好都设置一下，后端需返回唯一值的字段，比如id。作用：1. 用来优化 Table
      的渲染，尤其当字段在深层结构中；2. 防止某些操作导致表格组件内部混乱"
      type="info"
      :closable="false"
    />

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

:deep(.el-tabs__header) {
  margin-top: 10px;
}

:deep(.el-alert__title) {
  font-size: 15px;
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
