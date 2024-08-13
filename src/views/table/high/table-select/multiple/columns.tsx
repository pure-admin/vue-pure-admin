import { message } from "@/utils/message";
import { tableDataEdit } from "../../data";
import type { PaginationProps } from "@pureadmin/table";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { type Ref, ref, reactive, watch, nextTick } from "vue";

export function useColumns(selectRef: Ref, formRef: Ref, tableRef: Ref) {
  const tableData = ref(tableDataEdit);
  const cloneTableData = cloneDeep(tableData.value);
  const selectValue = ref([1, 3, 4]);
  const searchForm = reactive({
    sexValue: "",
    searchDate: ""
  });
  const sexOptions = [
    {
      value: 0,
      label: "男"
    },
    {
      value: 1,
      label: "女"
    }
  ];
  const columns: TableColumnList = [
    {
      type: "selection",
      reserveSelection: true,
      align: "left"
    },
    {
      label: "ID",
      prop: "id",
      width: 50
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "性别",
      prop: "sex"
    },
    {
      label: "地址",
      prop: "address"
    },
    {
      label: "日期",
      prop: "date",
      minWidth: 120
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 5,
    currentPage: 1,
    layout: "prev, pager, next",
    total: tableData.value.length,
    background: true,
    size: "small"
  });

  const handleSelectionChange = val => {
    const arr = [];
    val.forEach(v => {
      arr.push({ label: v.name, id: v.id });
    });
    selectValue.value = arr;
  };

  const onSearch = () => {
    tableData.value = cloneTableData;
    if (!isAllEmpty(searchForm.sexValue)) {
      let sex = sexOptions
        .map(sex => sex.value === Number(searchForm.sexValue) && sex.label)
        .filter(Boolean)[0];
      tableData.value = tableData.value.filter(data => data.sex === sex);
    }
    if (!isAllEmpty(searchForm.searchDate)) {
      tableData.value = tableData.value.filter(
        data => data.date === searchForm.searchDate
      );
    }
    pagination.total = tableData.value.length;
  };

  const onReset = () => {
    formRef.value.resetFields();
    onClear();
    tableData.value = cloneTableData;
    pagination.total = tableData.value.length;
  };

  const removeTag = ({ id }) => {
    const { toggleRowSelection } = tableRef.value.getTableRef();
    toggleRowSelection(tableData.value.filter(v => v.id == id)?.[0], false);
  };

  const onClear = () => {
    const { clearSelection } = tableRef.value.getTableRef();
    clearSelection();
  };

  const onSure = () => {
    selectRef.value.blur();
    message(`当前选中的数据为：${JSON.stringify(selectValue.value)}`, {
      type: "success"
    });
  };

  watch(
    selectValue,
    async () => {
      await nextTick();
      const { toggleRowSelection } = tableRef.value.getTableRef();
      selectValue.value.forEach(val => {
        tableData.value.forEach(row => {
          // 默认回显
          row.id === val ? toggleRowSelection(row) : undefined;
        });
      });
    },
    { immediate: true }
  );

  return {
    searchForm,
    sexOptions,
    columns,
    pagination,
    selectValue,
    tableData,
    onSure,
    onClear,
    onReset,
    onSearch,
    removeTag,
    handleSelectionChange
  };
}
