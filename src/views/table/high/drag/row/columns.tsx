import Sortable from "sortablejs";
import { ref, nextTick } from "vue";
import { clone } from "@pureadmin/utils";
import { tableDataDrag } from "../../data";

// 行拖拽演示
export function useColumns() {
  const dataList = ref(clone(tableDataDrag, true));

  const rowDrop = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    nextTick(() => {
      const wrapper: HTMLElement = document.querySelector(
        ".el-table__body-wrapper tbody"
      );
      Sortable.create(wrapper, {
        animation: 300,
        handle: ".drag-btn",
        onEnd: ({ newIndex, oldIndex }) => {
          const currentRow = dataList.value.splice(oldIndex, 1)[0];
          dataList.value.splice(newIndex, 0, currentRow);
        }
      });
    });
  };

  const columns: TableColumnList = [
    // {
    //   width: 60,
    //   cellRenderer: () => (
    //     <iconify-icon-online
    //       icon="icon-park-outline:drag"
    //       class="drag-btn cursor-grab"
    //       onMouseenter={(event: { preventDefault: () => void }) =>
    //         rowDrop(event)
    //       }
    //     />
    //   )
    // },
    {
      label: "ID",
      prop: "id",
      cellRenderer: ({ row }) => (
        <div class="flex items-center">
          <iconify-icon-online
            icon="icon-park-outline:drag"
            class="drag-btn cursor-grab"
            onMouseenter={(event: { preventDefault: () => void }) =>
              rowDrop(event)
            }
          />
          <p class="ml-[16px]">{row.id}</p>
        </div>
      )
    },
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "姓名",
      prop: "name"
    }
  ];

  return {
    columns,
    dataList
  };
}
