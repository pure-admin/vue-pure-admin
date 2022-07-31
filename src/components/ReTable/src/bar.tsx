import { defineComponent, ref, computed, PropType } from "vue";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { IconifyIconOffline } from "../../ReIcon";

export const loadingSvg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  "
    style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
  />
`;

const props = {
  // 头部最左边的标题
  title: {
    type: String,
    default: "列表"
  },
  // 表格数据
  dataList: {
    type: Array,
    default: () => {
      return [];
    }
  },
  // 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可
  tableRef: {
    type: Object as PropType<any>,
    default() {
      return {};
    }
  },
  // 是否显示加载动画，默认false 不加载
  loading: {
    type: Boolean,
    default: false
  }
};

export default defineComponent({
  name: "TableProBar",
  props,
  emits: ["refresh"],
  setup(props, { emit, slots, attrs }) {
    const buttonRef = ref();
    const checkList = ref([]);
    const size = ref("default");
    const isExpandAll = ref(true);

    const getDropdownItemStyle = computed(() => {
      return s => {
        return {
          background:
            s === size.value ? useEpThemeStoreHook().epThemeColor : "",
          color: s === size.value ? "#fff" : "var(--el-text-color-primary)"
        };
      };
    });

    function onExpand() {
      isExpandAll.value = !isExpandAll.value;
      toggleRowExpansionAll(props.dataList, isExpandAll.value);
    }

    function toggleRowExpansionAll(data, isExpansion) {
      data.forEach(item => {
        props.tableRef.toggleRowExpansion(item, isExpansion);
        if (item.children !== undefined && item.children !== null) {
          toggleRowExpansionAll(item.children, isExpansion);
        }
      });
    }

    const dropdown = {
      dropdown: () => (
        <el-dropdown-menu class="translation">
          <el-dropdown-item
            style={getDropdownItemStyle.value("large")}
            onClick={() => (size.value = "large")}
          >
            松散
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value("default")}
            onClick={() => (size.value = "default")}
          >
            默认
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value("small")}
            onClick={() => (size.value = "small")}
          >
            紧凑
          </el-dropdown-item>
        </el-dropdown-menu>
      )
    };

    const reference = {
      reference: () => (
        <IconifyIconOffline
          class="cursor-pointer"
          icon="setting"
          width="16"
          color="text_color_regular"
          onMouseover={e => (buttonRef.value = e.currentTarget)}
        />
      )
    };

    return () => (
      <>
        <div
          {...attrs}
          class="w-99/100 mt-6 p-2 bg-white dark:bg-dark"
          v-loading={props.loading}
          element-loading-svg={loadingSvg}
          element-loading-svg-view-box="-10, -10, 50, 50"
        >
          <div class="flex justify-between w-full h-60px p-4">
            <p class="font-bold truncate">{props.title}</p>
            <div class="flex items-center justify-around">
              <div class="flex mr-4">{slots?.buttons()}</div>
              {props.tableRef?.size ? (
                <>
                  <el-tooltip
                    effect="dark"
                    content={isExpandAll.value ? "折叠" : "展开"}
                    placement="top"
                  >
                    <IconifyIconOffline
                      class="cursor-pointer"
                      icon={isExpandAll.value ? "unExpand" : "expand"}
                      width="16"
                      color="text_color_regular"
                      onClick={() => onExpand()}
                    />
                  </el-tooltip>
                  <el-divider direction="vertical" />
                </>
              ) : undefined}
              <el-tooltip effect="dark" content="刷新" placement="top">
                <IconifyIconOffline
                  class="cursor-pointer"
                  icon="refresh-right"
                  width="16"
                  color="text_color_regular"
                  onClick={() => emit("refresh")}
                />
              </el-tooltip>
              <el-divider direction="vertical" />

              <el-tooltip effect="dark" content="密度" placement="top">
                <el-dropdown v-slots={dropdown} trigger="click">
                  <IconifyIconOffline
                    class="cursor-pointer"
                    icon="density"
                    width="16"
                    color="text_color_regular"
                  />
                </el-dropdown>
              </el-tooltip>
              <el-divider direction="vertical" />

              <el-popover v-slots={reference} width="200" trigger="click">
                <el-checkbox-group v-model={checkList.value}>
                  <el-checkbox label="序号列" />
                  <el-checkbox label="勾选列" />
                </el-checkbox-group>
              </el-popover>
            </div>

            <el-tooltip
              popper-options={{
                modifiers: [
                  {
                    name: "computeStyles",
                    options: {
                      adaptive: false,
                      enabled: false
                    }
                  }
                ]
              }}
              placement="top"
              virtual-ref={buttonRef.value}
              virtual-triggering
              trigger="hover"
              content="列设置"
            />
          </div>
          {props.dataList.length > 0 ? (
            slots.default({ size: size.value, checkList: checkList.value })
          ) : (
            <el-empty description="暂无数据" />
          )}
        </div>
      </>
    );
  }
});
