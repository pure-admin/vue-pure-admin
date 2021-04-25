<template>
  <div class="dict-container">
    <vxe-toolbar>
      <template #buttons>
        <vxe-input
          v-model="demo1.filterName"
          :placeholder="$t('message.hssearch')"
          @keyup="searchEvent"
        ></vxe-input>
      </template>
      <template #tools>
        <vxe-button icon="el-icon-circle-plus-outline" status="primary">{{$t('message.hsadd')}}</vxe-button>
        <vxe-button
          icon="el-icon-folder-opened"
          status="primary"
          @click="$refs.xTree.setAllTreeExpand(true)"
        >{{$t('message.hsexpendAll')}}</vxe-button>
        <vxe-button
          icon="el-icon-folder"
          status="primary"
          @click="$refs.xTree.clearTreeExpand()"
        >{{$t('message.hscollapseAll')}}</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      ref="xTree"
      border
      resizable
      :tree-config="{children: 'children', iconOpen: 'fa fa-minus-square-o', iconClose: 'fa fa-plus-square-o'}"
      :data="demo1.tableData"
    >
      <vxe-table-column tree-node field="name" title="字典名称"></vxe-table-column>
      <vxe-table-column field="model" title="字典类型"></vxe-table-column>
      <vxe-table-column title="操作" width="330">
        <template #default="{ row }">
          <vxe-button type="text" icon="el-icon-edit" @click="demo1.value8 = true">编辑</vxe-button>
          <vxe-button type="text" icon="el-icon-circle-plus-outline">新增子类型</vxe-button>
          <vxe-button v-show="row.model" type="text" icon="el-icon-setting">字典配置</vxe-button>
          <vxe-button type="text" icon="el-icon-delete" @click="confirmEvent">删除</vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-modal
      v-model="demo1.value8"
      title="记忆功能的窗口"
      width="440"
      height="230"
      show-zoom
      resize
      remember
    >
      <template #default>
        <vxe-form>
          <vxe-form-item span="24">
            <template #default>
              <vxe-form
                :data="demo1.formData3"
                :rules="demo1.formRules3"
                title-align="right"
                title-width="80"
              >
                <vxe-form-item
                  title="字典名称"
                  field="name"
                  span="24"
                  :item-render="{name: 'input', attrs: {placeholder: '请输入字典名称'}}"
                ></vxe-form-item>
                <vxe-form-item
                  title="字典类型"
                  field="nickname"
                  span="24"
                  :item-render="{name: 'input', attrs: {placeholder: '请输入字典类型'}}"
                ></vxe-form-item>
                <vxe-form-item align="right" span="24">
                  <template #default>
                    <vxe-button @click="demo1.value8 = false">取消</vxe-button>
                    <vxe-button status="primary" @click="onEdit">保存</vxe-button>
                  </template>
                </vxe-form-item>
              </vxe-form>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>
<script  lang="ts">
import { reactive, ref, nextTick } from "vue";
import XEUtils from "xe-utils";
import { cloneDeep } from "lodash-es";
import { templateRef } from "@vueuse/core";
import { VxeTablePropTypes, VxeTableInstance, VXETable } from "vxe-table";

export default {
  setup() {
    const demo1 = reactive({
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
      ]
    });

    let originData = cloneDeep(demo1.tableData);

    const xTree = templateRef<HTMLElement | null>("xTree", null);
    // const  = ref({} as VxeTableInstance);

    const formatDate = (value: any) => {
      return XEUtils.toDateString(value, "yyyy-MM-dd HH:mm:ss.S");
    };

    const handleSearch = () => {
      const filterName = XEUtils.toValueString(demo1.filterName).trim();

      if (filterName) {
        const options = { children: "children" };
        const searchProps = ["name"];

        demo1.tableData = XEUtils.searchTree(
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
        demo1.tableData = originData;
      }
    };

    // 创建一个防防抖函数，调用频率间隔 100 毫秒
    const searchEvent = XEUtils.debounce(
      function() {
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

    function onEdit() {
      demo1.value8 = false;
      VXETable.modal.message({
        content: "测试数据，不可编辑",
        status: "error"
      });
    }

    return {
      demo1,
      formatDate,
      searchEvent,
      confirmEvent,
      onEdit
    };
  }
};
</script>
<style lang="scss" scoped>
.dict-container {
  margin: 10px;
}
.vxe-input + .vxe-button,
.vxe-input + .vxe-button--dropdown,
.vxe-button + .vxe-button,
.vxe-button + .vxe-button--dropdown {
  margin-left: 0;
}
.vxe-button.type--button:not(.is--round) {
  border-radius: 0;
}
.vxe-button.size--medium.type--button {
  margin-right: 0.07em;
}
</style>