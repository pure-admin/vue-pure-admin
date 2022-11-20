<script setup lang="ts">
import { Tabs, TabPane } from "@pureadmin/components";
import {
  Base,
  Stripe,
  Border,
  Status,
  FixHeader,
  FixColumn,
  FluidHeight,
  GroupHeader,
  Radio,
  MultipleChoice,
  Sortable,
  Filters
} from "./components";

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
      <TabPane key="base" tab="基础表格">
        <Base />
      </TabPane>
      <TabPane key="stripe" tab="带斑马纹表格">
        <Stripe />
      </TabPane>
      <TabPane key="border" tab="带边框表格">
        <Border />
      </TabPane>
      <TabPane key="status" tab="带状态表格">
        <Status />
      </TabPane>
      <TabPane key="fixHeader" tab="固定表头">
        <FixHeader />
      </TabPane>
      <TabPane key="fixColumn" tab="固定列">
        <FixColumn />
      </TabPane>
      <TabPane key="fixColumnHeader" tab="固定列和表头">
        <FixColumn height="360" />
      </TabPane>
      <TabPane key="fluidHeight" tab="流体高度">
        <FluidHeight />
      </TabPane>
      <TabPane key="groupHeader" tab="多级表头（表头分组）">
        <GroupHeader />
      </TabPane>
      <TabPane key="radio" tab="单选">
        <Radio />
      </TabPane>
      <TabPane key="multipleChoice" tab="多选">
        <MultipleChoice />
      </TabPane>
      <TabPane key="sortable" tab="排序和格式化">
        <Sortable />
      </TabPane>
      <TabPane key="filters" tab="筛选">
        <Filters />
      </TabPane>
    </Tabs>
  </el-card>
</template>

<style scoped>
:deep(.ant-tabs-content-holder) {
  margin-top: 10px;
}
</style>
