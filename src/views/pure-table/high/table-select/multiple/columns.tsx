import { message } from "@/utils/message";
import { tableDataEdit } from "../../data";
import { ref, reactive, type Ref } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useColumns(selectRef: Ref, tableRef: Ref) {
  const selectValue = ref([]);
  const columns: TableColumnList = [
    {
      type: "selection",
      reserveSelection: true,
      align: "left"
    },
    {
      label: "ID",
      prop: "id",
      width: 80
    },
    {
      label: "日期",
      prop: "date",
      minWidth: 120
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "地址",
      prop: "address"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 5,
    currentPage: 1,
    layout: "prev, pager, next",
    total: tableDataEdit.length,
    background: true,
    small: true
  });

  const handleSelectionChange = val => {
    const arr = [];
    val.forEach(v => {
      arr.push({ label: v.name, id: v.id });
    });
    selectValue.value = arr;
  };

  const removeTag = ({ id }) => {
    const { toggleRowSelection } = tableRef.value.getTableRef();
    toggleRowSelection(tableDataEdit.filter(v => v.id == id)?.[0], false);
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

  return {
    columns,
    pagination,
    selectValue,
    tableDataEdit,
    onSure,
    onClear,
    removeTag,
    handleSelectionChange
  };
}
