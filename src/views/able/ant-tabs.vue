<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabPane } from "@pureadmin/components";

defineOptions({
  name: "AntTabs"
});

const mode = ref("top");
const activeKey = ref(1);
const callback = (val: string) => {
  console.log(val);
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          仿antdv标签页，采用
          <el-link
            href="https://www.npmjs.com/package/@pureadmin/components"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/components
          </el-link>
          ，完全兼容antdv的
          <el-link
            href="https://next.antdv.com/components/tabs-cn"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            Tabs
          </el-link>
          写法
        </span>
      </div>
    </template>
    <el-radio-group v-model="mode" size="small" class="mb-2">
      <el-radio label="top" border>Horizontal</el-radio>
      <el-radio label="left" border>Vertical</el-radio>
    </el-radio-group>
    <Tabs
      v-model:activeKey="activeKey"
      :tab-position="mode"
      :style="{ height: '200px' }"
      @tabScroll="callback"
    >
      <TabPane v-for="i in 30" :key="i" :tab="`Tab-${i}`">
        Content of tab {{ i }}
      </TabPane>
    </Tabs>
  </el-card>
</template>
