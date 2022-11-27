import { message } from "@/utils/message";
import { tableData } from "../data";

// 如果您不习惯tsx写法，可以传slot，然后在template里写
// 需是hooks写法（函数中有return），避免失去响应性
export function useColumns() {
  const columns: TableColumnList = [
    {
      label: "日期",
      prop: "date",
      cellRenderer: ({ row }) => (
        <div style="display: flex; align-items: center">
          <iconify-icon-online icon="ep:timer" />
          <span style="margin-left: 10px">{row.date}</span>
        </div>
      )
    },
    {
      label: "姓名",
      prop: "name",
      cellRenderer: ({ row }) => (
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          {{
            default: () => (
              <>
                <div>name: {row.name}</div>
                <div>address: {row.address}</div>
              </>
            ),
            reference: () => <el-tag>{row.name}</el-tag>
          }}
        </el-popover>
      )
    },
    {
      label: "地址",
      prop: "address"
    },
    {
      label: "操作",
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

  const handleEdit = (index: number, row) => {
    message(`您编辑了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
      type: "success"
    });
  };

  const handleDelete = (index: number, row) => {
    message(`您删除了第 ${index} 行，数据为：${JSON.stringify(row)}`);
  };

  return {
    columns,
    tableData
  };
}
