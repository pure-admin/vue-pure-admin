import { tableData } from "../data";
import { ref, onMounted } from "vue";
import { clone } from "@pureadmin/utils";

export function useColumns() {
  const dataList = ref([]);
  const columns = ref<TableColumnList>([
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "地址",
      prop: "address"
    }
  ]);

  function onChange() {
    // 动态表头只需给 columns.value 重新赋值即可，如下
    columns.value = [
      {
        label: "日期" + Math.round(Math.random() * 99),
        prop: "date"
      },
      {
        label: Math.round(Math.random() * 99) + "姓名",
        prop: "name"
      },
      {
        label: "地址",
        prop: "address"
      }
    ];
  }

  onMounted(() => {
    clone(tableData, true).forEach((item, index) => {
      dataList.value.push({ id: index, ...item });
    });
  });

  return {
    columns,
    dataList,
    onChange
  };
}
