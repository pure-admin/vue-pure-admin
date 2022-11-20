<script setup lang="ts">
import { list } from "./list";
import { Tabs, TabPane } from "@pureadmin/components";

defineOptions({
  name: "PureTable"
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          平台二次封装 element-plus 的 Table ，完全兼容 Api
          并提供灵活的配置项以及完善的类型提醒，再也不用将代码都写在 template
          里了，欢迎 Star
          <el-link
            href="https://github.com/xiaoxian521/pure-admin-table"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/table
          </el-link>
        </span>
      </div>
    </template>

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
</style>
