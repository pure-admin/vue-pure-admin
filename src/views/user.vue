<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" style="width:98%"></vxe-grid>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { VXETable, VxeGridInstance, VxeGridProps } from "vxe-table";
import XEUtils from "xe-utils";
import XEAjax from "xe-ajax";
export default {
  name: "user",
  setup() {
    const xGrid = ref({} as VxeGridInstance);

    const gridOptions = reactive({
      border: true,
      resizable: true,
      showHeaderOverflow: true,
      showOverflow: true,
      highlightHoverRow: true,
      keepSource: true,
      id: "full_edit_1",
      height: 600,
      rowId: "id",
      customConfig: {
        storage: true,
        checkMethod({ column }) {
          if (["nickname", "role"].includes(column.property)) {
            return false;
          }
          return true;
        },
      },
      printConfig: {
        columns: [
          { field: "name" },
          { field: "email" },
          { field: "nickname" },
          { field: "age" },
          { field: "amount" },
        ],
      },
      sortConfig: {
        trigger: "cell",
        remote: true,
      },
      filterConfig: {
        remote: true,
      },
      pagerConfig: {
        pageSize: 10,
        pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      },
      formConfig: {
        titleWidth: 100,
        titleAlign: "right",
        items: [
          {
            field: "name",
            title: "app.body.label.name",
            span: 8,
            titlePrefix: {
              message: "app.body.valid.rName",
              icon: "fa fa-exclamation-circle",
            },
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入名称" },
            },
          },
          {
            field: "email",
            title: "邮件",
            span: 8,
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入邮件" },
            },
          },
          {
            field: "nickname",
            title: "昵称",
            span: 8,
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入昵称" },
            },
          },
          {
            field: "role",
            title: "角色",
            span: 8,
            folding: true,
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入角色" },
            },
          },
          {
            field: "sex",
            title: "性别",
            span: 8,
            folding: true,
            titleSuffix: {
              message: "注意，必填信息！",
              icon: "fa fa-info-circle",
            },
            itemRender: { name: "$select", options: [] },
          },
          {
            field: "age",
            title: "年龄",
            span: 8,
            folding: true,
            itemRender: {
              name: "$input",
              props: {
                type: "number",
                min: 1,
                max: 120,
                placeholder: "请输入年龄",
              },
            },
          },
          {
            span: 24,
            align: "center",
            collapseNode: true,
            itemRender: {
              name: "$buttons",
              children: [
                {
                  props: {
                    type: "submit",
                    content: "app.body.label.search",
                    status: "primary",
                  },
                },
                { props: { type: "reset", content: "app.body.label.reset" } },
              ],
            },
          },
        ],
      },
      toolbarConfig: {
        buttons: [
          { code: "insert_actived", name: "新增", icon: "fa fa-plus" },
          { code: "delete", name: "直接删除", icon: "fa fa-trash-o" },
          { code: "mark_cancel", name: "删除/取消", icon: "fa fa-trash-o" },
          {
            code: "save",
            name: "app.body.button.save",
            icon: "fa fa-save",
            status: "success",
          },
        ],
        refresh: true,
        import: true,
        export: true,
        print: true,
        zoom: true,
        custom: true,
      },
      proxyConfig: {
        seq: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        form: true, // 启用表单代理
        props: {
          result: "result",
          total: "page.total",
        },
        ajax: {
          // 接收 Promise
          query: ({ page, sorts, filters, form }) => {
            const queryParams: any = Object.assign({}, form);
            // 处理排序条件
            const firstSort = sorts[0];
            if (firstSort) {
              queryParams.sort = firstSort.property;
              queryParams.order = firstSort.order;
            }
            // 处理筛选条件
            filters.forEach(({ property, values }) => {
              queryParams[property] = values.join(",");
            });
            return XEAjax.get(
              `https://api.xuliangzhan.com:10443/api/pub/page/list/${page.pageSize}/${page.currentPage}`,
              queryParams
            );
          },
          delete: ({ body }) =>
            XEAjax.post("https://api.xuliangzhan.com:10443/api/pub/save", body),
          save: ({ body }) =>
            XEAjax.post("https://api.xuliangzhan.com:10443/api/pub/save", body),
        },
      },
      columns: [
        { type: "checkbox", title: "ID", width: 120 },
        {
          field: "name",
          title: "Name",
          sortable: true,
          titleHelp: { message: "名称必须填写！" },
          editRender: { name: "input", attrs: { placeholder: "请输入名称" } },
        },
        {
          field: "role",
          title: "Role",
          sortable: true,
          filters: [
            { label: "前端开发", value: "前端" },
            { label: "后端开发", value: "后端" },
            { label: "测试", value: "测试" },
            { label: "程序员鼓励师", value: "程序员鼓励师" },
          ],
          filterMultiple: false,
          editRender: { name: "input", attrs: { placeholder: "请输入角色" } },
        },
        {
          field: "email",
          title: "Email",
          width: 160,
          editRender: { name: "$input", props: { placeholder: "请输入邮件" } },
        },
        {
          field: "nickname",
          title: "Nickname",
          editRender: { name: "input", attrs: { placeholder: "请输入昵称" } },
        },
        {
          field: "sex",
          title: "Sex",
          editRender: {
            name: "$select",
            options: [],
            props: { placeholder: "请选择性别" },
          },
        },
        {
          field: "age",
          title: "Age",
          visible: false,
          sortable: true,
          editRender: {
            name: "$input",
            props: { type: "number", min: 1, max: 120 },
          },
        },
        {
          field: "amount",
          title: "Amount",
          formatter({ cellValue }) {
            return cellValue
              ? `￥${XEUtils.commafy(XEUtils.toNumber(cellValue), {
                  digits: 2,
                })}`
              : "";
          },
          editRender: {
            name: "$input",
            props: { type: "float", digits: 2, placeholder: "请输入数值" },
          },
        },
        {
          field: "updateDate",
          title: "Update Date",
          width: 160,
          visible: false,
          sortable: true,
          formatter({ cellValue }) {
            return XEUtils.toDateString(cellValue, "yyyy-MM-dd HH:ss:mm");
          },
        },
        {
          field: "createDate",
          title: "Create Date",
          width: 160,
          visible: false,
          sortable: true,
          formatter({ cellValue }) {
            return XEUtils.toDateString(cellValue, "yyyy-MM-dd");
          },
        },
      ],
      importConfig: {
        remote: true,
        types: ["xlsx"],
        modes: ["insert"],
        // 自定义服务端导入
        importMethod({ file }) {
          const $grid = xGrid.value;
          const formBody = new FormData();
          formBody.append("file", file);
          return XEAjax.post(
            "https://api.xuliangzhan.com:10443/api/pub/import",
            formBody
          )
            .then((data) => {
              VXETable.modal.message({
                message: `成功导入 ${data.result.insertRows} 条记录！`,
                status: "success",
              });
              // 导入完成，刷新表格
              $grid.commitProxy("query");
            })
            .catch(() => {
              VXETable.modal.message({
                message: "导入失败，请检查数据是否正确！",
                status: "error",
              });
            });
        },
      },
      exportConfig: {
        remote: true,
        types: ["xlsx"],
        modes: ["current", "selected", "all"],
        // 自定义服务端导出
        exportMethod({ options }) {
          const $grid = xGrid.value;
          const proxyInfo = $grid.getProxyInfo();
          // 传给服务端的参数
          const body = {
            filename: options.filename,
            sheetName: options.sheetName,
            isHeader: options.isHeader,
            original: options.original,
            mode: options.mode,
            pager: proxyInfo ? proxyInfo.pager : null,
            ids:
              options.mode === "selected"
                ? options.data.map((item) => item.id)
                : [],
            fields: options.columns.map((column) => {
              return {
                field: column.property,
                title: column.title,
              };
            }),
          };
          // 开始服务端导出
          return XEAjax.post(
            "https://api.xuliangzhan.com:10443/api/pub/export",
            body
          )
            .then((data) => {
              if (data.id) {
                VXETable.modal.message({
                  message: "导出成功，开始下载",
                  status: "success",
                });
                // 读取路径，请求文件
                XEAjax.fetch(
                  `https://api.xuliangzhan.com:10443/api/pub/export/download/${data.id}`
                ).then((response) => {
                  response.blob().then((blob) => {
                    // 开始下载
                    VXETable.saveFile({
                      filename: "导出数据",
                      type: "xlsx",
                      content: blob,
                    });
                  });
                });
              }
            })
            .catch(() => {
              VXETable.modal.message({
                message: "导出失败！",
                status: "error",
              });
            });
        },
      },
      checkboxConfig: {
        labelField: "id",
        reserve: true,
        highlight: true,
        range: true,
      },
      editRules: {
        name: [
          { required: true, message: "app.body.valid.rName" },
          { min: 3, max: 50, message: "名称长度在 3 到 50 个字符" },
        ],
        email: [{ required: true, message: "邮件必须填写" }],
        role: [{ required: true, message: "角色必须填写" }],
      },
      editConfig: {
        trigger: "click",
        mode: "row",
        showStatus: true,
      },
    } as VxeGridProps);

    onMounted(() => {
      const sexList = [
        { label: "女", value: "0" },
        { label: "男", value: "1" },
      ];
      const { formConfig, columns } = gridOptions;
      if (columns) {
        const sexColumn = columns[5];
        if (sexColumn && sexColumn.editRender) {
          sexColumn.editRender.options = sexList;
        }
      }
      if (formConfig && formConfig.items) {
        const sexItem = formConfig.items[4];
        if (sexItem && sexItem.itemRender) {
          sexItem.itemRender.options = sexList;
        }
      }
    });

    return {
      xGrid,
      gridOptions,
    };
  },
};
</script>

<style scoped>
</style>
