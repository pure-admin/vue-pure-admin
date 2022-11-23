import { ref, computed } from "vue";
import { tableDataEdit } from "../data";
import { message } from "@pureadmin/components";
import { clone, delay } from "@pureadmin/utils";

// 温馨提示：编辑整行方法雷同，将cellRenderer后面渲染的组件抽出来做对应处理即可
export function useColumns() {
  const inputValMap = ref({});
  const activeIndex = ref(-1);
  const dataList = ref(clone(tableDataEdit, true));

  const comVal = computed(() => {
    return index => {
      return inputValMap.value[index]?.value;
    };
  });

  const columns: TableColumnList = [
    {
      label: "ID（可编辑）",
      prop: "id",
      // class="flex-bc" flex-bc 代表 flex justify-between items-center 具体看 src/style/tailwind.css 文件
      cellRenderer: ({ row, index }) => (
        <div
          class="flex-bc"
          onMouseenter={() => (activeIndex.value = index)}
          onMouseleave={() => onMouseleave(index)}
        >
          <p v-show={!comVal.value(index)}>{row.id}</p>
          <el-input
            v-show={comVal.value(index)}
            modelValue={comVal.value(index)}
            onInput={value => onChange(value, index)}
          />
          <iconify-icon-offline
            v-show={comVal.value(index)}
            icon="check"
            class="cursor-pointer ml-2 transition delay-100 hover:scale-150 hover:text-red-500"
            onClick={() => onSure(index)}
          />
          <iconify-icon-offline
            v-show={activeIndex.value === index && !comVal.value(index)}
            icon="edits"
            class="cursor-pointer ml-2 transition delay-100 hover:scale-110 hover:text-red-500"
            onClick={() => onEdit(row, index)}
          />
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
    },
    {
      label: "地址",
      prop: "address"
    }
  ];

  function onEdit({ id }, index) {
    inputValMap.value[index] = Object.assign({}, inputValMap.value[index], {
      value: id
    });
  }

  function onMouseleave(index) {
    inputValMap.value[index]?.value
      ? (activeIndex.value = index)
      : (activeIndex.value = -1);
  }

  function onChange(value, index) {
    inputValMap.value[index].value = value;
  }

  function onSure(index) {
    dataList.value[index].id = inputValMap.value[index].value;
    message.success(
      `您编辑了第 ${index + 1} 行，编辑后数据为：${JSON.stringify(
        dataList.value[index]
      )}`
    );
    delay().then(() => (inputValMap.value[index].value = null));
  }

  return {
    columns,
    dataList
  };
}
