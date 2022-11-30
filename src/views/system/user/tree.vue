<script setup lang="ts">
import { handleTree } from "@/utils/tree";
import type { ElTree } from "element-plus";
import { getDeptList } from "@/api/system";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, watch, onMounted, getCurrentInstance } from "vue";

import LocationCompany from "@iconify-icons/ep/add-location";
import UnExpand from "@iconify-icons/mdi/arrow-expand-right";
import Expand from "@iconify-icons/mdi/arrow-expand-down";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import Reset from "@iconify-icons/ri/restart-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Search from "@iconify-icons/ep/search";

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

const highlightMap = ref({});

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
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
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
  const { data } = await getDeptList();
  treeData.value = handleTree(data as any);
});
</script>

<template>
  <div class="max-w-[260px] h-full min-h-[780px] bg-bg_color">
    <div class="flex items-center h-[34px]">
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
              :icon="Search"
            />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown>
        <IconifyIconOffline
          class="w-[28px] cursor-pointer"
          width="18px"
          :icon="More2Fill"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-[20px] !text-gray-500 dark:!text-white dark:hover:!text-primary"
                link
                type="primary"
                :icon="useRenderIcon(Expand)"
                @click="toggleRowExpansionAll(true)"
              >
                展开全部
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-[20px] !text-gray-500 dark:!text-white dark:hover:!text-primary"
                link
                type="primary"
                :icon="useRenderIcon(UnExpand)"
                @click="toggleRowExpansionAll(false)"
              >
                折叠全部
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                class="reset-margin !h-[20px] !text-gray-500 dark:!text-white dark:hover:!text-primary"
                link
                type="primary"
                :icon="useRenderIcon(Reset)"
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
              'text-red-500',
            highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
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
                ? OfficeBuilding
                : data.type === 2
                ? LocationCompany
                : Dept
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
