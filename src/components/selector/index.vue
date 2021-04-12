<template>
  <table cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td
          v-for="(item, key) in max"
          :class="['hs-select__item' + key]"
          @mousemove.prevent="setCurrentValue(key, $event)"
          @mouseleave.prevent="resetCurrentValue(key)"
          @click="selectValue(key, item)"
          :style="{ cursor: rateDisabled ? 'auto' : 'pointer', 'text-align': 'center' }"
          :key="key"
        >
          <div :class="[classes[key] + key]" class="hs-item">
            <span>{{item}}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang='ts'>
import { defineComponent, computed, nextTick } from "vue";
import { addClass, removeClass, toggleClass } from "/@/utils/operate";
import { useDebounceFn } from "@vueuse/core";

// 选中非选中状态
let stayClass = "stay"; //鼠标点击
let activeClass = "hs-on"; //鼠标移动上去
let voidClass = "hs-off"; //鼠标移开
let inRange = "hs-range"; //当前选中的两个元素之间的背景
let bothLeftSides = "both-left-sides";
let bothRightSides = "both-right-sides";
let selectedDirection = "right"; //默认从左往右，索引变大

// 存放第一个选中的元素和最后一个选中元素，只能存放这两个元素
let selectedList = [];

let overList = [];

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  emits: ["selectedVal"],
  setup(props, { emit }) {
    let currentValue = props.value;

    let rateDisabled = computed(() => {
      return props.disabled;
    });

    let classes = computed(() => {
      let result = [];
      let i = 0;
      let threshold = currentValue;
      if (currentValue !== Math.floor(currentValue)) {
        threshold--;
      }
      for (; i < threshold; i++) {
        result.push(activeClass);
      }
      for (; i < props.max; i++) {
        result.push(voidClass);
      }
      return result;
    });

    const setCurrentValue = (index, event) => {
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

    const resetCurrentValue = index => {
      // 移除先检查是否选中 选中则返回false 不移除
      const currentHsDom = document.querySelector("." + voidClass + index);
      if (currentHsDom.className.includes(stayClass)) {
        return false;
      } else {
        removeClass(currentHsDom, activeClass);
      }

      // 当选中一个元素后，开始移除背景色
      if (selectedList.length === 1) {
        let firstIndex = overList[0].index;
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

    const selectValue = (index, item) => {
      let len = selectedList.length;

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
          for (let i = 0; i <= props.max; i++) {
            let currentDom = document.querySelector(".hs-select__item" + i);
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

    return {
      rateDisabled,
      setCurrentValue,
      resetCurrentValue,
      selectValue,
      classes
    };
  }
});
</script>

<style scoped>
.hs-rate__icon {
  font-size: 18px;
  transition: 0.3s;
}
.hs-item {
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  line-height: 30px;
}
.hs-on {
  background-color: #409eff;
  border-radius: 50%;
}
.hs-range {
  background-color: #f2f6fc;
}
.both-left-sides {
  border-radius: 50% 0 0 50%;
}
.both-right-sides {
  border-radius: 0 50% 50% 0;
}
</style>
