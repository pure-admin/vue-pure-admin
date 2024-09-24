import Sortable from "sortablejs";
import { transformI18n } from "@/plugins/i18n";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { delay, cloneDeep, getKeyList } from "@pureadmin/utils";
import {
  type PropType,
  ref,
  unref,
  computed,
  nextTick,
  defineComponent,
  getCurrentInstance
} from "vue";

import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";
import DragIcon from "@/assets/table-bar/drag.svg?component";
import ExpandIcon from "@/assets/table-bar/expand.svg?component";
import RefreshIcon from "@/assets/table-bar/refresh.svg?component";
import SettingIcon from "@/assets/table-bar/settings.svg?component";
import CollapseIcon from "@/assets/table-bar/collapse.svg?component";

const props = {
  /** 头部最左边的标题 */
  title: {
    type: String,
    default: "列表"
  },
  vxeTableRef: {
    type: Object as PropType<any>
  },
  /** 需要展示的列 */
  columns: {
    type: Array as PropType<any>,
    default: () => []
  },
  /** 是否为树列表 */
  tree: {
    type: Boolean,
    default: false
  },
  isExpandAll: {
    type: Boolean,
    default: true
  },
  tableKey: {
    type: [String, Number] as PropType<string | number>,
    default: "0"
  }
};

export default defineComponent({
  name: "VxeTableBar",
  props,
  emits: ["refresh", "fullscreen"],
  setup(props, { emit, slots, attrs }) {
    const size = ref("small");
    const loading = ref(false);
    const checkAll = ref(true);
    const isFullscreen = ref(false);
    const isIndeterminate = ref(false);
    const instance = getCurrentInstance()!;
    const isExpandAll = ref(props.isExpandAll);
    let checkColumnList = getKeyList(cloneDeep(props?.columns), "title");
    const checkedColumns = ref(getKeyList(cloneDeep(props?.columns), "title"));
    const dynamicColumns = ref(cloneDeep(props?.columns));

    const getDropdownItemStyle = computed(() => {
      return s => {
        return {
          background:
            s === size.value ? useEpThemeStoreHook().epThemeColor : "",
          color: s === size.value ? "#fff" : "var(--el-text-color-primary)"
        };
      };
    });

    const iconClass = computed(() => {
      return [
        "text-black",
        "dark:text-white",
        "duration-100",
        "hover:!text-primary",
        "cursor-pointer",
        "outline-none"
      ];
    });

    const topClass = computed(() => {
      return [
        "flex",
        "justify-between",
        "pt-[3px]",
        "px-[11px]",
        "border-b-[1px]",
        "border-solid",
        "border-[#dcdfe6]",
        "dark:border-[#303030]"
      ];
    });

    function onReFresh() {
      loading.value = true;
      emit("refresh");
      delay(500).then(() => (loading.value = false));
    }

    function onExpand() {
      isExpandAll.value = !isExpandAll.value;
      isExpandAll.value
        ? props.vxeTableRef.setAllTreeExpand(true)
        : props.vxeTableRef.clearTreeExpand();
      props.vxeTableRef.refreshColumn();
    }

    function onFullscreen() {
      isFullscreen.value = !isFullscreen.value;
      emit("fullscreen", isFullscreen.value);
    }

    function reloadColumn() {
      const curCheckedColumns = cloneDeep(dynamicColumns.value).filter(item =>
        checkedColumns.value.includes(item.title)
      );
      props.vxeTableRef.reloadColumn(curCheckedColumns);
    }

    function handleCheckAllChange(val: boolean) {
      checkedColumns.value = val ? checkColumnList : [];
      isIndeterminate.value = false;
      reloadColumn();
    }

    function handleCheckedColumnsChange(value: string[]) {
      checkedColumns.value = value;
      const checkedCount = value.length;
      checkAll.value = checkedCount === checkColumnList.length;
      isIndeterminate.value =
        checkedCount > 0 && checkedCount < checkColumnList.length;
    }

    async function onReset() {
      checkAll.value = true;
      isIndeterminate.value = false;
      dynamicColumns.value = cloneDeep(props?.columns);
      checkColumnList = [];
      checkColumnList = await getKeyList(cloneDeep(props?.columns), "title");
      checkedColumns.value = getKeyList(cloneDeep(props?.columns), "title");
      props.vxeTableRef.refreshColumn();
    }

    function changeSize(curSize: string) {
      size.value = curSize;
      props.vxeTableRef.refreshColumn();
    }

    const dropdown = {
      dropdown: () => (
        <el-dropdown-menu class="translation">
          <el-dropdown-item
            style={getDropdownItemStyle.value("medium")}
            onClick={() => changeSize("medium")}
          >
            宽松
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value("small")}
            onClick={() => changeSize("small")}
          >
            默认
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value("mini")}
            onClick={() => changeSize("mini")}
          >
            紧凑
          </el-dropdown-item>
        </el-dropdown-menu>
      )
    };

    /** 列展示拖拽排序 */
    const rowDrop = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      nextTick(() => {
        const wrapper: HTMLElement = (
          instance?.proxy?.$refs[`VxeGroupRef${unref(props.tableKey)}`] as any
        ).$el.firstElementChild;
        Sortable.create(wrapper, {
          animation: 300,
          handle: ".drag-btn",
          onEnd: ({ newIndex, oldIndex, item }) => {
            const targetThElem = item;
            const wrapperElem = targetThElem.parentNode as HTMLElement;
            const oldColumn = dynamicColumns.value[oldIndex];
            const newColumn = dynamicColumns.value[newIndex];
            if (oldColumn?.fixed || newColumn?.fixed) {
              // 当前列存在fixed属性 则不可拖拽
              const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, oldThElem);
              } else {
                wrapperElem.insertBefore(
                  targetThElem,
                  oldThElem ? oldThElem.nextElementSibling : oldThElem
                );
              }
              return;
            }
            const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0];
            dynamicColumns.value.splice(newIndex, 0, currentRow);
            reloadColumn();
          }
        });
      });
    };

    const isFixedColumn = (title: string) => {
      return dynamicColumns.value.filter(
        item => transformI18n(item.title) === transformI18n(title)
      )[0].fixed
        ? true
        : false;
    };

    const rendTippyProps = (content: string) => {
      // https://vue-tippy.netlify.app/props
      return {
        content,
        offset: [0, 18],
        duration: [300, 0],
        followCursor: true,
        hideOnClick: "toggle"
      };
    };

    const reference = {
      reference: () => (
        <SettingIcon
          class={["w-[16px]", iconClass.value]}
          v-tippy={rendTippyProps("列设置")}
        />
      )
    };

    return () => (
      <>
        <div
          {...attrs}
          class={[
            "w-[99/100]",
            "px-2",
            "pb-2",
            "bg-bg_color",
            isFullscreen.value
              ? ["!w-full", "!h-full", "z-[2002]", "fixed", "inset-0"]
              : "mt-2"
          ]}
        >
          <div class="flex justify-between w-full h-[60px] p-4">
            {slots?.title ? (
              slots.title()
            ) : (
              <p class="font-bold truncate">{props.title}</p>
            )}
            <div class="flex items-center justify-around">
              {slots?.buttons ? (
                <div class="flex mr-4">{slots.buttons()}</div>
              ) : null}
              {props.tree ? (
                <>
                  <ExpandIcon
                    class={["w-[16px]", iconClass.value]}
                    style={{
                      transform: isExpandAll.value ? "none" : "rotate(-90deg)"
                    }}
                    v-tippy={rendTippyProps(
                      isExpandAll.value ? "折叠" : "展开"
                    )}
                    onClick={() => onExpand()}
                  />
                  <el-divider direction="vertical" />
                </>
              ) : null}
              <RefreshIcon
                class={[
                  "w-[16px]",
                  iconClass.value,
                  loading.value ? "animate-spin" : ""
                ]}
                v-tippy={rendTippyProps("刷新")}
                onClick={() => onReFresh()}
              />
              <el-divider direction="vertical" />
              <el-dropdown
                v-slots={dropdown}
                trigger="click"
                v-tippy={rendTippyProps("密度")}
              >
                <CollapseIcon class={["w-[16px]", iconClass.value]} />
              </el-dropdown>
              <el-divider direction="vertical" />

              <el-popover
                v-slots={reference}
                placement="bottom-start"
                popper-style={{ padding: 0 }}
                width="200"
                trigger="click"
              >
                <div class={[topClass.value]}>
                  <el-checkbox
                    class="!-mr-1"
                    label="列展示"
                    v-model={checkAll.value}
                    indeterminate={isIndeterminate.value}
                    onChange={value => handleCheckAllChange(value)}
                  />
                  <el-button type="primary" link onClick={() => onReset()}>
                    重置
                  </el-button>
                </div>

                <div class="pt-[6px] pl-[11px]">
                  <el-scrollbar max-height="36vh">
                    <el-checkbox-group
                      ref={`VxeGroupRef${unref(props.tableKey)}`}
                      modelValue={checkedColumns.value}
                      onChange={value => handleCheckedColumnsChange(value)}
                    >
                      <el-space
                        direction="vertical"
                        alignment="flex-start"
                        size={0}
                      >
                        {checkColumnList.map((item, index) => {
                          return (
                            <div class="flex items-center">
                              <DragIcon
                                class={[
                                  "drag-btn w-[16px] mr-2",
                                  isFixedColumn(item)
                                    ? "!cursor-no-drop"
                                    : "!cursor-grab"
                                ]}
                                onMouseenter={(event: {
                                  preventDefault: () => void;
                                }) => rowDrop(event)}
                              />
                              <el-checkbox
                                key={index}
                                label={item}
                                value={item}
                                onChange={reloadColumn}
                              >
                                <span
                                  title={transformI18n(item)}
                                  class="inline-block w-[120px] truncate hover:text-text_color_primary"
                                >
                                  {transformI18n(item)}
                                </span>
                              </el-checkbox>
                            </div>
                          );
                        })}
                      </el-space>
                    </el-checkbox-group>
                  </el-scrollbar>
                </div>
              </el-popover>
              <el-divider direction="vertical" />

              <iconifyIconOffline
                class={["w-[16px]", iconClass.value]}
                icon={isFullscreen.value ? ExitFullscreen : Fullscreen}
                v-tippy={isFullscreen.value ? "退出全屏" : "全屏"}
                onClick={() => onFullscreen()}
              />
            </div>
          </div>
          {slots.default({
            size: size.value,
            dynamicColumns: dynamicColumns.value
          })}
        </div>
      </>
    );
  }
});
