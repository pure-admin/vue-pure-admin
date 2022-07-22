import {
  defineComponent,
  computed,
  nextTick,
  onBeforeMount,
  getCurrentInstance,
  unref
} from "vue";
import { addClass, removeClass, toggleClass } from "@pureadmin/utils";
import "./index.css";

const stayClass = "stay"; //鼠标点击
const activeClass = "hs-on"; //鼠标移动上去
const voidClass = "hs-off"; //鼠标移开
const inRange = "hs-range"; //当前选中的两个元素之间的背景
const bothLeftSides = "both-left-sides";
const bothRightSides = "both-right-sides";
let selectedDirection = "right"; //默认从左往右，索引变大

let overList = [];
// 存放第一个选中的元素和最后一个选中元素，只能存放这两个元素
let selectedList = [];

const props = {
  HsKey: {
    type: Number || String,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Array,
    default() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
  },
  // 回显数据的索引，长度必须是2
  echo: {
    type: Array,
    default() {
      return [];
    }
  }
};

export default defineComponent({
  name: "ReSelector",
  props,
  emits: ["selectedVal"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const currentValue = props.value;

    const rateDisabled = computed(() => {
      return props.disabled;
    });

    const classes = computed(() => {
      const result = [];
      let i = 0;
      let threshold = currentValue;
      if (currentValue !== Math.floor(currentValue)) {
        threshold--;
      }
      for (; i < threshold; i++) {
        result.push(activeClass);
      }
      for (; i < props.max.length; i++) {
        result.push(voidClass);
      }
      return result;
    });

    // 鼠标移入
    const setCurrentValue = index => {
      if (props.disabled) return;
      // 当选中一个元素后，开始添加背景色
      if (selectedList.length === 1) {
        if (overList.length < 1) overList.push({ index });

        let firstIndex = overList[0].index;

        // 往右走，索引变大
        if (index > firstIndex) {
          selectedDirection = "right";
          toggleClass(
            false,
            bothRightSides,
            document.querySelector(".hs-select__item" + selectedList[0].index)
          );

          while (index >= firstIndex) {
            addClass(
              document.querySelector(".hs-select__item" + firstIndex),
              inRange
            );
            firstIndex++;
          }
        } else {
          selectedDirection = "left";
          toggleClass(
            true,
            bothRightSides,
            document.querySelector(".hs-select__item" + selectedList[0].index)
          );

          while (index <= firstIndex) {
            addClass(
              document.querySelector(".hs-select__item" + firstIndex),
              inRange
            );
            firstIndex--;
          }
        }
      }

      addClass(document.querySelector("." + voidClass + index), activeClass);
    };

    // 鼠标离开
    const resetCurrentValue = index => {
      if (props.disabled) return;
      // 移除先检查是否选中 选中则返回false 不移除
      const currentHsDom = document.querySelector("." + voidClass + index);
      if (currentHsDom.className.includes(stayClass)) {
        return false;
      } else {
        removeClass(currentHsDom, activeClass);
      }

      // 当选中一个元素后，开始移除背景色
      if (selectedList.length === 1) {
        const firstIndex = overList[0].index;
        if (index >= firstIndex) {
          for (let i = 0; i <= index; i++) {
            removeClass(
              document.querySelector(".hs-select__item" + i),
              inRange
            );
          }
        } else {
          while (index <= firstIndex) {
            removeClass(
              document.querySelector(".hs-select__item" + index),
              inRange
            );
            index++;
          }
        }
      }
    };

    // 鼠标点击
    const selectValue = (index, item) => {
      if (props.disabled) return;
      const len = selectedList.length;

      if (len < 2) {
        selectedList.push({ item, index });
        addClass(document.querySelector("." + voidClass + index), stayClass);

        addClass(
          document.querySelector(".hs-select__item" + selectedList[0].index),
          bothLeftSides
        );

        if (selectedList[1]) {
          if (selectedDirection === "right") {
            addClass(
              document.querySelector(
                ".hs-select__item" + selectedList[1].index
              ),
              bothRightSides
            );
          } else {
            addClass(
              document.querySelector(
                ".hs-select__item" + selectedList[1].index
              ),
              bothLeftSides
            );
          }
        }

        if (len === 1) {
          // 顺时针排序
          if (selectedDirection === "right") {
            emit("selectedVal", {
              left: selectedList[0].item,
              right: selectedList[1].item,
              whole: selectedList
            });
          } else {
            emit("selectedVal", {
              left: selectedList[1].item,
              right: selectedList[0].item,
              whole: selectedList
            });
          }
        }
      } else {
        nextTick(() => {
          selectedList.forEach(v => {
            removeClass(
              document.querySelector("." + voidClass + v.index),
              activeClass,
              stayClass
            );

            removeClass(
              document.querySelector(".hs-select__item" + v.index),
              bothLeftSides,
              bothRightSides
            );
          });

          selectedList = [];
          overList = [];
          for (let i = 0; i <= props.max.length; i++) {
            const currentDom = document.querySelector(".hs-select__item" + i);
            if (currentDom) {
              removeClass(currentDom, inRange);
            }
          }

          selectedList.push({ item, index });
          addClass(document.querySelector("." + voidClass + index), stayClass);

          addClass(
            document.querySelector(".hs-select__item" + selectedList[0].index),
            bothLeftSides
          );
        });
      }
    };

    // 回显数据
    const echoView = item => {
      if (item.length === 0) return;

      if (item.length > 2 || item.length === 1) {
        throw "传入的数组长度必须是2";
      }

      item.sort((a, b) => {
        return a - b;
      });

      addClass(
        instance.refs["hsdiv" + props.HsKey + item[0]] as Element,
        activeClass,
        stayClass
      );

      addClass(
        instance.refs["hstd" + props.HsKey + item[0]] as Element,
        bothLeftSides
      );

      addClass(
        instance.refs["hsdiv" + props.HsKey + item[1]] as Element,
        activeClass,
        stayClass
      );

      addClass(
        instance.refs["hstd" + props.HsKey + item[1]] as Element,
        bothRightSides
      );

      while (item[1] >= item[0]) {
        addClass(
          instance.refs["hstd" + props.HsKey + item[0]] as Element,
          inRange
        );
        item[0]++;
      }
    };

    onBeforeMount(() => {
      nextTick(() => {
        echoView(props.echo);
      });
    });

    return () => (
      <>
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              {props.max.map((item, key) => {
                return (
                  <td
                    data-index={props.HsKey}
                    ref={`hstd${props.HsKey}${key}`}
                    class={`hs-select__item${key}`}
                    onMousemove={() => setCurrentValue(key)}
                    onMouseleave={() => resetCurrentValue(key)}
                    onClick={() => selectValue(key, item)}
                    style={{
                      cursor: unref(rateDisabled) ? "auto" : "pointer",
                      textAlign: "center"
                    }}
                    key={key}
                  >
                    <div
                      ref={`hsdiv${props.HsKey}${key}`}
                      class={`hs-item ${[unref(classes)[key] + key]}`}
                    >
                      <span>{item}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </>
    );
  }
});
