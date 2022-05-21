<script setup lang="ts">
import { computed, ref, unref, nextTick } from "vue";
import type { CSSProperties, PropType } from "vue";
import {
  tryOnMounted,
  tryOnUnmounted,
  templateRef,
  useDebounceFn
} from "@vueuse/core";
import * as utilsMethods from "./utils";
const { animationFrame, copyObj } = utilsMethods;
animationFrame();

defineOptions({
  name: "ReSeamlessScroll"
});

const props = defineProps({
  data: {
    type: Array as PropType<unknown>
  },
  classOption: {
    type: Object as PropType<unknown>
  }
});

const emit = defineEmits<{
  (e: "scrollEnd"): void;
}>();

let xPos = ref<number>(0);
let yPos = ref<number>(0);
let delay = ref<number>(0);
let height = ref<number>(0);
// 外容器宽度
let width = ref<number>(0);
// 内容实际宽度
let realBoxWidth = ref<number>(0);
let realBoxHeight = ref<number>(0);
let copyHtml = ref("");
// single 单步滚动的定时器
let singleWaitTime = null;
// move动画的animationFrame定时器
let reqFrame = null;
let startPos = null;
//记录touchStart时候的posY
let startPosY = null;
//记录touchStart时候的posX
let startPosX = null;
// mouseenter mouseleave 控制scrollMove()的开关
let isHover = false;
let ease = "ease-in";

// eslint-disable-next-line vue/no-setup-props-destructure
let { classOption } = props;

if (classOption["key"] === undefined) {
  classOption["key"] = 0;
}

const wrap = templateRef<HTMLElement | null>(`wrap${classOption["key"]}`, null);
const slotList = templateRef<HTMLElement | null>(
  `slotList${classOption["key"]}`,
  null
);
const realBox = templateRef<HTMLElement | null>(
  `realBox${classOption["key"]}`,
  null
);

let leftSwitchState = computed(() => {
  return unref(xPos) < 0;
});

let rightSwitchState = computed(() => {
  return Math.abs(unref(xPos)) < unref(realBoxWidth) - unref(width);
});

let defaultOption = computed(() => {
  return {
    //步长
    step: 1,
    //启动无缝滚动最小数据数
    limitMoveNum: 5,
    //是否启用鼠标hover控制
    hoverStop: true,
    // bottom 往下 top 往上(默认) left 向左 right 向右
    direction: "top",
    //开启移动端touch
    openTouch: true,
    //单条数据高度有值hoverStop关闭
    singleHeight: 0,
    //单条数据宽度有值hoverStop关闭
    singleWidth: 0,
    //单步停止等待时间
    waitTime: 1000,
    switchOffset: 30,
    autoPlay: true,
    navigation: false,
    switchSingleStep: 134,
    switchDelay: 400,
    switchDisabledClass: "disabled",
    // singleWidth/singleHeight 是否开启rem度量
    isSingleRemUnit: false
  };
});

let options = computed(() => {
  // @ts-ignore
  return copyObj({}, unref(defaultOption), classOption);
});

const leftSwitchClass = computed(() => {
  return unref(leftSwitchState) ? "" : unref(options).switchDisabledClass;
});

let rightSwitchClass = computed(() => {
  return unref(rightSwitchState) ? "" : unref(options).switchDisabledClass;
});

let leftSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 -${unref(options).switchOffset}px`,
    transform: "translate(-100%,-50%)"
  };
});

let rightSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 ${
      unref(width) + unref(options).switchOffset
    }px`,
    transform: "translateY(-50%)"
  };
});

let isHorizontal = computed(() => {
  return (
    unref(options).direction !== "bottom" && unref(options).direction !== "top"
  );
});

let float = computed((): CSSProperties => {
  return unref(isHorizontal)
    ? { float: "left", overflow: "hidden" }
    : { overflow: "hidden" };
});

let pos = computed(() => {
  return {
    transform: `translate(${unref(xPos)}px,${unref(yPos)}px)`,
    transition: `all ${ease} ${unref(delay)}ms`,
    overflow: "hidden"
  };
});

let navigation = computed(() => {
  return unref(options).navigation;
});

let autoPlay = computed(() => {
  if (unref(navigation)) return false;
  return unref(options).autoPlay;
});

let scrollSwitch = computed(() => {
  // 从 props 解构出来的 属性 不再具有相应性.
  return props.data.length >= unref(options).limitMoveNum;
});

let hoverStopSwitch = computed(() => {
  return unref(options).hoverStop && unref(autoPlay) && unref(scrollSwitch);
});

let canTouchScroll = computed(() => {
  return unref(options).openTouch;
});

let baseFontSize = computed(() => {
  return unref(options).isSingleRemUnit
    ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize)
    : 1;
});

let realSingleStopWidth = computed(() => {
  return unref(options).singleWidth * unref(baseFontSize);
});

let realSingleStopHeight = computed(() => {
  return unref(options).singleHeight * unref(baseFontSize);
});

let step = computed(() => {
  let singleStep;
  let step = unref(options).step;
  if (unref(isHorizontal)) {
    singleStep = unref(realSingleStopWidth);
  } else {
    singleStep = unref(realSingleStopHeight);
  }
  if (singleStep > 0 && singleStep % step > 0) {
    throw "如果设置了单步滚动，step需是单步大小的约数，否则无法保证单步滚动结束的位置是否准确";
  }
  return step;
});

function reset() {
  xPos.value = 0;
  yPos.value = 0;
  scrollCancle();
  scrollInitMove();
}

function leftSwitchClick() {
  if (!unref(leftSwitchState)) return;
  // 小于单步距离
  if (Math.abs(unref(xPos)) < unref(options).switchSingleStep) {
    xPos.value = 0;
    return;
  }
  xPos.value += unref(options).switchSingleStep;
}

function rightSwitchClick() {
  if (!unref(rightSwitchState)) return;
  // 小于单步距离
  if (
    unref(realBoxWidth) - unref(width) + unref(xPos) <
    unref(options).switchSingleStep
  ) {
    xPos.value = unref(width) - unref(realBoxWidth);
    return;
  }
  xPos.value -= unref(options).switchSingleStep;
}

function scrollCancle() {
  cancelAnimationFrame(reqFrame || "");
}

function touchStart(e) {
  if (!unref(canTouchScroll)) return;
  let timer;
  //touches数组对象获得屏幕上所有的touch，取第一个touch
  const touch = e.targetTouches[0];
  const { waitTime, singleHeight, singleWidth } = unref(options);
  //取第一个touch的坐标值
  startPos = {
    x: touch.pageX,
    y: touch.pageY
  };
  //记录touchStart时候的posY
  startPosY = unref(yPos);
  //记录touchStart时候的posX
  startPosX = unref(xPos);
  if (!!singleHeight && !!singleWidth) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      scrollCancle();
    }, waitTime + 20);
  } else {
    scrollCancle();
  }
}

function touchMove(e) {
  //当屏幕有多个touch或者页面被缩放过，就不执行move操作
  if (
    !unref(canTouchScroll) ||
    e.targetTouches.length > 1 ||
    (e.scale && e.scale !== 1)
  )
    return;
  const touch = e.targetTouches[0];
  const { direction } = unref(options);
  let endPos = {
    x: touch.pageX - startPos.x,
    y: touch.pageY - startPos.y
  };
  //阻止触摸事件的默认行为，即阻止滚屏
  e.preventDefault();
  //dir，1表示纵向滑动，0为横向滑动
  const dir = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0;
  if (
    (dir === 1 && direction === "bottom") ||
    (dir === 1 && direction === "top")
  ) {
    // 表示纵向滑动 && 运动方向为上下
    yPos.value = startPosY + endPos.y;
  } else if (
    (dir === 0 && direction === "left") ||
    (dir === 0 && direction === "right")
  ) {
    // 为横向滑动 && 运动方向为左右
    xPos.value = startPosX + endPos.x;
  }
}

function touchEnd() {
  if (!unref(canTouchScroll)) return;
  let timer;
  const direction = unref(options).direction;
  delay.value = 50;
  if (direction === "top") {
    if (unref(yPos) > 0) yPos.value = 0;
  } else if (direction === "bottom") {
    let h = (unref(realBoxHeight) / 2) * -1;
    if (unref(yPos) < h) yPos.value = h;
  } else if (direction === "left") {
    if (unref(xPos) > 0) xPos.value = 0;
  } else if (direction === "right") {
    let w = unref(realBoxWidth) * -1;
    if (unref(xPos) < w) xPos.value = w;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    delay.value = 0;
    scrollMove();
  }, unref(delay));
}

function enter() {
  if (unref(hoverStopSwitch)) scrollStopMove();
}

function leave() {
  if (unref(hoverStopSwitch)) scrollStartMove();
}

function scrollMove() {
  // 鼠标移入时拦截scrollMove()
  if (isHover) return;
  //进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
  // scrollCancle();
  reqFrame = requestAnimationFrame(function () {
    //实际高度
    const h = unref(realBoxHeight) / 2;
    //宽度
    const w = unref(realBoxWidth) / 2;
    let { direction, waitTime } = unref(options);
    if (direction === "top") {
      // 上
      if (Math.abs(unref(yPos)) >= h) {
        emit("scrollEnd");
        yPos.value = 0;
      }
      yPos.value -= step.value;
    } else if (direction === "bottom") {
      // 下
      if (unref(yPos) >= 0) {
        emit("scrollEnd");
        yPos.value = h * -1;
      }
      yPos.value += step.value;
    } else if (direction === "left") {
      // 左
      if (Math.abs(unref(xPos)) >= w) {
        emit("scrollEnd");
        xPos.value = 0;
      }
      xPos.value -= step.value;
    } else if (direction === "right") {
      // 右
      if (unref(xPos) >= 0) {
        emit("scrollEnd");
        xPos.value = w * -1;
      }
      xPos.value += step.value;
    }
    if (singleWaitTime) clearTimeout(singleWaitTime);
    if (unref(realSingleStopHeight)) {
      //是否启动了单行暂停配置
      if (Math.abs(unref(yPos)) % unref(realSingleStopHeight) < unref(step)) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else if (unref(realSingleStopWidth)) {
      if (Math.abs(unref(xPos)) % unref(realSingleStopWidth) < unref(step)) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else {
      scrollMove();
    }
  });
}

function scrollInitMove() {
  nextTick(() => {
    const { switchDelay } = unref(options);
    //清空copy
    copyHtml.value = "";
    if (unref(isHorizontal)) {
      height.value = unref(wrap).offsetHeight;
      width.value = unref(wrap).offsetWidth;
      let slotListWidth = unref(slotList).offsetWidth;
      // 水平滚动设置warp width
      if (unref(autoPlay)) {
        // 修正offsetWidth四舍五入
        slotListWidth = slotListWidth * 2 + 1;
      }
      unref(realBox).style.width = slotListWidth + "px";
      realBoxWidth.value = slotListWidth;
    }

    if (unref(autoPlay)) {
      ease = "ease-in";
      delay.value = 0;
    } else {
      ease = "linear";
      delay.value = switchDelay;
      return;
    }

    // 是否可以滚动判断
    if (unref(scrollSwitch)) {
      let timer;
      if (timer) clearTimeout(timer);
      copyHtml.value = unref(slotList).innerHTML;
      setTimeout(() => {
        realBoxHeight.value = unref(realBox).offsetHeight;
        scrollMove();
      }, 0);
    } else {
      scrollCancle();
      yPos.value = xPos.value = 0;
    }
  });
}

function scrollStartMove() {
  //开启scrollMove
  isHover = false;
  scrollMove();
}

function scrollStopMove() {
  //关闭scrollMove
  isHover = true;
  // 防止频频hover进出单步滚动,导致定时器乱掉
  if (singleWaitTime) clearTimeout(singleWaitTime);
  scrollCancle();
}

// 鼠标滚轮事件
function wheel(e) {
  e.preventDefault();
  if (
    unref(options).direction === "left" ||
    unref(options).direction === "right"
  )
    return;
  useDebounceFn(() => {
    e.deltaY > 0 ? (yPos.value -= step.value) : (yPos.value += step.value);
  }, 50)();
}

// watchEffect(() => {
//   const watchData = data;
//   if (!watchData) return;
//   nextTick(() => {
//     reset();
//   });

//   const watchAutoPlay = unref(autoPlay);
//   if (watchAutoPlay) {
//     reset();
//   } else {
//     scrollStopMove();
//   }
// });

tryOnMounted(() => {
  scrollInitMove();
});

tryOnUnmounted(() => {
  scrollCancle();
  clearTimeout(singleWaitTime);
});

defineExpose({
  reset
});
</script>

<template>
  <div :ref="'wrap' + classOption['key']">
    <div
      :style="leftSwitch"
      v-if="navigation"
      :class="leftSwitchClass"
      @click="leftSwitchClick"
    >
      <slot name="left-switch" />
    </div>
    <div
      :style="rightSwitch"
      v-if="navigation"
      :class="rightSwitchClass"
      @click="rightSwitchClick"
    >
      <slot name="right-switch" />
    </div>
    <div
      :ref="'realBox' + classOption['key']"
      :style="pos"
      @mouseenter="enter"
      @mouseleave="leave"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @mousewheel="wheel"
    >
      <div :ref="'slotList' + classOption['key']" :style="float">
        <slot />
      </div>
      <div v-html="copyHtml" :style="float" />
    </div>
  </div>
</template>
