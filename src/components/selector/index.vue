<template>
  <table cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td
          v-for="(item, key) in max"
          :class="['hs-select__item' + key]"
          @mousemove="setCurrentValue(key, $event)"
          @mouseleave="resetCurrentValue(key)"
          @click="selectValue(key, item)"
          :style="{ cursor: rateDisabled ? 'auto' : 'pointer', 'text-align': 'center' }"
          :key="key"
        >
          <div :class="[classes[key] + key]" class="hs-item">
            <span>22</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang='ts'>
import { defineComponent, computed, nextTick } from "vue";
import { addClass, removeClass } from "../../utils/operate/index";
import { useDebounceFn } from "@vueuse/core";

// 选中非选中状态
let stayClass = "stay"; //鼠标点击
let activeClass = "hs-on"; //鼠标移动上去
let voidClass = "hs-off"; //鼠标移开
let inRange = "hs-range"; //当前选中的两个元素之间的背景

// 存放第一个选中的元素和最后一个选中元素，只能存放这两个元素
let selectedList = [];

let overList = [];

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10,
    },
  },
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
        overList.push({ index });

        // let i = 0;

        let firstIndex = overList[0].index;
        // 往左走，索引变大

        if (index > firstIndex) {
          // console.log(index, firstIndex);
          let leftIndex = index - firstIndex;

          for (var i =0; i < index; i++) {
            // useDebounceFn(() => {
              if(document.querySelector(".hs-select__item" + (i+index))) {
              addClass(document.querySelector(".hs-select__item" + (i+index)), inRange);
              }
            // }, 100)();
          }
        } else {
        }
      }

      addClass(document.querySelector("." + voidClass + index), activeClass);
    };

    const resetCurrentValue = (index) => {
      // 移除先检查是否选中 选中则返回false 不移除
      const currentHsDom = document.querySelector("." + voidClass + index);
      if (currentHsDom.className.includes(stayClass)) {
        return false;
      } else {
        removeClass(currentHsDom, activeClass);
      }

      // 当选中一个元素后，开始移除背景色
      if (selectedList.length === 1) {
        for (let i = 0; i <= index; i++) {
          removeClass(document.querySelector(".hs-select__item" + i), inRange);
        }
      }
    };

    const selectValue = (index, item) => {
      let len = selectedList.length;

      if (len < 2) {
        selectedList.push({ item, index });
        addClass(document.querySelector("." + voidClass + index), stayClass);

        // let rangeDom = document.querySelector(".hs-select__item" + index)
      } else {
        nextTick(() => {
          selectedList.forEach((v) => {
            removeClass(
              document.querySelector("." + voidClass + v.index),
              activeClass,
              stayClass
            );
          });
          selectedList = [];

          for (let i = 0; i <= props.max; i++) {
            let currentDom = document.querySelector(".hs-select__item" + i);
            if (currentDom) {
              removeClass(currentDom, inRange);
            }
          }
        });
      }
    };

    return {
      rateDisabled,
      setCurrentValue,
      resetCurrentValue,
      selectValue,
      classes,
    };
  },
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
  background-color: #ccc;
}
</style>
