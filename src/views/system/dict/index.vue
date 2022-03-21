<script lang="ts">
export default {
  name: "dict"
};
</script>

<script setup lang="ts">
import XEUtils from "xe-utils";
import Config from "./config.vue";
import { useI18n } from "vue-i18n";
import { cloneDeep } from "lodash-unified";
import { templateRef } from "@vueuse/core";
import { reactive, ref, unref, nextTick } from "vue";
import { useCopyToClipboard } from "/@/utils/useCopyToClipboard";
import {
  VXETable,
  VxeTableInstance,
  VxeTableEvents,
  VxeFormPropTypes
} from "vxe-table";
type onEditNRow = {
  name: string;
  model: string;
};

const { t } = useI18n();

const dictData = reactive({
  submitLoading: false,
  showEdit: false,
  selectRow: null,
  filterName: "",
  tableData: [
    {
      id: 1,
      name: "状态",
      model: "",
      children: [
        {
          id: "1-1",
          name: "服务状态",
          model: "serviceStatus"
        },
        {
          id: "1-2",
          name: "在线状态",
          model: "onlienStatus"
        }
      ]
    },
    { id: 2, name: "操作系统", model: "operatingSystem" }
  ],
  formData: {
    name: "",
    model: ""
  },
  formItems: [
    {
      field: "name",
      title: "字典名称",
      span: 24,
      itemRender: {
        name: "$input",
        props: { placeholder: "请输入字典名称" }
      }
    },
    {
      field: "model",
      title: "字典类型",
      span: 24,
      itemRender: {
        name: "$input",
        props: {
          placeholder: "请输入字典类型",
          //这里vxe-table文档并没有提到，可以配置所选组件的所有属性，比如这里可以配置关于vxe-input的所有属性
          disabled: true
        }
      }
    },
    {
      align: "right",
      span: 24,
      itemRender: {
        name: "$buttons",
        children: [
          { props: { type: "submit", content: "提交", status: "primary" } },
          { props: { type: "reset", content: "重置" } }
        ]
      }
    }
  ] as VxeFormPropTypes.Items
});

let originData = cloneDeep(dictData.tableData);

const xTree = templateRef<HTMLElement | any>("xTree", null);

const handleSearch = () => {
  const filterName = XEUtils.toValueString(dictData.filterName).trim();

  if (filterName) {
    const options = { children: "children" };
    const searchProps = ["name"];

    dictData.tableData = XEUtils.searchTree(
      originData,
      item =>
        searchProps.some(
          key => XEUtils.toValueString(item[key]).indexOf(filterName) > -1
        ),
      options
    );

    // 搜索之后默认展开所有子节点
    nextTick(() => {
      const $table = xTree.value;
      $table.setAllTreeExpand(true);
    });
  } else {
    dictData.tableData = originData;
  }
};

// 创建一个防防抖函数，调用频率间隔 100 毫秒
const searchEvent = XEUtils.debounce(
  function () {
    handleSearch();
  },
  100,
  { leading: false, trailing: true }
);

const confirmEvent = async () => {
  const type = await VXETable.modal.confirm("您确定要删除吗？");
  (await type) === "confirm" &&
    VXETable.modal.message({
      content: "测试数据，不可删除",
      status: "error"
    });
};

function commonFn(value, disabled) {
  dictData.selectRow = value;
  dictData.showEdit = true;
  dictData.formItems[1].itemRender.props.disabled = disabled;
}

// 新增
function onAdd() {
  commonFn(null, false);
}

// 新增子类型
function onAddChild(row?: object) {
  console.log("onAddChild", row);
  commonFn(null, false);
}

// 编辑
function onEdit(row?: onEditNRow) {
  dictData.formData = {
    name: row.name,
    model: row.model ? row.model : "暂无字典类型"
  };
  commonFn(row, true);
  // VXETable.modal.message({
  //   content: "测试数据，不可编辑",
  //   status: "error"
  // });
}

// 拷贝当前列表项的数据（字典类型）
const { clipboardRef } = useCopyToClipboard();
const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
  clipboardRef.value = unref(row).model;
};

const xTable = ref({} as VxeTableInstance);

const submitEvent = () => {
  dictData.submitLoading = true;
  setTimeout(() => {
    const $table = xTable.value;
    dictData.submitLoading = false;
    dictData.showEdit = false;
    if (dictData.selectRow) {
      VXETable.modal.message({ content: "保存成功", status: "success" });
      Object.assign(dictData.selectRow, dictData.formData);
    } else {
      VXETable.modal.message({ content: "新增成功", status: "success" });
      $table.insert(dictData.formData);
    }
  }, 500);
};

let drawer = ref(false);

function onDeploy(value?: object) {
  console.log("onDeploy", value);
  drawer.value = true;
}

function handleClose() {
  drawer.value = false;
}
</script>

<template>
  <div>
    <!-- 工具栏 -->
    <vxe-toolbar>
      <template #buttons>
        <vxe-input
          v-model="dictData.filterName"
          :placeholder="t('buttons.hssearch')"
          @keyup="searchEvent"
        />
      </template>
      <template #tools>
        <vxe-button
          icon="fa fa-plus-square-o"
          status="primary"
          @click="onAdd"
          >{{ t("buttons.hsadd") }}</vxe-button
        >
        <vxe-button
          icon="fa fa-folder-open-o"
          status="primary"
          @click="$refs.xTree.setAllTreeExpand(true)"
          >{{ t("buttons.hsexpendAll") }}</vxe-button
        >
        <vxe-button
          icon="fa fa-folder-o"
          status="primary"
          @click="$refs.xTree.clearTreeExpand()"
          >{{ t("buttons.hscollapseAll") }}</vxe-button
        >
      </template>
    </vxe-toolbar>

    <!-- 列表 -->
    <vxe-table
      ref="xTree"
      border
      resizable
      :tree-config="{
        children: 'children',
        iconOpen: 'fa fa-minus-square-o',
        iconClose: 'fa fa-plus-square-o'
      }"
      :data="dictData.tableData"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-table-column tree-node field="name" title="字典名称" />
      <vxe-table-column title="字典类型">
        <template #default="{ row }">
          <el-tooltip
            effect="dark"
            :content="'双击复制：' + row.model"
            placement="right"
          >
            <span class="text-model">{{ row.model }}</span>
          </el-tooltip>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="330" fixed="right">
        <template #default="{ row }">
          <vxe-button
            type="text"
            icon="fa fa-pencil-square-o"
            @click="onEdit(row)"
            >编辑</vxe-button
          >
          <vxe-button
            type="text"
            icon="fa fa-plus-square-o"
            @click="onAddChild(row)"
            >新增子类型</vxe-button
          >
          <vxe-button
            v-show="row.model"
            type="text"
            icon="fa fa-cog"
            @click="onDeploy(row)"
            >字典配置</vxe-button
          >
          <vxe-button type="text" icon="fa fa-trash-o" @click="confirmEvent"
            >删除</vxe-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- 修改、添加弹框 -->
    <vxe-modal
      resize
      width="450"
      v-model="dictData.showEdit"
      :title="dictData.selectRow ? '编辑' : '新增'"
      :loading="dictData.submitLoading"
      @hide="$refs.xForm.reset()"
    >
      <template #default>
        <vxe-form
          ref="xForm"
          :data="dictData.formData"
          :items="dictData.formItems"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        />
      </template>
    </vxe-modal>

    <Config :drawer="drawer" drawTitle="字典列表" @handleClose="handleClose" />
  </div>
</template>

<style lang="scss" scoped>
.vxe-input + .vxe-button,
.vxe-input + .vxe-button--dropdown,
.vxe-button + .vxe-button,
.vxe-button + .vxe-button--dropdown {
  margin-left: 0;
}

.vxe-button.type--button:not(.is--round) {
  border-radius: 0;
}

.vxe-toolbar.size--medium {
  padding: 10px;
}

.vxe-table--render-default.size--medium {
  margin-top: 12px;
}

.vxe-button.size--medium.type--button {
  margin-right: 0.07em;
}

.text-model {
  &:hover {
    cursor: pointer;
  }
}
</style>
