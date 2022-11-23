import Sortable from "sortablejs";
import { clone } from "@pureadmin/utils";
import { tableDataDrag } from "../../data";
import { ref, nextTick, onMounted } from "vue";

// 列拖拽演示
export function useColumns() {
  const dataList = ref(clone(tableDataDrag, true));

  const columnsDrag = ref<TableColumnList>([
    {
      label: "ID",
      prop: "id"
    },
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "姓名",
      prop: "name"
    }
  ]);

  const columns = ref<TableColumnList>([
    {
      label: "ID",
      prop: index => columnsDrag.value[index].prop as string
    },
    {
      label: "日期",
      prop: index => columnsDrag.value[index].prop as string
    },
    {
      label: "姓名",
      prop: index => columnsDrag.value[index].prop as string
    }
  ]);

  const columnDrop = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    nextTick(() => {
      const wrapper: HTMLElement = document.querySelector(
        ".el-table__header-wrapper tr"
      );
      Sortable.create(wrapper, {
        animation: 300,
        delay: 0,
        onEnd: ({ newIndex, oldIndex }) => {
          const oldItem = columnsDrag.value[oldIndex];
          columnsDrag.value.splice(oldIndex, 1);
          columnsDrag.value.splice(newIndex, 0, oldItem);
        }
      });
    });
  };

  onMounted(() => {
    nextTick(() => {
      columnDrop(event);
    });
  });

  return {
    columns,
    dataList,
    columnsDrag
  };
}
