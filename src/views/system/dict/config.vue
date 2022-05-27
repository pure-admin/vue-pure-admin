<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import { type Direction } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { type VxeTableEvents, type VxeTableInstance } from "vxe-table";

interface Props {
  drawer: boolean;
  drawTitle?: string;
  direction?: Direction;
}

withDefaults(defineProps<Props>(), {
  drawer: false,
  drawTitle: "",
  direction: "rtl"
});

const emit = defineEmits<{
  (e: "handleClose"): void;
}>();

const { t } = useI18n();

const xTable = ref({} as VxeTableInstance);

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
  configData.isIndeterminate = $table.isAllCheckboxIndeterminate();
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
      size="680px"
    >
      <el-divider />
      <!-- 列表 -->
      <div class="p-2">
        <vxe-table
          ref="xTable"
          border
          :data="configData.tableData"
          @checkbox-change="checkboxChangeEvent"
          @checkbox-all="checkboxChangeEvent"
        >
          <vxe-table-column type="checkbox" width="60" />
          <vxe-table-column field="name" title="名称" />
          <vxe-table-column field="dataval" title="数据值" />
          <vxe-table-column title="操作" fixed="right">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                :icon="useRenderIcon('edits')"
                @click="editConfig(row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                :icon="useRenderIcon('delete')"
                @click="delConfig(row)"
              >
                删除
              </el-button>
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
            <span class="absolute left-3 flex items-center">
              <vxe-checkbox
                v-model="configData.isAllChecked"
                :indeterminate="configData.isIndeterminate"
                @change="changeAllEvent"
              />
              <p>已选中{{ configData.selectRecords.length }}条</p>
              <el-button link type="danger" class="ml-1">
                {{ t("buttons.hsdelete") }}
              </el-button>
            </span>
          </template>
        </vxe-pager>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
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
</style>
