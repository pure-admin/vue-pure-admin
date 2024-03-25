import { ref, computed } from "vue";
import { tableDataEdit } from "../data";

import EditPen from "@iconify-icons/ep/edit-pen";
import Check from "@iconify-icons/ep/check";

export function useColumns() {
  const editMap = ref({});
  const activeIndex = ref(-1);
  const dataList = ref(tableDataEdit);

  const editing = computed(() => {
    return index => {
      return editMap.value[index]?.editing;
    };
  });

  const iconClass = computed(() => {
    return (index, other = false) => {
      return [
        "cursor-pointer",
        "ml-2",
        "transition",
        "delay-100",
        other
          ? ["hover:scale-110", "hover:text-red-500"]
          : editing.value(index) && ["scale-150", "text-red-500"]
      ];
    };
  });

  const columns: TableColumnList = [
    {
      label: "姓名（可修改）",
      prop: "name",
      cellRenderer: ({ row, index }) => (
        <div
          class="flex-bc w-full h-[32px]"
          onMouseenter={() => (activeIndex.value = index)}
          onMouseleave={() => onMouseleave(index)}
        >
          {!editing.value(index) ? (
            <p>{row.name}</p>
          ) : (
            <>
              <el-input v-model={row.name} />
              <iconify-icon-offline
                icon={Check}
                class={iconClass.value(index)}
                onClick={() => onSave(index)}
              />
            </>
          )}
          <iconify-icon-offline
            v-show={activeIndex.value === index && !editing.value(index)}
            icon={EditPen}
            class={iconClass.value(index, true)}
            onClick={() => onEdit(row, index)}
          />
        </div>
      )
    },
    {
      label: "地址",
      prop: "address"
    }
  ];

  function onMouseleave(index) {
    editing.value[index]
      ? (activeIndex.value = index)
      : (activeIndex.value = -1);
  }

  function onEdit(row, index) {
    editMap.value[index] = Object.assign({ ...row, editing: true });
  }

  function onSave(index) {
    editMap.value[index].editing = false;
  }

  return {
    columns,
    dataList
  };
}
