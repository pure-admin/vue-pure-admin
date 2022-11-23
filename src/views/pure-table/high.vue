<script setup lang="ts">
import { list } from "./high/list";
import { Tabs, TabPane } from "@pureadmin/components";

defineOptions({
  name: "PureTableHigh"
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          高级用法全部采用 tsx 语法，充分发挥
          <el-link
            href="https://github.com/xiaoxian521/pure-admin-table"
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

    <Tabs :destroyInactiveTabPane="true">
      <TabPane v-for="item of list" :key="item.key">
        <template #tab>
          <el-tooltip :content="item.content" placement="top-end">
            <span>{{ item.title }}</span>
          </el-tooltip>
        </template>
        <component :is="item.component" />
      </TabPane>
    </Tabs>
  </el-card>
</template>

<style scoped>
:deep(.ant-tabs-content-holder) {
  margin-top: 10px;
}

:deep(.el-alert__title) {
  font-size: 16px;
}
</style>
