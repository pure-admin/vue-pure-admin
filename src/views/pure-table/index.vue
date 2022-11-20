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
          仿antdv锚点，采用
          <el-link
            href="https://www.npmjs.com/package/@pureadmin/components"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/components
          </el-link>
          ，完全兼容antdv的
          <el-link
            href="https://next.antdv.com/components/anchor-cn"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            Anchor
          </el-link>
          写法
        </span>
      </div>
    </template>

    <Tabs>
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
