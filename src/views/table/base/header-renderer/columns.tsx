import { message } from "@/utils/message";
import { tableData } from "../data";
import { ref, computed } from "vue";

// 需是hooks写法（函数中有return），避免失去响应性
export function useColumns() {
  const search = ref("");
  const filterTableData = computed(() =>
    tableData.filter(
      data =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const handleEdit = (index: number, row) => {
    message(`您修改了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
      type: "success"
    });
  };

  const handleDelete = (index: number, row) => {
    message(`您删除了第 ${index} 行，数据为：${JSON.stringify(row)}`);
  };

  const columns: TableColumnList = [
    {
      prop: "date",
      // 自定义表头，slot用法  #nameHeader="{ column, $index }"
      headerSlot: "nameHeader"
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "地址",
      prop: "address"
    },
    {
      align: "right",
      // 自定义表头，tsx用法
      headerRenderer: () => (
        <el-input
          v-model={search.value}
          size="small"
          clearable
          placeholder="Type to search"
        />
      ),
      cellRenderer: ({ index, row }) => (
        <>
          <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
            Edit
          </el-button>
          <el-button
            size="small"
            type="danger"
            onClick={() => handleDelete(index + 1, row)}
          >
            Delete
          </el-button>
        </>
      )
    }
  ];

  return {
    columns,
    filterTableData
  };
}
