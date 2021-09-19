<script setup lang="ts">
import { reactive } from "vue";
import { VxeTableEvents } from "vxe-table";
import { templateRef } from "@vueuse/core";

interface Props {
  drawer: boolean;
  drawTitle?: string;
  direction?: string;
}

withDefaults(defineProps<Props>(), {
  drawer: false,
  drawTitle: "",
  direction: "rtl"
});

const emit = defineEmits<{
  (e: "handleClose"): void;
}>();

const xTable = templateRef<any>("xTable", null);

const configData = reactive({
  tableData: [
    {
      name: "禁用",
      dataval: "0"
    },
    {
      name: "启用",
      dataval: "1"
    }
  ],
  isAllChecked: false,
  isIndeterminate: false,
  selectRecords: [] as any[],
  tablePage: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  }
});

// 抽屉关闭
function handleClose() {
  configData.isAllChecked = false;
  configData.isIndeterminate = false;
  emit("handleClose");
}

function editConfig(row) {
  console.log("editConfig", row);
}

function delConfig(row) {
  console.log("delConfig", row);
}

const changeAllEvent = () => {
  setTimeout(() => {
    console.log(xTable);
  }, 1000);
  const $table = xTable.value;
  $table.setAllCheckboxRow(configData.isAllChecked);
  configData.selectRecords = $table.getCheckboxRecords();
};

const checkboxChangeEvent: VxeTableEvents.CheckboxChange = ({ records }) => {
  const $table = xTable.value;
  configData.isAllChecked = $table.isAllCheckboxChecked();
  configData.isIndeterminate = $table.isCheckboxIndeterminate();
  configData.selectRecords = records;
};
</script>

<template>
  <div class="config">
    <el-drawer
      :model-value="drawer"
      :title="drawTitle"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close
      size="640px"
    >
      <el-divider></el-divider>
      <!-- 列表 -->
      <div class="list">
        <vxe-table
          ref="xTable"
          border
          :data="configData.tableData"
          @checkbox-change="checkboxChangeEvent"
          @checkbox-all="checkboxChangeEvent"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="名称"></vxe-table-column>
          <vxe-table-column field="dataval" title="数据值"></vxe-table-column>
          <vxe-table-column title="操作" fixed="right">
            <template #default="{ row }">
              <vxe-button
                type="text"
                icon="el-icon-edit"
                @click="editConfig(row)"
                >编辑</vxe-button
              >
              <vxe-button
                type="text"
                icon="el-icon-delete"
                @click="delConfig(row)"
                >删除</vxe-button
              >
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          perfect
          v-model:current-page="configData.tablePage.currentPage"
          v-model:page-size="configData.tablePage.pageSize"
          :total="configData.tablePage.total"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
        >
          <template #left>
            <span class="page-left">
              <vxe-checkbox
                v-model="configData.isAllChecked"
                :indeterminate="configData.isIndeterminate"
                @change="changeAllEvent"
              ></vxe-checkbox>
              <span class="select-count"
                >已选中{{ configData.selectRecords.length }}条</span
              >
              <vxe-button size="small">{{ $t("message.hsdelete") }}</vxe-button>
            </span>
          </template>
        </vxe-pager>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.list {
  padding: 10px;

  .page-left {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
}

:deep(.select-count) {
  margin-right: 5px;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
}

:deep(.el-drawer__header span) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
}

:deep(.el-divider--horizontal) {
  margin: 13px 0;
}

:deep(.el-icon-close) {
  &:hover {
    color: red;
  }
}
</style>
