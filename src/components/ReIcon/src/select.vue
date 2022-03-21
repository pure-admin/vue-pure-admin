<script setup lang="ts">
import { cloneDeep } from "lodash-unified";
import { ref, computed, CSSProperties } from "vue";
import { IconJson } from "/@/components/ReIcon/data";
type ParameterCSSProperties = (item?: string) => CSSProperties | undefined;

let inputValue = ref("ep:add-location");
let iconList = ref(IconJson);
let icon = ref("add-location");
let currentActiveType = ref("ep:");
// 深拷贝图标数据，前端做搜索
let copyIconList = cloneDeep(iconList.value);

let pageSize = ref(96);
let currentPage = ref(1);

// 搜索条件
let filterValue = ref("");

let tabsList = [
  {
    label: "Element Plus",
    name: "ep:"
  },
  {
    label: "Font Awesome 4",
    name: "fa:"
  },
  {
    label: "Font Awesome 5 Solid",
    name: "fa-solid:"
  }
];

let pageList = computed(() => {
  if (currentPage.value === 1) {
    return copyIconList[currentActiveType.value]
      .slice(currentPage.value - 1, pageSize.value)
      .filter(v => v.includes(filterValue.value));
  } else {
    return copyIconList[currentActiveType.value]
      .slice(
        pageSize.value * (currentPage.value - 1),
        pageSize.value * (currentPage.value - 1) + pageSize.value
      )
      .filter(v => v.includes(filterValue.value));
  }
});

const iconItemStyle = computed((): ParameterCSSProperties => {
  return item => {
    if (inputValue.value === currentActiveType.value + item) {
      return {
        borderColor: "var(--el-color-primary)"
      };
    }
  };
});

function handleClick({ props }) {
  currentPage.value = 1;
  currentActiveType.value = props.name;
  inputValue.value =
    currentActiveType.value + iconList.value[currentActiveType.value][0];
  icon.value = iconList.value[currentActiveType.value][0];
}

function onChangeIcon(item) {
  inputValue.value = currentActiveType.value + item;
  icon.value = item;
}

function onCurrentChange(page) {
  currentPage.value = page;
}
</script>

<template>
  <div class="selector w-350px">
    <el-input v-model="inputValue" disabled>
      <template #append>
        <el-popover :width="350" trigger="click" popper-class="pure-popper">
          <template #reference>
            <div
              class="w-40px h-32px cursor-pointer flex justify-center items-center"
            >
              <IconifyIconOnline :icon="icon" :type="currentActiveType" />
            </div>
          </template>

          <el-input
            class="p-2"
            v-model="filterValue"
            placeholder="搜索图标"
            clearable
          />
          <el-divider border-style="dashed" />

          <el-tabs v-model="currentActiveType" @tab-click="handleClick">
            <el-tab-pane
              v-for="(pane, index) in tabsList"
              :key="index"
              :label="pane.label"
              :name="pane.name"
            >
              <el-divider class="tab-divider" border-style="dashed" />
              <el-scrollbar height="220px">
                <ul class="flex flex-wrap px-2 ml-2">
                  <li
                    v-for="(item, key) in pageList"
                    :key="key"
                    :title="item"
                    class="icon-item p-2 w-1/10 cursor-pointer mr-2 mt-1 flex justify-center items-center border border-solid"
                    :style="iconItemStyle(item)"
                    @click="onChangeIcon(item)"
                  >
                    <IconifyIconOnline :icon="item" :type="currentActiveType" />
                  </li>
                </ul>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
          <el-divider border-style="dashed" />

          <el-pagination
            small
            :total="copyIconList[currentActiveType].length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            layout="prev, pager, next"
            class="flex items-center justify-center h-10"
            @current-change="onCurrentChange"
          />
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 1px auto !important;
}

.tab-divider.el-divider--horizontal {
  margin: 0 !important;
}

.icon-item {
  &:hover {
    border-color: var(--el-color-primary);
  }
}

:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px #ccc;
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px #ccc;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-tabs__item) {
  font-size: 12px;
  font-weight: normal;
  height: 30px;
  line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
  margin: 0;
  position: static;
}
</style>
