<script lang="ts" setup>
import type { ElTree } from "element-plus";
import { handleTree } from "/@/utils/tree";
import { getDeptList } from "/@/api/system";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { ref, watch, onMounted, getCurrentInstance } from "vue";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}
const defaultProps = {
  children: "children",
  label: "name"
};

const treeData = ref([]);
const searchValue = ref("");
const { proxy } = getCurrentInstance();
const treeRef = ref<InstanceType<typeof ElTree>>();

let highlightMap = ref({});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick(value) {
  const nodeId = value.$treeNodeId;
  highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
    ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: false
      })
    : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
}

function toggleRowExpansionAll(status) {
  // @ts-expect-error
  let nodes = proxy.$refs["treeRef"].store._getAllNodes();
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

// 重置状态（选中状态、搜索框值、树初始化）
function onReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

onMounted(async () => {
  let { data } = await getDeptList();
  treeData.value = handleTree(data);
});
</script>

<template>
  <div class="max-w-260px h-full min-h-780px bg-white">
    <div class="flex items-center h-34px">
      <p class="flex-1 ml-2 font-bold text-base truncate" title="部门列表">
        部门列表
      </p>
      <el-input
        style="flex: 2"
        size="small"
        v-model="searchValue"
        placeholder="请输入部门名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="search"
            />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown>
        <IconifyIconOffline
          class="w-28px cursor-pointer"
          width="18px"
          icon="more-vertical"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-20px !text-gray-500"
                link
                type="primary"
                :icon="useRenderIcon('expand')"
                @click="toggleRowExpansionAll(true)"
              >
                展开全部
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-20px !text-gray-500"
                link
                type="primary"
                :icon="useRenderIcon('unExpand')"
                @click="toggleRowExpansionAll(false)"
              >
                折叠全部
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-20px !text-gray-500"
                link
                type="primary"
                :icon="useRenderIcon('reset')"
                @click="onReset"
              >
                重置状态
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-tree
      ref="treeRef"
      :data="treeData"
      node-key="id"
      size="small"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <span
          :class="[
            'pl-1',
            'pr-1',
            'rounded',
            'flex',
            'items-center',
            'select-none',
            searchValue.trim().length > 0 &&
              node.label.includes(searchValue) &&
              'text-red-500'
          ]"
          :style="{
            background: highlightMap[node.id]?.highlight
              ? 'var(--el-color-primary-light-7)'
              : 'transparent'
          }"
        >
          <IconifyIconOffline
            :icon="
              data.type === 1
                ? 'office-building'
                : data.type === 2
                ? 'location-company'
                : 'dept'
            "
          />
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}
</style>
