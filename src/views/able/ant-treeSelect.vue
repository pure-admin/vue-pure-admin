<script setup lang="ts">
import { ref } from "vue";
import { TreeSelect } from "@pureadmin/components";

defineOptions({
  name: "AntTreeSelect"
});

const value1 = ref<string>("");
const treeData1 = ref([
  {
    title: "parent 1",
    value: "parent 1",
    children: [
      {
        title: "parent 1-0",
        value: "parent 1-0",
        children: [
          {
            title: "my leaf",
            value: "leaf1"
          },
          {
            title: "your leaf",
            value: "leaf2"
          }
        ]
      },
      {
        title: "parent 1-1",
        value: "parent 1-1"
      }
    ]
  }
]);

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

function dig(path = "0", level = 3) {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const value = `${path}-${i}`;
    const treeNode = {
      title: value,
      value
    };

    if (level > 0) {
      // @ts-expect-error
      treeNode.children = dig(value, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

const checkedKeys = ref<string[]>(["0-0-0", "0-0-1"]);

const value2 = ref<string[]>(["0-0-0"]);
const treeData2 = [
  {
    title: "Node1",
    value: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-0"
      }
    ]
  },
  {
    title: "Node2",
    value: "0-1",

    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        disabled: true
      },
      {
        title: "Child Node4",
        value: "0-1-1"
      },
      {
        title: "Child Node5",
        value: "0-1-2"
      }
    ]
  }
];

const value3 = ref<string>();
const treeData3 = ref([
  { id: 1, pId: 0, value: "1", title: "Expand to load" },
  { id: 2, pId: 0, value: "2", title: "Expand to load" },
  { id: 3, pId: 0, value: "3", title: "Tree Node", isLeaf: true }
]);
const genTreeNode = (parentId: number, isLeaf = false) => {
  const random = Math.random().toString(36).substring(2, 6);
  return {
    id: random,
    pId: parentId,
    value: random,
    title: isLeaf ? "Tree Node" : "Expand to load",
    isLeaf
  };
};
const onLoadData = treeNode => {
  return new Promise(resolve => {
    const { id } = treeNode.dataRef;
    setTimeout(() => {
      // @ts-expect-error
      treeData3.value = treeData3.value.concat([
        genTreeNode(id, false),
        genTreeNode(id, true)
      ]);
      resolve(true);
    }, 300);
  });
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          仿antdv树选择，采用
          <el-link
            href="https://www.npmjs.com/package/@pureadmin/components"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            @pureadmin/components
          </el-link>
          ，完全兼容antdv的
          <el-link
            href="https://next.antdv.com/components/tree-select-cn"
            target="_blank"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            TreeSelect
          </el-link>
          写法
        </span>
      </div>
    </template>
    <div class="flex justify-around flex-wrap">
      <div>
        <span>线性样式：</span>
        <TreeSelect
          class="w-200px"
          v-model:value="value1"
          show-search
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="Please select"
          allow-clear
          :tree-line="true"
          tree-default-expand-all
          :tree-data="treeData1"
        >
          <template #title="{ value: val, title }">
            <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
            <template v-else>{{ title }}</template>
          </template>
        </TreeSelect>
      </div>

      <div>
        <span>虚拟滚动：</span>
        <TreeSelect
          class="w-200px mt-6"
          v-model:value="checkedKeys"
          tree-checkable
          tree-default-expand-all
          :show-checked-strategy="SHOW_PARENT"
          :height="233"
          :tree-data="dig()"
          :max-tag-count="10"
        >
          <template #title="{ title, value }">
            <span v-if="value === '0-0-1-0'" style="color: #1890ff">
              {{ title }}
            </span>
            <template v-else>{{ title }}</template>
          </template>
        </TreeSelect>
      </div>

      <div>
        <span>可勾选：</span>
        <TreeSelect
          class="w-200px"
          v-model:value="value2"
          :tree-data="treeData2"
          tree-checkable
          allow-clear
          :show-checked-strategy="SHOW_PARENT"
          placeholder="Please select"
        />
      </div>

      <div>
        <span>异步加载：</span>
        <TreeSelect
          class="w-200px"
          v-model:value="value3"
          tree-data-simple-mode
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData3"
          placeholder="Please select"
          :load-data="onLoadData"
        />
      </div>
    </div>
  </el-card>
</template>
