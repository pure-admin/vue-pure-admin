import { ref } from "vue";
import { tableData, options } from "../data";
import { clone, delObjectProperty } from "@pureadmin/utils";

export function useColumns() {
  const editMap = ref({});
  const dataList = ref(clone(tableData, true));

  const columns: TableColumnList = [
    {
      label: "姓名",
      prop: "name",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-input v-model={row.name} />
          ) : (
            <p>{row.name}</p>
          )}
        </>
      )
    },
    {
      label: "性别",
      prop: "sex",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-switch
              v-model={row.sex}
              inline-prompt
              active-value={0}
              inactive-value={1}
              active-text="男"
              inactive-text="女"
            />
          ) : (
            <p>{row.sex === 0 ? "男" : "女"}</p>
          )}
        </>
      )
    },
    {
      label: "爱好",
      prop: "hobby",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-select v-model={row.hobby} clearable placeholder="请选择爱好">
              {options.map(item => {
                return (
                  <el-option
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                );
              })}
            </el-select>
          ) : (
            <el-tag type="primary">
              {options.filter(opt => opt.value == row.hobby)[0]?.label}
            </el-tag>
          )}
        </>
      )
    },
    {
      label: "日期",
      prop: "date",
      cellRenderer: ({ row, index }) => (
        <>
          {editMap.value[index]?.editable ? (
            <el-date-picker
              v-model={row.date}
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
            />
          ) : (
            <p>{row.date}</p>
          )}
        </>
      ),
      minWidth: 110
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editable: true });
  }

  function onSave(index) {
    editMap.value[index].editable = false;
  }

  function onCancel(index) {
    editMap.value[index].editable = false;
    dataList.value[index] = delObjectProperty(editMap.value[index], "editable");
  }

  return {
    editMap,
    columns,
    dataList,
    onEdit,
    onSave,
    onCancel
  };
}
