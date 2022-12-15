import { defineComponent, ref, computed, type PropType } from "vue";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";

import Expand from "@iconify-icons/mdi/arrow-expand-down";
import ArrowCollapse from "@iconify-icons/mdi/arrow-collapse-vertical";
import Setting from "@iconify-icons/ri/settings-3-line";
import RefreshRight from "@iconify-icons/ep/refresh-right";

const props = {
  /** 头部最左边的标题 */
  title: {
    type: String,
    default: "列表"
  },
  /** 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可 */
  tableRef: {
    type: Object as PropType<any>
  }
};

export default defineComponent({
  name: "PureTableBar",
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
      toggleRowExpansionAll(props.tableRef.data, isExpandAll.value);
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
            宽松
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
        <iconify-icon-offline
          class="cursor-pointer"
          icon={Setting}
          width="16"
          color="text_color_regular"
          onMouseover={e => (buttonRef.value = e.currentTarget)}
        />
      )
    };

    return () => (
      <>
        <div {...attrs} class="w-[99/100] mt-6 p-2 bg-bg_color">
          <div class="flex justify-between w-full h-[60px] p-4">
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
                    <iconify-icon-offline
                      class="cursor-pointer duration-100"
                      icon={Expand}
                      style={{
                        transform: isExpandAll.value ? "none" : "rotate(-90deg)"
                      }}
                      width="16"
                      color="text_color_regular"
                      onClick={() => onExpand()}
                    />
                  </el-tooltip>
                  <el-divider direction="vertical" />
                </>
              ) : null}
              <el-tooltip effect="dark" content="刷新" placement="top">
                <iconify-icon-offline
                  class="cursor-pointer"
                  icon={RefreshRight}
                  width="16"
                  color="text_color_regular"
                  onClick={() => emit("refresh")}
                />
              </el-tooltip>
              <el-divider direction="vertical" />

              <el-tooltip effect="dark" content="密度" placement="top">
                <el-dropdown v-slots={dropdown} trigger="click">
                  <iconify-icon-offline
                    class="cursor-pointer"
                    icon={ArrowCollapse}
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
          {slots.default({ size: size.value, checkList: checkList.value })}
        </div>
      </>
    );
  }
});
